import { SplitButtonOptionI } from "~/components/lib/SplitButton";

export const SET_HANDLE_MAIN_BTN_CLICK = 'SET_HANDLE_MAIN_BTN_CLICK';
export const SET_HANDLE_SUB_BTN_CLICK = 'SET_HANDLE_SUB_BTN_CLICK';
export const SET_HANDLE_UPLOAD_BTN_CLICK = 'SET_HANDLE_UPLOAD_BTN_CLICK';
export const SET_TITLE_BAR_DATA = 'SET_TITLE_BAR_DATA';
export const CLEAR_TITLE_BAR_DATA = 'CLEAR_TITLE_BAR_DATA';
export const SET_HANDLE_VIEW_BTN_CLICK = 'SET_HANDLE_VIEW_BTN_CLICK';
export const SET_HANDLE_DELETE_BTN_CLICK = 'SET_HANDLE_DELETE_BTN_CLICK';
export const SET_HANDLE_MORE_BTN_CLICK = 'SET_HANDLE_MORE_BTN_CLICK';

export type commonType = {
  titleIcon: string;
  title: string;
  subTitle: string;
  searchValue: string;
  isListView: boolean;
  subBtnTitle: string;
  mainBtnTitle: string;
  mainBtnOptions: SplitButtonOptionI[];
  subBtnColor: string;
  selectedOperator: string;
  isTitleBarPresent: boolean;
  isTitleIconPresent: boolean;
  isTitlePresent: boolean;
  isSubTitlePresent: boolean;
  isUploadBtnPresent: boolean;
  isViewDeleteBtnsPresent: boolean;
  isMoreIconPresent: boolean;
  isSearchBarPresent: boolean;
  isSubBtnPresent: boolean;
  isMainBtnPresent: boolean;
  isselectOperatorPresent: boolean;
  isTitleBtnPresent: boolean;
  avatarIcon: string;
  isAvatarIconPresent: boolean;
};

export type titleBarFuncType = (item: any) => any;

export type titleBarType = {
  titleBarData: commonType;
  handleMainBtnClick: any;
  handleSubBtnClick: any;
  handleUploadBtnClick: any;
  handleViewBtnClick: any;
  handleDeleteBtnClick: any;
  handleMoreBtnClick: any;
  setTitleBarData: any;
  clearTitleBarData: any;
  setHandleMainBtnClick: any;
  setHandleSubBtnClick: any;
  setHandleUploadBtnClick: any;
  setHandleViewBtnClick: any;
  setHandleDeleteBtnClick: any;
  setHandleMoreBtnClick: any;
};
