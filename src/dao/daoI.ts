import { DTO, DTOCreate, DTOPatch } from "../datamodels/dto";
import { IPaginateResult } from "./pagination";
import { IQuery } from "./query";
import { DBSort } from "./sorting";


export interface DAOI<T extends DTO> {
  find(cond: IQuery<T>, page: number, perPage: number, populates?: string[],
    sort?: Record<string, DBSort>): Promise<IPaginateResult<T>>;

  create(data: DTOCreate<T>): Promise<string>;

  findById(id: string, populate?: string[]): Promise<T>;

  update(Id: string, record: DTOPatch<T>): Promise<T>;

  delete(id: string): Promise<string>;

}