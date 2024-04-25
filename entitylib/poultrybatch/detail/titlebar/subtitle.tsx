const Mustache = require('mustache');
const mRender = Mustache.render;

type Context = {
  props:any;
  data:any;
  searchValue: string;
}

const defaultSubtitle = `{{data.landParcelDetails.name}}`

const renderSubTitle = (ctx: Context, template?:string) =>
  mRender(template||defaultSubtitle, ctx);

export default renderSubTitle;
