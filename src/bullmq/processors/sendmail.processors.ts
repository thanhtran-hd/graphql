import { Job } from 'bullmq';
import { logger } from '../../core/utils/logger.util';
import { sendEmail } from '../../core/utils/send-email.util';

export const sendCodeVoucherProcessor = async (job: Job) => {
  logger.info(`Sent email attemp: ${job.attemptsMade}`);

  await sendEmail({
    email: job.data.email,
    subject: 'Voucher code',
    template: 'send-code',
    context: { code: job.data.code },
  });
  logger.info('Email sent sucessfully');
};
