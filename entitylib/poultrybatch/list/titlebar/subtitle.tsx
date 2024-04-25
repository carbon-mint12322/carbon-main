const Mustache = require('mustache');
const mRender = Mustache.render;

type Context = {
  props:any;
  data:any;
  searchValue: string;
}

const defaultSubtitle = "Showing {"+"{data.length}} Poultry Batches total"

const renderSubTitle = (ctx: Context, template?:string) =>
  mRender(template||defaultSubtitle, ctx);

export default renderSubTitle;