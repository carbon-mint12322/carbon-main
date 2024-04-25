import { useRouter } from 'next/router';
import React, { useRef, useState } from 'react';
import { SxProps, Box, Typography, useTheme, Grid, Drawer } from '@mui/material';
import Tabs from '~/components/lib/Tabs';
import Donut from '~/components/common/Chart/Donut';
import { useOperator } from '~/contexts/OperatorContext';
import useFetch from 'hooks/useFetch';
import CircularLoader from '~/components/common/CircularLoader';
import ValidationWorkflowView from '~/components/workflow/ValidationWorkflowView';
import styles from '~/styles/theme/brands/styles';

import cropImg from '../../public/assets/images/crop.svg';
import TitleBarGeneric from '~/components/TitleBarGeneric';

const Mustache = require('mustache');
const mRender = Mustache.render;
export const templatedString: any =
  (template: string) =>
    (ctx: any): string =>
      mRender(template, ctx);

export type DetailPageComponentTab = {
  type: string;
  title: string;
  props?: any;
  propsJson: string;

  count?: string; // mustache template
}

export type TitleBarConfig = {
  pageTitle: string;
  subTitle: string;
  mainBtnTitle: string;
  subBtnTitle?: string;
  showTitlebar: boolean;
  showTitlebarTitle: boolean;
  showTitlebarSubTitle: boolean;
  showTitlebarSearch?: boolean;
  showTitlebarMainBtn: boolean;
  showTitlebarSubBtn?: boolean;
};

export type DetailPageComponentConfig = {
  titleBar: TitleBarConfig;
  tabs: DetailPageComponentTab[];
  showMap?: boolean;
  wfName?: string;
  overviewFields: {
    title: string;
    field: string;
    formatter?: string;
    format?: string;
    renderCell?: string;
  }[];
}

export type DetailPageComponentProps = {
  modelName: string;
  titleBarConfig: TitleBarConfig;
  componentList: {
    component: any;
    props: any;
    label: string;
    icon: any;
  }[];
  handleAddFormSubmit: (formData: any) => void;

  entityId: string;
  entityData: any;
}

export function GenericDetailPageComponent(props: DetailPageComponentProps) {
  const { entityId, titleBarConfig, entityData, modelName, componentList, handleAddFormSubmit } = props;
  const router = useRouter();
  const theme = useTheme();
  const [openVerifyModal, setOpenVerifyModal] = useState<boolean>(false);
  const parentRef = useRef(null);
  const { changeRoute, getAPIPrefix } = useOperator();
  const API_URL = `${getAPIPrefix()}/${modelName}/${router.query.id}`;

  const titleTemplate = templatedString(titleBarConfig.pageTitle);
  const subTitleTemplate = templatedString(titleBarConfig.subTitle);



  const { isLoading: loading, data, reFetch } = useFetch<any[]>(API_URL);
  const mCtx = { ...data };
  const createEventRoute = `/${modelName}/${entityId}/create-event`;

  const handleClose = () => {
    setOpenVerifyModal(false);
  };

  const boxStyle = {
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'flex-start',
  };
  return (
    <>
      <TitleBarGeneric
        titleBarData={{
          isTitleBarPresent: props.titleBarConfig.showTitlebar,
          title: titleTemplate(mCtx),
          subTitle: subTitleTemplate(mCtx),
          mainBtnTitle: props.titleBarConfig.mainBtnTitle,
          subBtnTitle: props.titleBarConfig.subBtnTitle,
          subBtnColor: 'secondary',
          titleIcon: cropImg.src,
          isTitlePresent: props.titleBarConfig.showTitlebarTitle,
          isSubTitlePresent: props.titleBarConfig.showTitlebarSubTitle,
          isMainBtnPresent: props.titleBarConfig.showTitlebarMainBtn,
          isSubBtnPresent: props.titleBarConfig.showTitlebarSubBtn,
          isTitleIconPresent: true,
        }}
        handleMainBtnClick={() => changeRoute(createEventRoute)}
        handleSubBtnClick={() => setOpenVerifyModal(true)}
      />
      <CircularLoader value={loading}>
        <Tabs
          componentList={componentList}
          headerContent={<Box
            sx={boxStyle}
          >
            <Donut
              color={theme.palette.chart.primary}
              series={[entityData?.climateScore || 0, 100 - (entityData?.climateScore || 0)]} />
            <Box>
              <Typography color='textPrimary' variant='body1' fontWeight={550}>
                {entityData?.climateScore} %
              </Typography>
              <Typography color='textSecondary' variant='caption' fontWeight={400}>
                Climate Impact Score
              </Typography>
            </Box>
            <Donut
              color={theme.palette.chart.secondary}
              series={[entityData?.complianceScore || 0, 100 - (entityData?.complianceScore || 0)]} />
            <Box>
              <Typography color='textPrimary' variant='body1' fontWeight={550}>
                {entityData?.complianceScore || 0} %
              </Typography>
              <Typography color='textSecondary' variant='caption' fontWeight={400}>
                Compliance Score
              </Typography>
            </Box>
          </Box>} />
        <>
          <Grid container>
            <Grid ref={parentRef} item xs={10}>
              <Drawer
                sx={styles.rightDrawer(parentRef)}
                anchor={'right'}
                open={openVerifyModal}
                onClose={handleClose}
              >
                <div style={{ padding: 20 }}>
                  <ValidationWorkflowView
                    domainObjectId={entityId}
                    domainSchemaName={'poultrybatch'}
                    wfId={entityData?.validationWorkflowId}
                    reload={() => reFetch(API_URL)}
                    closeDrawer={handleClose} />
                </div>
              </Drawer>
            </Grid>
          </Grid>
        </>
      </CircularLoader>
    </>
  );
}
