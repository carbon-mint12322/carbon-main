const Mustache = require('mustache');
const mRender = Mustache.render;

type Context = {
  props:any;
  data:any;
  searchValue: string;
}

const defaultTitleTemplate = `{{data.batchIdName}}`;

const renderTitle = (ctx: Context, template?: string) =>
  mRender(template || defaultTitleTemplate, ctx);

export default renderTitle;