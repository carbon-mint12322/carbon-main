import { CircularProgress } from '@mui/material';
import { useOperator } from '~/contexts/OperatorContext';
import Page404 from './public/404';

const Error404 = () => {
  const operator = useOperator();
  if (operator.loading) {
    return <CircularProgress />;
  }

  return <Page404 />;
};

export default Error404;
