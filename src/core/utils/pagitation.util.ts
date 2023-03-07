import { Like, FindOperator } from 'typeorm';
import { FilterPagination } from '../interfaces/filter.interface';

export function buildPagination({ page, limit, ...filters }: FilterPagination): object {
  const skip = limit * (page - 1);
  const take = limit;
  const where: Record<string, FindOperator<string>> = {};

  Object.keys(filters).forEach((key) => {
    const value = filters[key];
    if (value === '') {
      return;
    }
    where[key] = Like(`%${value}%`);
    return;
  });
  return {
    skip,
    take,
    where,
  };
}
