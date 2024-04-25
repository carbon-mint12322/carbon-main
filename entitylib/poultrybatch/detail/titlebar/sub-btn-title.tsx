const Mustache = require('mustache');
const mRender = Mustache.render;

type Context = {
  props:any;
  data:any;
  searchValue: string;
}

const defaultSubBtnTitle = `Submit for Review`;

const renderSubBtnTitle = (ctx: Context, template?:string) =>
  mRender(template||defaultSubBtnTitle, ctx);

export default renderSubBtnTitle;
