import React, { useState } from 'react';
import Typography from '@mui/material/Typography';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import PersonIcon from '@mui/icons-material/Person';
import AddIcon from '@mui/icons-material/Add';
import { blue } from '@mui/material/colors';

const emails = ['username@gmail.com', 'user02@gmail.com'];
export default function SelectionDlg(props) {
  const {
    foreignSchemaId,
    foreignLabelWidget: ForeignLabel,
    foreignObjects,
    onClose,
    selectedValue,
    open,
    title,
  } = props;

  const handleClose = () => onClose(selectedValue);
  const handleListItemClick = (value) => onClose(value);

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>{title}</DialogTitle>
      <List sx={{ pt: 0 }}>
        {foreignObjects?.map((object, i) => (
          <ListItem button onClick={() => handleListItemClick(object)} key={i}>
            <ForeignLabel object={object} />
          </ListItem>
        ))}
      </List>
    </Dialog>
  );
}

SelectionDlg.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  selectedValue: PropTypes.string.isRequired,
};

/*
             <ListItemAvatar>
              <Avatar sx={{ bgcolor: blue[100], color: blue[600] }}>
                <PersonIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary={email} />
*/
