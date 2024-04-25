TitleBar is a component which constains

1. Title
2. SubTitle
3. TitleIcon
4. view, Delete & more Buttons
5. Main, sub & upload Buttons
6. Grid and List view Buttons

what useTitleBar offers?
useTitleBar offers us to costomize the TitleBar as per page reqirement and give access to titleBar data and actions

usage of titleBar
import useTitleBar by this line of code ----- import { useTitleBar } from "~/contexts/TitleBar/TitleBarProvider";

How to use useTitleBar?
one can access titleBarData, setTitleBarData, handleUploadBtnClick, handleSubBtnClick, handleMainBtnClick, setHandleUploadBtnClick, setHandleSubBtnClick, setHandleMainBtnClick from useTitleBar
example- const {titleBarData, setTitleBarData, handleUploadBtnClick, handleSubBtnClick, handleMainBtnClick, setHandleUploadBtnClick, setHandleSubBtnClick, setHandleMainBtnClick} = useTitleBar();

titleBarData is a titleBar's current state of type object
setTitleBarData allows us to modify titleBarData

handleMainBtnClick allows to acess mainActions like add new farmer, Add new Event, Add new crop, Add new Land Parcel, Create New Event, create Event, Done action from upload files page... As this all have primary color in common
setHandleMainBtnClick allows to set action for main button

handleSubBtnClick allows to acess allows us to handle actions like Schedule Event, Request more info, cancel action from upload files page.
setHandleSubBtnClick allows us to set actions for handleSubBtnClick

handleUploadBtnClick allows to access uploadFile action of type (function)
setHandleUploadBtnClick allows to set the uploadButton action

Example:--
import { useTitleBar } from "~/contexts/TitleBar/TitleBarProvider";
import { initialTitleBarContextValues } from "~/contexts/TitleBar/TitleBarContext";
const {setTitleBarData, setHandleMainBtnClick } = useTitleBar();
React.useEffect(() => {
setTitleBarData({
...initialTitleBarContextValues.titleBarData,
isTitleBarPresent: true,
title: "Farmers",
subTitle: "Showing 24 Farmers in total",
mainBtnTitle: "Add New Farmer",
isTitlePresent: true,
isSubTitlePresent: true,
isSearchBarPresent: true,
isMainBtnPresent: true,
});
setHandleMainBtnClick(() => {
console.log("add");
console.log("new");
});
}, []);
