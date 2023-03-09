import { registerEnumType } from 'type-graphql';

export enum Roles {
  ADMIN = 'admin',
  AUTHOR = 'author',
}

registerEnumType(Roles, { name: 'Roles' });
