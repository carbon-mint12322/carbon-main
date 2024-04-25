import React, { useState, useEffect, Suspense } from 'react';

import withAuth from '~/components/auth/withAuth';
import Box from '@mui/material/Box';
import dynamic from 'next/dynamic';
import { SxProps, useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import TitleBarGeneric from '~/components/TitleBarGeneric';
import { initialTitleBarContextValues } from '~/contexts/TitleBar/TitleBarContext';
import styles from '~/styles/theme/brands/styles';
import { PageConfig } from '~/frontendlib/dataModel';
import ModalCircularLoader from '~/components/common/ModalCircularLoader';
import axios from 'axios';
import { useOperator } from '~/contexts/OperatorContext';
import { useAlert } from '~/contexts/AlertContext';
import { createEntityRQ } from '~/frontendlib/model-lib/workflow';
import { navigateToListPage } from '~/frontendlib/util';
import { useRouter } from 'next/router';
import NextProgress from 'next-progress';
import MutationWrapper from '~/components/ui/MutationWrapper';
import { EventEditor } from '~/gen/workflows/index-fe';
import { Paper } from '@mui/material';

export { default as getServerSideProps } from '~/utils/ggsp';

interface CreateProductBatchProps {
  sx: SxProps;
  pageConfig: PageConfig;
  data: any;
}

function CreateProductBatch(props: CreateProductBatchProps) {
  const theme = useTheme();
  const matchDownSM = useMediaQuery(theme.breakpoints.down('sm'));
  const [submit, setSubmit] = useState<boolean>(false);
  const { changeRoute, getApiUrl, operator } = useOperator();
  const { openToast } = useAlert();
  const router = useRouter();
  const [titleBarData, setTitleBarData] = useState<any>({
    isTitleBarPresent: true,
    title: 'Add Product Batch',
    isTitlePresent: true,
    isMainBtnPresent: false,
    isSubBtnPresent: false,
  });

  const submitMutation = createEntityRQ({ onSuccess: navigateToListPage(router) });
  const { mutate } = submitMutation;

  function createProductBatch(input: any) {
    return mutate({
      ...input,
      domainSchemaName: 'productbatch',
      domainInstanceId: operator?._id.toString(),
    });
  }

  const handleOnSettled = () => {
    setSubmit(false);
  };

  return (
    <Box sx={[styles.formFields, { m: matchDownSM ? '0' : '0 12rem' }]}>
      <TitleBarGeneric
        titleBarData={titleBarData}
      /> 
      <ModalCircularLoader open={submit} disableEscapeKeyDown>
        <Paper elevation={4} sx={{ padding: 4 }}>
          <Suspense fallback={<NextProgress delay={10} options={{ showSpinner: true }} />}>
            <MutationWrapper mutation={submitMutation}>
              <EventEditor
                onSubmit={createProductBatch}
                wfName={'add_productBatchLifecycle'}
                domainObjectId={operator?._id.toString() || ''}
              />
            </MutationWrapper>
          </Suspense>
        </Paper>
      </ModalCircularLoader>
    </Box>
  );
}

export default withAuth(CreateProductBatch);
