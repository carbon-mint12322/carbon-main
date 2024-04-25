import { Box } from '@mui/material';
import * as React from 'react';
import NotificationPanel from '~/components/NotificationsPanel';
import { useOperator } from '~/contexts/OperatorContext';
import useFetch from 'hooks/useFetch';

interface NotificationBarProps {
  handleCloseNotificationsModal: () => void;
}
const NotificationsBar = (props: NotificationBarProps) => {
  const { getAPIPrefix } = useOperator();
  const API_URL = getAPIPrefix() + '/notification';
  const { data } = useFetch<any>(API_URL);

  return (
    <Box>
      <NotificationPanel
        data={data}
        isPageView={false}
        handleCloseNotificationsModal={props.handleCloseNotificationsModal}
      />
    </Box>
  );
};

export default NotificationsBar;
