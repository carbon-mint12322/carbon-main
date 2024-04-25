import Link from "next/link";
import Button from '@mui/material/Button';
import styles from './Page404.module.css';
import { useEffect } from "react";
import { useRouter } from 'next/router';
import { useOperator } from "~/contexts/OperatorContext";
import { useUser } from "~/contexts/AuthDialogContext";
import { CircularProgress } from "@mui/material";

const Page404 = () => {
  const router = useRouter()
  const operator = useOperator();
  const { user } = useUser()
  useEffect(()=> {
    setTimeout(()=> {
      // router.push('/')
    }, 10000)
  })

  if(operator.loading) {
    return <CircularProgress />
  }

  return (
    <div className={styles.container404}>
      Opps.
      <h1 className={styles.header404}>The page you are looking for does not exists.</h1>
      <p>
        If you want to return home page
      </p>
      <Link href={user ? `${operator.baseURl}/dashboard` : '/public/login'} >
        <Button
          sx={{
            my: 2,
            height: '56px',
            fontSize: '16px',
            fontWeight: 600,
          }}

          variant='contained'
        >
          Click Here
        </Button>
      </Link>
    </div>
  )
}

export default Page404;
