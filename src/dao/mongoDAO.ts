import { Document, HydratedDocument, Model, Query, Types } from "mongoose";
import { IPaginateResult } from "./pagination";
import { DBSort } from "./sorting";

import { BadRequestException, NotFoundException } from "@nestjs/common";
import { DTO, DTOCreate, DTOPatch } from "../datamodels/dto";
import { extractFields, flattenObj } from "../util/common";
import { DAOI } from "./daoI";

export type TDoc<T extends DTO> = Document & DTOCreate<T>
export type ModelType<T extends DTO> = Model<TDoc<T>>


const ID = Types.ObjectId;
export type MongoQuery<T extends DTO> = Query<HydratedDocument<TDoc<T>, object, object>[], HydratedDocument<TDoc<T>, object, object>, object, T>


export class MongoDAO<TData extends DTO> implements DAOI<TData>{

  protected model: ModelType<TData>
  protected dto: TData = null

  constructor(model: ModelType<TData>, dto: TData) {
    this.model = model;
    this.dto = dto;
  }

  private createDTO(): TData {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const constructor = this.dto.constructor as any;
    const obj: TData = new constructor();
    return obj;
  }

  // EXTERNAL FUNCTIONS BELOW

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public async find(cond: any = {}, page = 1, perPage = 10, populate: string[] = [],
    sort: Record<string, DBSort> = { "createdAt": DBSort.DESCENDING }): Promise<IPaginateResult<TData>> {
    return await this.model.find().exec() as any
    this.throwIfNotValidPageOrPerPage(page, perPage)
    const { skip, limit } = this.getPaginationSkipAndLimitCounts(page, perPage)
    const unslicedData = await this.createAndExecuteFindQuery(cond, populate, skip, limit, sort);
    const { data, hasNext, hasPrevious } = this.getHasNextHasPreviousAndDataAfterSlicing(unslicedData, page, perPage)
    const result = data.map((item) => this.extractDtoFromMongooseObject(item));
    return this.getPaginatedResult(result, hasNext, hasPrevious, page, perPage)

  }

  public async findById(id: string, populate: string[] = []): Promise<TData> {
    const result = await this.find({ "_id": new ID(id) }, 1, 10, populate);
    this.throwIfNotFound(id, result)
    return result.data[0];
  }

  public async update(Id: string, record: DTOPatch<TData>): Promise<TData> {
    const query = this.model.findById(Id)
    const mongooseObject = await query
    this.processData(record, mongooseObject)
    const updatedMongooseObject = await mongooseObject.save();
    return this.extractDtoFromMongooseObject(updatedMongooseObject);
  }

  public async create(record: DTOCreate<TData>): Promise<string> {
    const mongooseObject = this.getNewMongooseObjectForThisModel()
    this.processData(record, mongooseObject)
    const result = await mongooseObject.save();
    return String(result._id);
  }

  public async delete(id: string): Promise<string> {
    const existing = await this.model.findById(id);
    await existing.remove();
    return id;
  }

  // HELPER INTERNAL FUNCTIONS BELOW

  private throwIfNotFound(id: string, paginatedResult: IPaginateResult<TData>) {
    if (!paginatedResult.data.length) {
      throw new NotFoundException(`record with ${id} not found`)
    }
  }

  private getNewMongooseObjectForThisModel() {
    return new this.model();
  }

  private processData(record: DTOPatch<TData>, mongooseObject: HydratedDocument<TDoc<TData>, object, unknown>): void {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let myrecord = record as any;
    myrecord = flattenObj(myrecord);
    const keys = this.extractKeysFromFlatObject(myrecord);
    this.attachKeyValuePairsToMongooseObject(mongooseObject, keys, myrecord)
  }

  private extractKeysFromFlatObject(dto: DTOPatch<TData>): string[] {
    return Object.keys(dto)
  }

  private extractDtoFromMongooseObject(updatedMongooseObject: TDoc<TData>) {
    let dto = this.createDTO();
    dto = extractFields(dto, updatedMongooseObject);
    return dto
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private attachKeyValuePairsToMongooseObject(mongooseObject: HydratedDocument<TDoc<TData>, object, unknown>, keys: string[], myrecord: any): void {
    for (const k of keys) {
      mongooseObject.set(k, myrecord[k]);
    }
  }

  private getPaginatedResult(res: TData[], hasNext: boolean, hasPrevious: boolean, page: number, perPage: number): IPaginateResult<TData> {
    return {
      data: res,
      pagination: {
        hasNext: hasNext,
        hasPrevious: hasPrevious,
        perPage: perPage,
        page: page,
        next: "",
        previous: ""
      }
    };
  }

  private throwIfNotValidPageOrPerPage(page: number, perPage: number): void {
    if (page < 1) {
      throw new BadRequestException("Page cannot be smaller than 1");
    }
    if (perPage < 1) {
      throw new BadRequestException("perPage cannot be smaller than 1");
    }
  }

  private getPaginationSkipAndLimitCounts(page: number, perPage: number): { skip: number, limit: number } {
    let skip = (page - 1) * perPage;
    skip = page > 1 ? skip - 1 : skip;
    const limit = page > 1 ? perPage + 2 : perPage + 1;  // get one extra result for checking more records
    return { skip, limit }
  }

  private populateQuery(query: Query<HydratedDocument<TDoc<TData>, object, object>[], HydratedDocument<TDoc<TData>, object, object>, object, TDoc<TData>>, populate: string[]): void {
    for (const field of populate) {
      query = query.populate(field) as MongoQuery<TData>;
    }
  }

  private getHasNextHasPreviousAndDataAfterSlicing(unslicedData: HydratedDocument<TDoc<TData>, object, object>[], page: number, perPage: number) {
    const dataCount = unslicedData.length;
    const hasPrevious = page > 1 && dataCount > 0;
    const lower = hasPrevious ? 1 : 0;

    const hasNext = dataCount > (perPage + lower);
    const upper = hasNext ? (perPage + lower) : dataCount;
    const data = unslicedData.slice(lower, upper);
    return { data, hasNext, hasPrevious }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private async createAndExecuteFindQuery(cond: MongoQuery<TData>, populate: string[] = [], skip: number, limit: number, sort: Record<string, DBSort> = { "createdAt": DBSort.DESCENDING }) {
    let query = this.model.find(cond);
    this.populateQuery(query, populate)
    query = query.skip(skip).limit(limit).sort(sort)
    return await query.exec();
  }

}