const Mustache = require('mustache');
const mRender = Mustache.render; // mustache render

export function mustacheFormatter(value: any, data: any, mustacheTemplate: string) {
    return mRender(mustacheTemplate, { value, data });
}
