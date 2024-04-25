import React, { useState, Suspense } from 'react';

import withAuth from '~/components/auth/withAuth';
import { navigateToListPage } from '~/frontendlib/util';

import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import TitleBarGeneric from '~/components/TitleBarGeneric';
import styles from '~/styles/theme/brands/styles';
import ModalCircularLoader from '~/components/common/ModalCircularLoader';
import { useOperator } from '~/contexts/OperatorContext';
export { default as getServerSideProps } from '~/utils/ggsp';
import { createEntityRQ } from '~/frontendlib/model-lib/workflow';
import NextProgress from 'next-progress';
import MutationWrapper from '~/components/ui/MutationWrapper';
import { EventEditor } from '~/gen/workflows/index-fe';
import { Paper } from '@mui/material';
import { useRouter } from 'next/router';

function CreateEntity(props: any) {
  const theme = useTheme();
  const matchDownSM = useMediaQuery(theme.breakpoints.down('sm'));
  const [submit, setSubmit] = useState<boolean>(false);
  const { operator } = useOperator();
  const router = useRouter();

  const submitMutation = createEntityRQ({ onSuccess: navigateToListPage(router) });
  const { mutate } = submitMutation;

  function createEntity(input: any) {
    setSubmit(true);
    return mutate({
      ...input,
      eventData: { ...input.eventData },
      domainSchemaName: props.schema,
      domainInstanceId: props.parentId || operator?._id.toString(),
      domainSchemaId: props.parentSchema || `/farmbook/collective`
    });
  }

  return (
    <>
    <TitleBarGeneric
        titleBarData={{
          isTitleBarPresent: true,
          title: props.title,
          isTitlePresent: true,
          isMainBtnPresent: false,
          isSubBtnPresent: false,
        }}
      />
      <Box sx={[styles.formFields, { m: matchDownSM || props?.negateMargin ? '0' : '0 12rem' }]}>
        <ModalCircularLoader open={submit} disableEscapeKeyDown>
          <Paper elevation={4} sx={{ padding: 4 }}>
            <Suspense fallback={<NextProgress delay={10} options={{ showSpinner: true }} />}>
              <MutationWrapper mutation={submitMutation}>
                <EventEditor
                  onSubmit={createEntity}
                  wfName={props.entityWfName}
                  domainObjectId={props.parentId || operator?._id.toString() || ''}
                  formContext={props.formContext}
                />
              </MutationWrapper>
            </Suspense>
          </Paper>
        </ModalCircularLoader>
      </Box>
    </>
  );
}

export default withAuth(CreateEntity);
