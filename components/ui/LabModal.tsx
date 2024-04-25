import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import List from '@mui/material/List';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import IconButton from '@mui/material/IconButton';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { Divider } from '@mui/material';
import Box from '@mui/material/Box';
import InputBase from '@mui/material/InputBase';
import Search from '@mui/icons-material/Search';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import { stringAvatar } from '~/components/lib/Initials';
import { filterData } from '~/components/lib/FilterData';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(4),
  },
  '& .MuiDialog-paper': {
    width: 479,
    // padding: theme.spacing(2),
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.05)',
    borderRadius: 0,
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

export interface DialogTitleProps {
  children?: React.ReactNode;
  closeModal: () => void;
  styles?: any;
}

const BootstrapDialogTitle = (props: DialogTitleProps) => {
  const { children, closeModal, styles, ...other } = props;

  return (
    <DialogTitle sx={styles?.modalTitleStyle} {...other}>
      {children}
      {closeModal ? (
        <IconButton
          aria-label='close'
          onClick={closeModal}
          sx={{
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <HighlightOffIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
};

function OpDialog(props: any) {
  const {
    closeModal,
    handleChangeLab,
    openModal,
    headerTitle,
    labItems,
    styles,
    isLocation,
    isSearch,
  } = props;
  const [searchVal, setSearchVal] = React.useState('');
  const [village, setVillage] = React.useState('');
  const [searchData, setSearchData] = React.useState([...labItems]);

  const handleClose = () => {
    closeModal();
  };

  const handleListItemClick = (value: string) => {
    handleChangeLab(value);
    closeModal(value);
  };

  const onInputChange = (event: any) => {
    setSearchVal(event.target.value);
    event.target.value.length > 2
      ? setSearchData(filterData(labItems, event.target.value))
      : setSearchData(labItems);
  };

  const handleChange = (event: SelectChangeEvent) => {
    setVillage(event.target.value);
    event.target.value
      ? setSearchData(filterData(labItems, event.target.value))
      : setSearchData(labItems);
  };

  return (
    <BootstrapDialog onClose={handleClose} open={openModal}>
      <BootstrapDialogTitle closeModal={handleClose} aria-labelledby='Change Lab' styles={styles}>
        {' '}
        {headerTitle}{' '}
      </BootstrapDialogTitle>
      <Divider />
      <Box sx={styles?.filterStyles}>
        {isLocation && (
          <FormControl variant='standard' sx={styles?.selectControl}>
            <InputLabel id='lab-label'>Location</InputLabel>
            <Select
              labelId='lab'
              id='lab-select'
              value={village}
              onChange={handleChange}
              label='Lab'
              sx={styles?.muiSelectNativeInput}
            >
              <MenuItem value='' key='none'>
                none
              </MenuItem>
              {labItems?.map((item: any, index: number) => (
                <MenuItem value={item.village} key={index}>
                  {item.village}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
        {isSearch && (
          <Box component='span' sx={styles?.searchFieldStyle}>
            <Search sx={styles?.searchIcon} />
            <InputBase
              placeholder='Search'
              name='searchValue'
              value={searchVal}
              onChange={onInputChange}
            />
          </Box>
        )}
      </Box>
      <List sx={{ pt: 0 }}>
        {searchData?.map((item: any, index: number) => (
          <React.Fragment key={index}>
            <ListItem button onClick={() => handleListItemClick(item)}>
              <ListItemAvatar>
                <Avatar variant='square' {...stringAvatar(item.lab)} sx={styles?.listItemAvatar} />
              </ListItemAvatar>
              <ListItemText primary={item.lab} secondary={`${item.phone} • ${item.village}`} />
            </ListItem>
            <Divider />
          </React.Fragment>
        ))}
      </List>
    </BootstrapDialog>
  );
}

export default function LabModal({
  headerTitle,
  handleClickOpen,
  label,
  labItems,
  openModal,
  closeModal,
  handleChangeLab,
  styles,
  isLocation,
  isSearch,
}: any) {
  return (
    <>
      <Button onClick={handleClickOpen} endIcon={<KeyboardArrowDownIcon />} sx={styles?.oPBtn}>
        {label}
      </Button>
      <OpDialog
        labItems={labItems}
        openModal={openModal}
        closeModal={closeModal}
        handleChangeLab={handleChangeLab}
        headerTitle={headerTitle}
        styles={styles}
        isLocation={isLocation}
        isSearch={isSearch}
      />
    </>
  );
}

LabModal.propTypes = {
  labItems: PropTypes.array.isRequired,
  headerTitle: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  styles: PropTypes.object.isRequired,
};
