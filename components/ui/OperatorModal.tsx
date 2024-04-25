import React, { useState } from 'react';
import Router from 'next/router';
import Button from '@mui/material/Button';
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
import { Badge, Divider, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import InputBase from '@mui/material/InputBase';
import Search from '@mui/icons-material/Search';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { filterData } from '~/components/lib/FilterData';
import Avatar from '~/components/lib/DataDisplay/Avatar';
import { useOperator } from '~/contexts/OperatorContext';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(4),
  },
  '& .MuiDialog-paper': {
    width: 479,
    // padding: theme.spacing(2),
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.05)',
    borderRadius: '8px',
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
      <Box>{children}</Box>
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
    handleChangeOperator,
    openModal,
    headerTitle,
    operatorItems,
    styles,
    isLocation,
    isSearch,
    isFilter,
    selectedLabel,
  } = props;
  const [searchVal, setSearchVal] = React.useState('');
  const [village, setVillage] = React.useState('');
  const [searchData, setSearchData] = React.useState(operatorItems);
  const { changeRoute } = useOperator();

  const handleClose = () => {
    closeModal();
  };

  const handleListItemClick = (value: string) => {
    handleChangeOperator(value);
    closeModal(value);
  };

  const handleViewDetailsClick = (e: any, id: string) => {
    e.stopPropagation();
    changeRoute(`/collective/${id}`);
  };

  const onInputChange = (event: any) => {
    setSearchVal(event.target.value);
    event.target.value.length > 2
      ? setSearchData(filterData(operatorItems, event.target.value))
      : setSearchData(operatorItems);
  };

  const handleChange = (event: SelectChangeEvent) => {
    setVillage(event.target.value);
    event.target.value
      ? setSearchData(filterData(operatorItems, event.target.value))
      : setSearchData(operatorItems);
  };

  return (
    <BootstrapDialog
      onClose={handleClose}
      open={openModal}
      PaperProps={{
        sx: {
          borderRadius: '8px',
        },
      }}
    >
      <BootstrapDialogTitle
        closeModal={handleClose}
        aria-labelledby='Change Operator'
        styles={{ px: 5, ...styles }}
      >
        {headerTitle}
      </BootstrapDialogTitle>
      <Divider />
      <Box sx={{ px: 5, ...styles?.filterStyles }}>
        {isLocation && (
          <FormControl variant='standard' sx={styles?.selectControl}>
            <InputLabel id='operator-label'>Location</InputLabel>
            <Select
              labelId='operator'
              id='operator-select'
              value={village}
              onChange={handleChange}
              label='Operator'
              sx={styles?.muiSelectNativeInput}
              IconComponent={KeyboardArrowDownIcon}
              disableUnderline
            >
              <MenuItem value='' key='none'>
                All
              </MenuItem>
              {operatorItems?.map((item: any, index: number) => (
                <MenuItem value={item.address?.village} key={index}>
                  {item.address?.village}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
        {isFilter && (
          <FormControl variant='standard' sx={styles?.selectControl}>
            <InputLabel id='operator-label'>Type</InputLabel>
            <Select
              labelId='operator'
              id='operator-select'
              value={village}
              onChange={handleChange}
              label='Operator'
              sx={styles?.muiSelectNativeInput}
              IconComponent={KeyboardArrowDownIcon}
              disableUnderline
            >
              <MenuItem value='' key='none'>
                All
              </MenuItem>
              {operatorItems?.map((item: any, index: number) => (
                <MenuItem value={item.category} key={index}>
                  {item.category}
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
            <ListItem
              sx={{
                py: 3,
                px: 5,
              }}
              button
              onClick={() => handleListItemClick(item)}
            >
              <ListItemAvatar>
                <Badge
                  overlap='circular'
                  badgeContent={
                    <CheckCircleIcon
                      color='success'
                      sx={{
                        bgcolor: 'common.white',
                        borderRadius: '50%',
                      }}
                    />
                  }
                  invisible={selectedLabel != item.name}
                >
                  <Avatar variant='square' name={item.name} sx={{ ...styles?.listItemAvatar }} />
                </Badge>
              </ListItemAvatar>
              <ListItemText
                primary={item.name}
                secondary={`${item.category} • ${item.address?.village}`}
                sx={{
                  m: 0,
                  ml: 2.5,
                }}
                primaryTypographyProps={{
                  variant: 'body1',
                  sx: {
                    fontSize: '18px',
                  },
                }}
                secondaryTypographyProps={{
                  variant: 'subtitle1',
                }}
              />
              <Button onClick={(e) => handleViewDetailsClick(e, item._id)} variant='contained'>
                View Details
              </Button>
            </ListItem>
            <Divider />
          </React.Fragment>
        ))}
      </List>
    </BootstrapDialog>
  );
}

export default function OperatorModal({
  headerTitle,
  handleClickOpen,
  label,
  operatorItems,
  openModal,
  closeModal,
  handleChangeOperator,
  styles,
  isLocation,
  isSearch,
  isFilter,
}: any) {
  return (
    <>
      <Button onClick={handleClickOpen} endIcon={<KeyboardArrowDownIcon />} sx={styles?.oPBtn}>
        {label}
      </Button>
      <OpDialog
        operatorItems={operatorItems}
        openModal={openModal}
        closeModal={closeModal}
        handleChangeOperator={handleChangeOperator}
        headerTitle={headerTitle}
        styles={styles}
        isLocation={isLocation}
        isSearch={isSearch}
        isFilter={isFilter}
        selectedLabel={label}
      />
    </>
  );
}

OperatorModal.propTypes = {
  operatorItems: PropTypes.array.isRequired,
  headerTitle: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  styles: PropTypes.object.isRequired,
};
