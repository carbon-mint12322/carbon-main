import React, { useState, useEffect, Suspense } from 'react';

import withAuth from '~/components/auth/withAuth';

import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import styles from '~/styles/theme/brands/styles';
import ModalCircularLoader from '~/components/common/ModalCircularLoader';
import { useOperator } from '~/contexts/OperatorContext';
export { default as getServerSideProps } from '~/utils/ggsp';
import NextProgress from 'next-progress';
import MutationWrapper from '~/components/ui/MutationWrapper';
import { EventForm } from '~/gen/workflows/index-fe';
import { Paper } from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { submitWfEvent, WfEventSubmission } from '~/frontendlib/model-lib/workflow';
import useFetch from 'hooks/useFetch';
import CircularLoader from '../CircularLoader';
import { isArray } from 'lodash';

function UpdateEntity(props: any) {
  const theme = useTheme();
  const matchDownSM = useMediaQuery(theme.breakpoints.down('sm'));
  const [formData, setFormData] = useState<any>(null);
  const [workFlowId, setWorkFlowId] = useState("");
  const [submit, setSubmit] = useState<boolean>(false);
  const [mutationType, setMutationType] = useState<string>('');
  const { getAPIPrefix } = useOperator();

  const API_URL = getAPIPrefix() + `/${props.schema}/${props.entityId}?simple=true`;
  const {
    isLoading: isLoadingData,
    data: entityData,
  } = useFetch<any>(API_URL, null, true);
  

  const data = formData || isArray(entityData) ? entityData?.[0] : entityData;

  useEffect(() => {
    setWorkFlowId(entityData?.lifecycleWorkflowId || entityData?.validationWorkflowId)
  }, [entityData])

  function onChangeDetails(details: any) {
    setFormData({ ...data, details });
  }

  const updateMutation = useMutation(submitWfEvent, {onSuccess: () => props.onClick()});

  function saveChanges(updatedData: any) {
      setMutationType('update');
      setSubmit(true);
      const wfEventSubmission: WfEventSubmission = {
        org: props.org,
        instanceId: workFlowId,
        eventName: 'update',
        eventData: { ...updatedData },
      };
      return updateMutation.mutate(wfEventSubmission);
  }

  if (isLoadingData) {
    return (
      <CircularLoader value={isLoadingData}>
        <div> Loading data...</div>
      </CircularLoader>
    );
  }

  return (
    <Box sx={[styles.formFields, { m: matchDownSM || props?.negateMargin ? '0' : '0 12rem' }]}>
      <ModalCircularLoader open={submit} disableEscapeKeyDown>
        <Paper elevation={4} sx={{ padding: 4 }}>
          <Suspense fallback={<NextProgress delay={10} options={{ showSpinner: true }} />}>
            <MutationWrapper mutation={updateMutation} type={mutationType}>
              <EventForm
                eventName={props.entityWfName}
                readonly={props.readonly || false}
                formData={{ data: data }}
                onChange={onChangeDetails}
                onSubmit={saveChanges}
              />
            </MutationWrapper>
          </Suspense>
        </Paper>
      </ModalCircularLoader>
    </Box>
  );
}

export default withAuth(UpdateEntity);
