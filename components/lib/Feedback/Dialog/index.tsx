import * as React from 'react';

import MUiDialog, { DialogProps as MUiDialogProps } from '@mui/material/Dialog';
import MUiDialogTitle, { DialogTitleProps as MUiDialogTitleProps } from '@mui/material/DialogTitle';
import DialogContent, { DialogContentProps } from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

export interface DialogTitleProps extends MUiDialogTitleProps {
  id?: string;
  children?: React.ReactNode;
  onClose: () => void;
}

const DialogTitle = ({ children, onClose, ...other }: DialogTitleProps) => {
  return (
    <MUiDialogTitle sx={children ? { m: 0, p: 2 } : { m: 0, p: 0 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 16,
            top: 8,
            color: (theme) => theme.palette.primary.main,
            fontSize: '2rem',
            zIndex: 9999,
            backgroundColor: (theme) => theme.palette.grey[200],
            '&:hover': {
              backgroundColor: (theme) => theme.palette.grey[400],
            },
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </MUiDialogTitle>
  );
};

interface DialogProps extends MUiDialogProps {
  title?: string;
  onClose: () => void;
  open: boolean;
  children?: React.ReactNode;
  actionButtons?: React.ReactNode;
  dialogTitleProps?: DialogTitleProps;
  dialogContentProps?: DialogContentProps;
}

export default function Dialog({
  children,
  title,
  open,
  onClose,
  actionButtons,
  dialogTitleProps,
  dialogContentProps,
  ...props
}: DialogProps) {
  return (
    <div>
      <MUiDialog onClose={onClose} open={open} {...props}>
        <DialogTitle onClose={onClose} {...dialogTitleProps}>
          {title}
        </DialogTitle>
        <DialogContent {...dialogContentProps}>{children}</DialogContent>
        {actionButtons && <DialogActions>{actionButtons}</DialogActions>}
      </MUiDialog>
    </div>
  );
}
