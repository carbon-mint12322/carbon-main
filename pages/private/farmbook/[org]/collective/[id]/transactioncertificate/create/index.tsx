import React, { useState, Suspense } from 'react';

import withAuth from '~/components/auth/withAuth';
import Box from '@mui/material/Box';
import { SxProps, useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import TitleBarGeneric from '~/components/TitleBarGeneric';
import { initialTitleBarContextValues } from '~/contexts/TitleBar/TitleBarContext';
import styles from '~/styles/theme/brands/styles';
import { PageConfig } from '~/frontendlib/dataModel';
import { useOperator } from '~/contexts/OperatorContext';
import { createEntityRQ } from '~/frontendlib/model-lib/workflow';
import { navigateToSuperParentPage } from '~/frontendlib/util';
import { useRouter } from 'next/router';
import NextProgress from 'next-progress';
import MutationWrapper from '~/components/ui/MutationWrapper';
import { EventEditor } from '~/gen/workflows/index-fe';
import { Paper } from '@mui/material';
import axios from 'axios';

export { default as getServerSideProps } from '~/utils/ggsp';

interface CreateTransactionCertificateProps {
  sx: SxProps;
  pageConfig: PageConfig;
  data: any;
}

function CreateTransactionCertificate(props: CreateTransactionCertificateProps) {
  const theme = useTheme();
  const matchDownSM = useMediaQuery(theme.breakpoints.down('sm'));
  const { getAPIPrefix, getApiUrl, operator } = useOperator();
  const router = useRouter();
  const [titleBarData, setTitleBarData] = useState<any>({
    isTitleBarPresent: true,
    title: 'Add Transaction Certificate',
    mainBtnTitle: 'Submit Transaction Certificate',
    subBtnTitle: 'Save Draft',
    subBtnColor: 'secondary',
    isTitlePresent: true,
    isMainBtnPresent: false,
    isSubBtnPresent: false,
  });

  const submitMutation = createEntityRQ({ onSuccess: navigateToSuperParentPage(router) });
  const { mutate } = submitMutation;

  function createTransactionCertificate(input: any) {
    return mutate({
      ...input,
      domainSchemaName: 'transactioncertificate',
      domainInstanceId: operator?._id.toString(),
    });
  }

  async function refFilter(options: any) {
    if (options?.uiOptions.filterKey === 'ngmoRecords') {
      const res: {
        data: any;
      } = await axios.get(getAPIPrefix() + `/collective/${router.query.id}`);
      return res.data?.ngmoTestRecords;
    } else if (options?.uiOptions.filterKey === 'aggregationPlan') {
      const res: {
        data: any;
      } = await axios.get(getAPIPrefix() + `/collective/${router.query.id}`);
      return res.data?.aggregationPlanDetails;
    } else {
      const res: {
        data: any;
      } = await axios.get(`/api/${options.schemaId}`);

      return res.data;
    }
  }

  const formContext: any = {
    getApiUrl,
    foreignObjectLoader: refFilter,
  };

  return (
    <Box sx={[styles.formFields, { m: matchDownSM ? '0' : '0 12rem' }]}>
      <TitleBarGeneric
        titleBarData={titleBarData}
      />
      <Paper elevation={4} sx={{ padding: 4 }}>
        <Suspense fallback={<NextProgress delay={10} options={{ showSpinner: true }} />}>
          <MutationWrapper mutation={submitMutation}>
            <EventEditor
              onSubmit={createTransactionCertificate}
              wfName={'add_collectivetransactioncertLifecycle'}
              domainObjectId={operator?._id.toString() || ''}
              formContext={formContext}
            />
          </MutationWrapper>
        </Suspense>
      </Paper>
    </Box>
  );
}

export default withAuth(CreateTransactionCertificate);
