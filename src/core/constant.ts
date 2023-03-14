export const ROUNDS_NUMBER = 10;

export const TRANSACTION_AMOUNT_RETRIES = {
  GET_VOUCHER: 5,
};

export const BULL = {
  QUEUE: {
    SENDMAIL: {
      TOTAL_ATTEMPTS: 5,
      BACKOFF_DELAY: 2000,
      CONCURENCY: 50,
    },
  },
};

export const EDIT_EXP_TIME = 60;

export const SENDMAIL_QUEUE = 'sendVoucherCodeQueue';
