export type ErrorData = {
  status: number;
  message: string;
  data?: unknown;
};

export class AppError extends Error {
  status: number;
  data?: unknown;

  constructor(data: ErrorData = { message: 'internal server error', status: 500 }) {
    super(data.message);

    this.status = data.status;
    this.data = data.data;
  }
}
