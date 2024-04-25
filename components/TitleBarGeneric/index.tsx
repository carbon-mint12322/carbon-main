import React from 'react';
import TitleBar from '../lib/TitleBar';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { SelectChangeEvent } from '@mui/material/Select';
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import { avatarIconStyle, h100, searchBarInputBaseStyles, searchFieldStyle, selectOporatorStyle, subTextStyle, titleBarImgBgStyle, titleBarRightStyle, titleBarStyle, titleBtnStyle, viewDeleteIconBtnStyle } from './styles';

const TitleBarGenericContent = ({
  titleBarData,
  handleMainBtnClick,
  handleSubBtnClick,
  handleUploadBtnClick,
  handleDeleteBtnClick,
  handleSearch
}: any) => {
  const [searchText, setsearchText] = React.useState('');
  // const [selectedOperator, setSelectedOperator] = React.useState('');

  //TitleBar Event Handlers
  const handleSearchBarData = (event: any) => {
    setsearchText(event.target.value);
    handleSearch(event.target.value);
  };

  const handleOporatorSelect = (event: SelectChangeEvent) => {
    // setTitleBarData({ selectedOperator: event.target.value });
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
        titleBarImgBgStyle={titleBarImgBgStyle(titleBarData)}
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
        titleBtnStyle={titleBtnStyle(titleBarData)}
        HelpOutline={<CheckCircleOutlineOutlinedIcon />}
        avatarIconStyle={avatarIconStyle}
      />
    );
  }
  return <></>;
};

export default React.memo(TitleBarGenericContent);
