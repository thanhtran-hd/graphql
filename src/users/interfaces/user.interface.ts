import { Roles } from '../../core/enum';

export interface ReqUser {
  id: number;
  email: string;
  address: string;
  phoneNumber: string;
  role: Roles;
}
