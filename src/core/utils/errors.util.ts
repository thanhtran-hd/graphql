import { ApolloError } from 'apollo-server-core';

export class BadRequest extends ApolloError {
  constructor(message: string) {
    super(message);

    if (!this.name) {
      Object.defineProperty(this, 'name', { value: 'ApolloError' });
    }

    this.extensions = {
      code: 'BAD REQUEST ERROR',
      statusCode: '404',
      exception: { stacktrace: message },
    };
  }
}

export class Unauthorized extends ApolloError {
  constructor(message: string) {
    super(message);

    if (!this.name) {
      Object.defineProperty(this, 'name', { value: 'ApolloError' });
    }

    this.extensions = {
      code: 'UNAUTHORIZED ERROR',
      statusCode: '401',
      exception: { stacktrace: message },
    };
  }
}

export class OutOfStock extends ApolloError {
  constructor(message: string) {
    super(message);

    if (!this.name) {
      Object.defineProperty(this, 'name', { value: 'ApolloError' });
    }

    this.extensions = {
      code: 'OUT OF STOCK ERROR',
      statusCode: '456',
      exception: { stacktrace: message },
    };
  }
}

export class InternalServerError extends ApolloError {
  constructor(message: string) {
    super(message);

    if (!this.name) {
      Object.defineProperty(this, 'name', { value: 'ApolloError' });
    }

    this.extensions = {
      code: 'INTERNAL SERVER ERROR',
      statusCode: '500',
      exception: { stacktrace: message },
    };
  }
}
