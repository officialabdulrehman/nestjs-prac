export interface IPaginateResult<T> {
  data: T[];
  pagination: IPagination;
}

export interface IPagination {
  perPage: number;
  page: number;
  hasPrevious: boolean;
  hasNext: boolean;
  next: string;
  previous: string;

}