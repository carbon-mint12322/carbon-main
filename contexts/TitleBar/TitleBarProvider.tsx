import React, { useContext, useEffect, useReducer } from 'react';
import TitleBarReducer from './TitleBarReducer';
import TitleBarContext from './TitleBarContext';

import {
  SET_HANDLE_MAIN_BTN_CLICK,
  SET_HANDLE_SUB_BTN_CLICK,
  SET_HANDLE_UPLOAD_BTN_CLICK,
  SET_TITLE_BAR_DATA,
  CLEAR_TITLE_BAR_DATA,
  titleBarType,
  commonType,
  titleBarFuncType,
  SET_HANDLE_DELETE_BTN_CLICK,
  SET_HANDLE_MORE_BTN_CLICK,
} from './TitleBarTypes';
import { none } from 'ramda';

export const ProvideTitleBar = ({ children }: { children: React.ReactNode }) => {
  const value = useProvideTitleBar();
  return <TitleBarContext.Provider value={value}>{children}</TitleBarContext.Provider>;
};

export const useTitleBar = () => useContext(TitleBarContext);

const useProvideTitleBar = () => {
  const initPersistState: any = {
    titleBarData: {
      titleIcon: '',
      title: '',
      subTitle: '',
      searchValue: '',
      isListView: false,
      subBtnTitle: '',
      mainBtnTitle: '',
      mainBtnOptions: [],
      titleBtnText: '',
      subBtnColor: 'secondary',
      subBtnDisabled: false,
      titleButtonColor: 'primary',
      selectedOperator: 'Current FPO',
      isTitleBarPresent: false,
      isTitleIconPresent: false,
      isTitlePresent: false,
      isTitleBtnPresent: false,
      isSubTitlePresent: false,
      isUploadBtnPresent: false,
      isViewDeleteBtnsPresent: false,
      isMoreIconPresent: false,
      isSearchBarPresent: false,
      isSubBtnPresent: false,
      isMainBtnPresent: false,
      isselectOperatorPresent: false,
      avatarIcon: '',
      isAvatarIconPresent: false,
    },
    handleMainBtnClick: () => { },
    handleSubBtnClick: () => { },
    handleUploadBtnClick: () => { },
    handleViewBtnClick: () => { },
    handleDeleteBtnClick: () => { },
    handleMoreBtnClick: () => { },
  };
  const [state, dispatch] = useReducer(TitleBarReducer, initPersistState);

  const setHandleViewBtnClick = (item: any) => {
    dispatch({
      type: SET_HANDLE_MAIN_BTN_CLICK,
      payload: item,
    });
  };

  const setHandleDeleteBtnClick = (item: any) => {
    dispatch({
      type: SET_HANDLE_DELETE_BTN_CLICK,
      payload: item,
    });
  };

  const setHandleMoreBtnClick = (item: any) => {
    dispatch({
      type: SET_HANDLE_MORE_BTN_CLICK,
      payload: item,
    });
  };

  const setHandleMainBtnClick = (item: any) => {
    dispatch({
      type: SET_HANDLE_MAIN_BTN_CLICK,
      payload: item,
    });
  };
  const setHandleSubBtnClick = (item: any) => {
    dispatch({
      type: SET_HANDLE_SUB_BTN_CLICK,
      payload: item,
    });
  };
  const setHandleUploadBtnClick = (item: any) => {
    dispatch({
      type: SET_HANDLE_UPLOAD_BTN_CLICK,
      payload: item,
    });
  };

  const setTitleBarData = (item: object) => {
    dispatch({
      type: SET_TITLE_BAR_DATA,
      payload: item,
    });
  };
  const clearTitleBarData = () => {
    dispatch({
      type: CLEAR_TITLE_BAR_DATA,
    });
  };
  const value: titleBarType = {
    titleBarData: state.titleBarData,
    handleMainBtnClick: state.handleMainBtnClick,
    handleSubBtnClick: state.handleSubBtnClick,
    handleUploadBtnClick: state.handleUploadBtnClick,
    handleViewBtnClick: state.handleViewBtnClick,
    handleDeleteBtnClick: state.handleDeleteBtnClick,
    handleMoreBtnClick: state.handleMoreBtnClick,
    clearTitleBarData,
    setTitleBarData,
    setHandleMainBtnClick,
    setHandleSubBtnClick,
    setHandleUploadBtnClick,
    setHandleViewBtnClick,
    setHandleDeleteBtnClick,
    setHandleMoreBtnClick,
  };
  return value;
};
