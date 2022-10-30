import { HttpStatus } from '@nestjs/common';

export type CustomResponse = {
  statusCode: HttpStatus,
  message: string
}