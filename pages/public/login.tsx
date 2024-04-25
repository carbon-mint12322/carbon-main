import type { NextPage, GetStaticProps, GetStaticPropsContext } from "next";
import { useRouter } from "next/router";
import Head from "next/head";
import Image from "next/image";
import { useTheme } from "@mui/material/styles";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";

import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import AuthProvider from "~/contexts/AuthDialogContext";
import OrganizationProvider from "~/contexts/OrganizationContext";
import AlertProvider, { useAlert } from "~/contexts/AlertContext";
import createEmotionCache from "~/utility/createEmotionCache";
import ThemeProvider from "~/components/HOC/ThemeProvider";
import { useOrganization } from "../../contexts/OrganizationContext";
import AuthLogin from "~/components/auth/AuthLogin";
import Carousell from "~/components/Carousel";
import appConfig from "~/static/appconfig";
import { useEffect } from "react";

const LoginPage: NextPage = (props: any) => {
  const router = useRouter();
  const redirect: string =
    (router.query.redirect as string) || appConfig.homePage;
  const theme = useTheme();
  const matchDownSM = useMediaQuery(theme.breakpoints.down("sm"));
  const { t } = useTranslation("login");

  const { organizationConfig } = useOrganization();
  const { openToast } = useAlert();
  useEffect(() => {
    if (router.query.error) {
      openToast(
        'error',
        'Invalid Mobile Number, Pin or OTP.',
      );
    }
  }, [])

  return (
    <>
      <Head>
        <title>Carbon Mint - Login</title>
        <meta name="description" content="Carbon Mint Login" />
      </Head>

      <Box
        className="res_logo"
        position="absolute"
        top={{ xs: "7%", sm: "7%", md: "150px", lg: "150px" }}
        left={{ xs: "35%", sm: "35%", md: "14%", lg: "14%" }}
        margin={"auto"}
      >
        <Box
          height={{ xs: "95%", sm: "45%", md: "80%", lg: "80%" }}
          width={{ xs: "95%", sm: "45%", md: "80%", lg: "80%" }}
          margin="auto"
        >
          <img
            className="logosize"
            src={organizationConfig?.logo}
            alt={organizationConfig?.name}
          />
        </Box>
      </Box>

      <Grid
        container
        alignItems="center"
        columns={{ xs: 6, sm: 6, md: 12, lg: 12 }}
      >
        <Grid
          order={{ xs: 2, sm: 2, md: 1, lg: 1 }}
          height={{ xs: "110vh", sm: "110vh", md: "110vh", lg: "110vh" }}
          margin="auto"
          item
          xs={6}
          sx={{
            bgcolor: `${theme.palette.primary.main}20`,
            color: "common.white",
            display: "flex",
            textAlign: "left",
          }}
        >
          <Grid width="100%">
            <Box
              width={{ xs: "80%", sm: "80%", md: "40%", lg: "72%" }}
              display="block"
              margin={"auto"}
              marginTop={{ xs: "60px", sm: "70px", md: "232px", lg: "324px" }}
              // marginLeft={{ xs: "60px", sm: "70px", md: "162px", lg: "128px" }}
              component="p"
            >
              <Box width="fit-content" margin="auto" component={Typography} color={'common.black'}>
                {organizationConfig?.loginDesc}
              </Box>
            </Box>
            {organizationConfig?.carousel && (
              <Box
                margin="auto"
                marginTop={{ xs: "60px", sm: "70px", md: "162px", lg: "90px" }}
                // marginLeft={{
                //   xs: "60px",
                //   sm: "70px",
                //   md: "162px",
                //   lg: "128px",
                // }}
                width={{ xs: "80%", sm: "80%", md: "40%", lg: "72%" }}
              >
                <Carousell carousel={organizationConfig?.carousel} />
              </Box>
            )}
          </Grid>
        </Grid>
        <Grid
          order={{ xs: 1, sm: 1, md: 2, lg: 2 }}
          marginTop={{ xs: "239px", sm: "40px", md: "20px", lg: "19px" }}
          item
          xs={6}
        >
          <Box
            width={{ xs: "90%", sm: "90%", md: "55%", lg: "55%" }}
            margin="auto"
            marginTop={{ xs: "0px", sm: "140px", md: "0px", lg: "0px" }}
          >
            <Box width="100%">
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  fontWeight: "bold",
                }}
              >
                <Typography variant={matchDownSM ? "h5" : "h4"} sx={{ mb: 1 }}>
                  {t("loginHeader")}
                </Typography>
                <Typography
                  variant={matchDownSM ? "h5" : "h4"}
                  sx={{ marginLeft: 1 }}
                >
                  {process.env.NEXT_PUBLIC_APP_NAME !== "evlocker"
                    ? t("farm")
                    : t("ev")}
                </Typography>
                <Typography variant={matchDownSM ? "h5" : "h4"} color="primary">
                  {process.env.NEXT_PUBLIC_APP_NAME !== "evlocker"
                    ? t("book")
                    : t("locker")}
                </Typography>
              </Box>
              <Typography marginTop={"24px"} color={"textSecondary"}>
                {t("loginPrompt")}
              </Typography>
            </Box>
            <Box width="100%" margin="auto">
              <AuthLogin redirect={redirect} />
            </Box>
          </Box>
          <Grid
            container
            item
            xs={12}
            justifyContent="center"
            sx={{ marginTop: "10px", padding: "5px" }}
          >
            <Box component="div">
              <Box
                component="p"
                sx={{
                  marginBottom: "5px",
                  fontSize: "12px",
                  padding: 0,
                  textAlign: "center",
                }}
              >
                Powered by
              </Box>
              <Image
                src="/assets/images/Logo-CarbonMint.svg"
                width={180}
                height={82}
                alt="logo"
              />
            </Box>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

function OrgWrappedLogin(props: any) {
  return (
    <OrganizationProvider>
      <LoginPage {...props} />
    </OrganizationProvider>
  );
}

export default OrgWrappedLogin;

export const getStaticProps: GetStaticProps = async ({
  locale,
}: GetStaticPropsContext) => {
  return {
    props: {
      ...(await serverSideTranslations(locale || "en", ["common", "login"])),
    },
  };
};
