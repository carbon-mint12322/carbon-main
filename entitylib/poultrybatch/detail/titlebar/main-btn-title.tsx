const Mustache = require('mustache');
const mRender = Mustache.render;

type Context = {
  props:any;
  data:any;
  searchValue: string;
}

const defaultMainBtnTitle = "Add Event";

export const renderMainBtnTitle = (ctx: Context, template?:string) =>
  mRender(template||defaultMainBtnTitle, ctx);

export default renderMainBtnTitle;
