// Generated code (tools/templates/pages/model-page-endpoint.tsx.mustache)
// export { default } from '~/gen/pages/createfarmer/ui';
// Generated code (tools/templates/pages/model-page-endpoint.tsx.mustache)
import React, { useState, useEffect, Suspense } from 'react';

import withAuth from '~/components/auth/withAuth';
import { navigateToListPage } from '~/frontendlib/util';

import Box from '@mui/material/Box';
import dynamic from 'next/dynamic';
import { SxProps, useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import TitleBarGeneric from '~/components/TitleBarGeneric';
import { initialTitleBarContextValues } from '~/contexts/TitleBar/TitleBarContext';
import styles from '~/styles/theme/brands/styles';
import { FarmerFormData, PageConfig } from '~/frontendlib/dataModel';
import ModalCircularLoader from '~/components/common/ModalCircularLoader';
import { useOperator } from '~/contexts/OperatorContext';
import { useAlert } from '~/contexts/AlertContext';
export { default as getServerSideProps } from '~/utils/ggsp';
import axios from 'axios';
import { createEntityRQ } from '~/frontendlib/model-lib/workflow';
import NextProgress from 'next-progress';
import MutationWrapper from '~/components/ui/MutationWrapper';
import { EventEditor } from '~/gen/workflows/index-fe';
import { Paper } from '@mui/material';
import { useRouter } from 'next/router';

interface CreateFarmerProps {
  sx: SxProps;
  pageConfig: PageConfig;
  data: any;
}

function CreateFarmer(props: CreateFarmerProps) {
  const theme = useTheme();
  const matchDownSM = useMediaQuery(theme.breakpoints.down('sm'));
  const [submit, setSubmit] = useState<boolean>(false);
  const { getAPIPrefix, operator } = useOperator();
  const { openToast } = useAlert();
  const router = useRouter();
  const [titleBarData, setTitleBarData] = useState<any>({
    isTitleBarPresent: true,
    title: 'Add Farmer',
    isTitlePresent: true,
    isMainBtnPresent: false,
    isSubBtnPresent: false,
  });

  const submitMutation = createEntityRQ({ onSuccess: navigateToListPage(router) });
  const { mutate } = submitMutation;

  function createFarmer(input: any) {
    return mutate({
      ...input,
      eventData: { ...input.eventData, type: 'Farmer' },
      domainSchemaName: 'farmer',
      domainInstanceId: operator?._id.toString(),
    });
  }

  async function defaultListFilter(options: any) {
    if (options?.uiOptions.filterKey === 'subgroup') {
      const res: {
        data: any;
      } = await axios.get(getAPIPrefix() + `/collective/${operator?._id.toString()}`);
      return res.data?.subGroups;
    } else {
      const res: {
        data: any;
      } = await axios.get(getAPIPrefix() + `${options.schemaId}`);
      return res.data;
    }
  }

  const formContext: any = {
    foreignObjectLoader: defaultListFilter,
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
                onSubmit={createFarmer}
                wfName={'add_farmerLifecycle'}
                domainObjectId={operator?._id.toString() || ''}
                formContext={formContext}
              />
            </MutationWrapper>
          </Suspense>
        </Paper>
      </ModalCircularLoader>
    </Box>
  );
}

export default withAuth(CreateFarmer);
