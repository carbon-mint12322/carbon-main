import { useEffect, useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import Image from 'next/image';
import {
  RecaptchaVerifier,
  signInWithCredential,
  PhoneAuthProvider,
  signInWithPhoneNumber,
} from 'firebase/auth';
import type { User, UserInfo } from 'firebase/auth';

import { getAuth } from '../../utils/initAuth';
import { useUser } from '../../contexts/AuthDialogContext';

import { formatPhoneNumber } from '../../utils';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';

import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import useMediaQuery from '@mui/material/useMediaQuery';

import { useTheme } from '@mui/material/styles';

import { setRefreshCookie } from '../../frontendlib/cookies';
import { useAlert } from '~/contexts/AlertContext';
import { isNull } from 'lodash';
import { signIn, useSession } from 'next-auth/react';
import md5 from 'md5';

const MuiPhoneNumber = dynamic(import('material-ui-phone-number'));

interface FormSignIn {
  phoneNumber: string;
}

interface FormOTP {
  otp: string;
}

interface FormPin {
  pin: string;
}

// To get around typescript compilation errors
declare global {
  interface Window {
    recaptchaVerifier: any;
  }
}

const orText = {
  margin: '10px',
  textAlign: 'center',
};

const AuthLogin = (props: any) => {
  const theme = useTheme();
  const router = useRouter();
  const redirect: string =
    (router.query.redirect as string) || props.redirect || '/private/farmbook';
  const matchDownSM = useMediaQuery(theme.breakpoints.down('md'));
  const { handleUserNavigation } = useUser();
  const [verificationId, setVerificationId] = useState<string>('');
  const authentication = getAuth();
  const { openToast } = useAlert();
  const session = useSession();
  const [mobileNumber, setMobileNumber] = useState('');

  function loginWithGoogle() {
    return signIn('google', {
      callbackUrl: (redirect as string) || `/private/farmbook`,
    });
  }

  useEffect(() => {
    if (session.status === 'authenticated') {
      handleUserNavigation(session.data.user);
    }
  }, [session]);

  const generateRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        'captchaContainer',
        {
          size: 'invisible',
        },
        authentication,
      );
      window.recaptchaVerifier.verify();
    }
  };

  const initiateRecaptcha = () => {
    return new Promise<void>((resolve) => {
      authentication.useDeviceLanguage();
      // only for dev environment disable app verification
      // if (process.env.NEXT_PUBLIC_TENANT_NAME === 'reactml-dev')
      // authentication.settings.appVerificationDisabledForTesting = true;
      window.recaptchaVerifier = new RecaptchaVerifier(
        'captchaContainer',
        {
          size: 'invisible',
          callback: () => {},
          'expired-callback': () => {
            // window.location.reload();
          },
        },
        authentication,
      );

      window.recaptchaVerifier.render().then(function (widgetId: any) {
        // @ts-ignore
        window.recaptchaWidgetId = widgetId;
        resolve();
      });
    });
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  // useEffect(generateRecaptcha);

  const loginWithPhoneNumber = async (values: FormSignIn) => {
    const appVerifier = window.recaptchaVerifier;
    const formattedPhoneNumber = formatPhoneNumber(values.phoneNumber);

    try {
      const verifyId = await signInWithPhoneNumber(
        authentication,
        formattedPhoneNumber,
        appVerifier,
      );
      if (verifyId) {
        setVerificationId(verifyId.verificationId);
        // generateRecaptcha();
        setLoginbox(2);
      }
    } catch (e: any) {
      openToast(
        'error',
        'There was an error while sending the OTP, please try again. If the problem persists, close this browser and open a new browser window.',
      );
      console.log('e', e);
    }
  };

  const submitOTP = async (values: FormOTP) => {
    try {
      const authCredential = PhoneAuthProvider.credential(verificationId, values.otp);
      const userCredential = await signInWithCredential(authentication, authCredential);
      if (userCredential?.user.refreshToken) {
        setRefreshCookie(userCredential?.user.refreshToken);
        const token = await authentication?.currentUser?.getIdToken();
        await signIn('credentials', {
          firebaseToken: token,
          callbackUrl: (redirect as string) || `/private/farmbook`,
        });
        // router.push(redirect);
      }
    } catch (e: any) {
      openToast('error', 'Something went wrong');
      console.log('e', e);
    }
  };

  const submitPin = async (values: FormPin) => {
    try {
      await signIn('credentials', {
        mobile: formatPhoneNumber(mobileNumber),
        pin: md5(values.pin),
        callbackUrl: (redirect as string) || `/private/farmbook`,
      });
    } catch (e: any) {
      openToast('error', 'Something went wrong');
      console.log('e', e);
    }
  };
  const [loginbox, setLoginbox] = useState(1);

  const loginBoxActive = () => {
    return (
      <Box>
        <div id='captchaContainer'></div>
        <Formik
          initialValues={{ phoneNumber: '' }}
          validationSchema={Yup.object({
            phoneNumber: Yup.string()
              // eslint-disable-next-line
              .matches(/^[+][0-9\s\-]*$/, 'Phone number is not valid')
              .required('Phone number is required'),
          })}
          onSubmit={async (values) => {
            if (values.phoneNumber.length == 15) {
              await initiateRecaptcha();
              await loginWithPhoneNumber(values);
            } else {
              openToast('error', 'Number must be of 10 digits');
            }
          }}
        >
          {({ values, handleChange, errors, touched, setFieldValue, setFieldTouched }) => (
            <Form>
              <MuiPhoneNumber
                id='phoneNumberInput'
                name='phoneNumber'
                countryCodeEditable={false}
                onlyCountries={['in']}
                defaultCountry='in'
                value={values.phoneNumber}
                onChange={(e) => {
                  setFieldTouched('phoneNumber', true);
                  setFieldValue('phoneNumber', e);
                  handleChange(e);
                  setMobileNumber(e.toString());
                }}
                error={touched.phoneNumber && Boolean(errors.phoneNumber)}
                helperText={touched.phoneNumber && errors.phoneNumber}
                sx={{ width: '100%', '& svg': { width: '24px' } }}
              />
              <Button
                id='mobileNumberLoginButton'
                sx={{
                  my: 2,
                  height: '56px',
                  fontSize: '16px',
                  fontWeight: 600,
                }}
                type='submit'
                variant='contained'
                fullWidth
              >
                Login with OTP
              </Button>
              <Button
                id='mobileNumberLoginButton'
                sx={{
                  my: 2,
                  height: '56px',
                  fontSize: '16px',
                  fontWeight: 600,
                }}
                type='button'
                variant='contained'
                onClick={() => setLoginbox(3)}
                fullWidth
              >
                Login with PIN
              </Button>
            </Form>
          )}
        </Formik>
        <Box component='p' sx={orText} color='textSecondary'>
          {' '}
          Or{' '}
        </Box>
        <Button
          id='loginViaGoogleButton'
          disableElevation
          fullWidth
          variant='outlined'
          color='secondary'
          sx={{
            width: '100%',
            height: '56px',
            color: 'dark.light',
            fontSize: '16px',
            fontWeight: 600,
          }}
          onClick={() => loginWithGoogle()}
        >
          <Box mr={2} mt={1}>
            <Image
              src='/assets/images/icons/social-google.svg'
              alt='google'
              width={24}
              height={24}
            />
          </Box>
          Login via Google Account
        </Button>
      </Box>
    );
  };

  const otpBoxActive = () => {
    return (
      <Box>
        <Formik
          initialValues={{ otp: '' }}
          validationSchema={Yup.object({
            otp: Yup.string().required('OTP is required'),
          })}
          onSubmit={(values, { setSubmitting }) => {
            submitOTP(values);
            setSubmitting(false);
          }}
        >
          {({ isSubmitting, values, handleChange, handleBlur, errors, touched }) => (
            <Form>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  flexDirection: 'column',
                }}
              >
                <TextField
                  id='mobileNumberOtpInput'
                  fullWidth
                  color='primary'
                  name='otp'
                  label='Enter OTP to verify'
                  variant='outlined'
                  value={values.otp}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.otp && Boolean(errors.otp)}
                  helperText={touched.otp && errors.otp}
                />
                {/* <Box component="p">{'We’ve sent a 4 digit OTP to your mobile number to verify your identity'}</Box> */}
                <Button
                  id='goBackButton'
                  onClick={() => {
                    setVerificationId('');
                    window.recaptchaVerifier = null;

                    setLoginbox(1);
                  }}
                >
                  Go Back
                </Button>
                <Button
                  id='submitOtpButton'
                  disabled={isSubmitting}
                  type='submit'
                  sx={{
                    my: 2,
                    height: '56px',
                    fontSize: '16px',
                    fontWeight: 600,
                  }}
                  variant='contained'
                  fullWidth
                >
                  Submit OTP
                </Button>
              </Box>
            </Form>
          )}
        </Formik>
      </Box>
    );
  };

  const pinBoxActive = () => {
    return (
      <Box>
        <Formik
          initialValues={{ pin: '' }}
          validationSchema={Yup.object({
            pin: Yup.string().required('Pin is required'),
          })}
          onSubmit={(values, { setSubmitting }) => {
            submitPin(values);
            setSubmitting(false);
          }}
        >
          {({ isSubmitting, values, handleChange, handleBlur, errors, touched }) => (
            <Form>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  flexDirection: 'column',
                }}
              >
                <TextField
                  id='mobileNumberPinInput'
                  fullWidth
                  color='primary'
                  name='pin'
                  label='Enter Pin to verify'
                  variant='outlined'
                  value={values.pin}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.pin && Boolean(errors.pin)}
                  helperText={touched.pin && errors.pin}
                />
                {/* <Box component="p">{'We’ve sent a 4 digit OTP to your mobile number to verify your identity'}</Box> */}
                <Button
                  id='goBackButton'
                  onClick={() => {
                    setVerificationId('');
                    window.recaptchaVerifier = null;

                    setLoginbox(1);
                  }}
                >
                  Go Back
                </Button>
                <Button
                  id='submitOtpButton'
                  disabled={isSubmitting}
                  type='submit'
                  sx={{
                    my: 2,
                    height: '56px',
                    fontSize: '16px',
                    fontWeight: 600,
                  }}
                  variant='contained'
                  fullWidth
                >
                  Submit Pin
                </Button>
              </Box>
            </Form>
          )}
        </Formik>
      </Box>
    );
  };
  return (
    <>
      {loginbox === 1 && loginBoxActive()}

      {loginbox === 2 && otpBoxActive()}
      {loginbox === 3 && pinBoxActive()}
    </>
  );
};

export default AuthLogin;
