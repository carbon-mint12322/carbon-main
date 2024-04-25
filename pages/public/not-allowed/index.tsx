import Link from "next/link";
import Button from '@mui/material/Button';
import styles from './ErrorPage.module.css';

const ErrorPage = () => {
  return (
    <div className={styles.container404}>
      Opps.
      <h1 className={styles.header404}>You do not have permission to access this app.</h1>
      <p>Please contact admin for the access.</p>
      <Link href="/public/login" >
        <Button
          sx={{
            my: 2,
            height: '56px',
            fontSize: '16px',
            fontWeight: 600,
          }}

          variant='contained'
        >
          Click Here To Go Home
        </Button>
      </Link>
    </div>
  );
};

export default ErrorPage;
