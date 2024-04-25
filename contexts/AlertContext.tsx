import React, { createContext, useState, useContext } from 'react';

import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps, AlertColor } from '@mui/material/Alert';

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant='filled' {...props} />;
});

import If from '~/components/lib/If';

interface AlertContextProps {
  openToast: (_severity: AlertColor, _message: string) => void;
  closeToast: () => void;
}

const AlertDefaultValues: AlertContextProps = {
  openToast: (_severity: AlertColor, _message: string) => {},
  closeToast: () => {},
};

const AlertContext = createContext<AlertContextProps>(AlertDefaultValues);

const Provider = ({ children }: any) => {
  const [open, setOpen] = useState<boolean>(false);
  const [severity, setSeverity] = useState<AlertColor>('success');
  const [message, setMessage] = useState<string | null>(null);

  const handleOpen = (_severity: AlertColor, _message: string) => {
    setOpen(true);
    setMessage(_message);
    setSeverity(_severity);
  };

  const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    handleToastClose();
  };

  const handleToastClose = () => {
    setOpen(false);
    setMessage(null);
    setSeverity('info');
  };

  const exposed: AlertContextProps = {
    openToast: handleOpen,
    closeToast: handleToastClose,
  };

  return (
    <AlertContext.Provider value={exposed}>
      {children}
      <If value={open && message}>
        <Snackbar open={open} anchorOrigin={{ vertical: 'top', horizontal: 'center' }} autoHideDuration={15000} onClose={handleClose}>
          <Alert onClose={handleClose} severity={severity} sx={{ width: '100%' }}>
            {message}
          </Alert>
        </Snackbar>
      </If>
    </AlertContext.Provider>
  );
};

export const useAlert = () => useContext(AlertContext);

export default Provider;
