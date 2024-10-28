import type { StatusCode } from '../constants/status-code.ts';

export type ErrorData = {
  status: StatusCode;
  message: string;
  data?: unknown;
};

export class AppError extends Error {
  status: StatusCode;
  data?: unknown;

  constructor(data: ErrorData = { message: 'internal server error', status: 500 }) {
    super(data.message);

    this.status = data.status;
    this.data = data.data;
  }
}
