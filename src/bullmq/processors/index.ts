import { Processor } from 'bullmq';
import { sendCodeVoucherProcessor } from './sendmail.processors';

export const processsors: Record<string, Processor> = {
  sendVoucherCodeQueue: sendCodeVoucherProcessor,
};
