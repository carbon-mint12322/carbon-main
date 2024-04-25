const Mustache = require('mustache');
const mRender = Mustache.render;

type Context = {
  props:any;
}

const defaultTitleTemplate = `Add Poultry Batch`;

const renderTitle = (ctx: Context, template?: string) =>
  mRender(template || defaultTitleTemplate, ctx);

export default renderTitle;
