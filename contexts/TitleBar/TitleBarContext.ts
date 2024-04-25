import { createContext } from 'react';
import { titleBarType } from './TitleBarTypes';

export const initialTitleBarContextValues: any = {
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

const TitleBarContext = createContext<titleBarType>(initialTitleBarContextValues);
export default TitleBarContext;
