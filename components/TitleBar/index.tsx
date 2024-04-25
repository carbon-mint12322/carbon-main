import React from 'react';
import TitleBar from '../lib/TitleBar';
import { useTitleBar } from '~/contexts/TitleBar/TitleBarProvider';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { SelectChangeEvent } from '@mui/material/Select';
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import { Theme } from '@mui/material';

const TitleBarContent = () => {
  const {
    titleBarData,
    setTitleBarData,
    handleUploadBtnClick,
    handleSubBtnClick,
    handleMainBtnClick,
    handleDeleteBtnClick
  } = useTitleBar();

  const [searchText, setsearchText] = React.useState('');

  //TitleBar Event Handlers
  const handleSearchBarData = (event: any) => {
    setsearchText(event.target.value);
  };
  React.useEffect(() => {
    setTitleBarData({ searchValue: searchText });
  }, [searchText]);

  const handleOporatorSelect = (event: SelectChangeEvent) => {
    setTitleBarData({ selectedOperator: event.target.value });
  };

  // TitleBar Styles
  const titleBarRightStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '14px',
    height: '40px',
  };

  const titleBarStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '14px',
    padding: '8px 0px',
  };

  const titleBtnStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '16px',
    paddingBottom: titleBarData?.isTitleBtnPresent ? '9px' : 'unset',
  };

  const subTextStyle = { color: 'text.disabled' };

  const searchFieldStyle = {
    ...titleBarStyle,
    gap: '8px',
    border: (theme: Theme) => `2px solid ${theme.palette.grey[300]}`,
    padding: '0px 8px',
    borderRadius: '8px',
    height: '100%',
    maxWidth: '185px',
  };

  const searchBarInputBaseStyles = {
    paddingTop: '5px',
  };
  const h100 = {
    height: '100%',
  };
  const titleBarImgBgStyle = {
    width: '48px',
    height: '48px',
    backgroundImage: `url(${titleBarData.titleIcon})`,
  };

  const viewDeleteIconBtnStyle = {
    height: '100%',
    borderRadius: '21%',
    bgcolor: 'common.white',
  };

  const selectOporatorStyle = {
    boxShadow: '0px 2px 2px rgba(0, 0, 0, 0.15)',
    borderRadius: '18px',
    border: '1px solid red',
    bgcolor: 'common.white',
    '& .MuiSelect-select': {
      pt: '12px',
    },
    '& :focus': {
      bgcolor: 'common.white',
      borderRadius: '18px',
    },
  };

  const avatarIconStyle = {
    width: '3rem',
    height: '3rem',
    fontSize: '1.25rem',
    lineHeight: 1.5,
  };

  if (titleBarData.isTitleBarPresent) {
    return (
      <TitleBar
        titleBarData={titleBarData}
        searchText={searchText}
        handleSearchBarData={handleSearchBarData}
        handleMainBtnClick={handleMainBtnClick}
        handleSubBtnClick={handleSubBtnClick}
        handleUploadBtnClick={handleUploadBtnClick}
        handleDeleteBtnClick={handleDeleteBtnClick}
        titleBarImgBgStyle={titleBarImgBgStyle}
        titleBarStyle={titleBarStyle}
        titleBarRightStyle={titleBarRightStyle}
        subTextStyle={subTextStyle}
        searchFieldStyle={searchFieldStyle}
        searchBarInputBaseStyles={searchBarInputBaseStyles}
        h100={h100}
        viewDeleteIconBtnStyle={viewDeleteIconBtnStyle}
        handleOporatorSelect={handleOporatorSelect}
        selectOporatorStyle={selectOporatorStyle}
        KeyboardArrowDownIcon={KeyboardArrowDownIcon}
        titleBtnStyle={titleBtnStyle}
        HelpOutline={<CheckCircleOutlineOutlinedIcon />}
        avatarIconStyle={avatarIconStyle}
      />
    );
  }
  return <></>;
};

export default React.memo(TitleBarContent);
