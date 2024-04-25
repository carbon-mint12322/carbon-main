export { default } from '../../../[org]/workflow';
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '50mb',
      responseLimit: false,
    },
  },
};
