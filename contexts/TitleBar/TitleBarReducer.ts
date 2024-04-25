import {
  SET_HANDLE_MAIN_BTN_CLICK,
  SET_HANDLE_SUB_BTN_CLICK,
  SET_HANDLE_UPLOAD_BTN_CLICK,
  SET_TITLE_BAR_DATA,
  CLEAR_TITLE_BAR_DATA,
  titleBarType,
  SET_HANDLE_MORE_BTN_CLICK,
  SET_HANDLE_DELETE_BTN_CLICK,
  SET_HANDLE_VIEW_BTN_CLICK,
} from './TitleBarTypes';
import { initialTitleBarContextValues } from './TitleBarContext';

type actionType = {
  type: string;
  payload?: any;
};

const TitleBarReducer = (state: titleBarType, action: actionType) => {
  switch (action.type) {
    case CLEAR_TITLE_BAR_DATA:
      return {
        ...state,
        ...initialTitleBarContextValues,
      };
    case SET_TITLE_BAR_DATA:
      return {
        ...state,
        titleBarData: { ...state.titleBarData, ...action.payload },
      };
    case SET_HANDLE_MAIN_BTN_CLICK:
      return {
        ...state,
        handleMainBtnClick: action.payload,
      };
    case SET_HANDLE_SUB_BTN_CLICK:
      return {
        ...state,
        handleSubBtnClick: action.payload,
      };
    case SET_HANDLE_UPLOAD_BTN_CLICK:
      return {
        ...state,
        handleUploadBtnClick: action.payload,
      };
    case SET_HANDLE_VIEW_BTN_CLICK:
      return {
        ...state,
        handleViewBtnClick: action.payload,
      };
    case SET_HANDLE_DELETE_BTN_CLICK:
      return {
        ...state,
        handleDeleteBtnClick: action.payload,
      };
    case SET_HANDLE_MORE_BTN_CLICK:
      return {
        ...state,
        handleMoreBtnClick: action.payload,
      };
    default:
      return state;
  }
};

export default TitleBarReducer;
