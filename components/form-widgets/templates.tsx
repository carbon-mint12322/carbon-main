import React from 'react';
import { IconButtonProps } from '@rjsf/utils';
import { Button, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

const AddButton = (props: IconButtonProps) => {
  const { onClick, disabled } = props;
  return (
    <Button startIcon={<AddIcon />} onClick={onClick}>
      Add Item
    </Button>
  );
};
const RemoveButton = (props: IconButtonProps) => {
  const { onClick, disabled } = props;
  return (
    <Button startIcon={<RemoveIcon />} onClick={onClick}>
      Remove
    </Button>
  );
};

const templates = {
  ButtonTemplates: { AddButton, RemoveButton },
};

export default templates;
