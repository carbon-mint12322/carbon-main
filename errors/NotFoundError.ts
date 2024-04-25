import { CustomHttpError } from '~/backendlib/types';

const NotFound = 'NotFoundError';

function NotFoundError(message: string): CustomHttpError {
  return {
    type: NotFound,
    message,
    isHttpError: true,
    statusCode: 404,
  };
}

export { NotFoundError, NotFound };
