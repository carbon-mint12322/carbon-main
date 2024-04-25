import { CustomHttpError } from '~/backendlib/types';

const UnprocessableEntity = 'UnprocessableEntityError';

function UnprocessableEntityError(message: string): CustomHttpError {
  return {
    type: UnprocessableEntity,
    message,
    isHttpError: true,
    statusCode: 422,
  };
}

export { UnprocessableEntityError, UnprocessableEntity };
