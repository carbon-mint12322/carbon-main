import RenderActionCell from '~/entitylib/functions/renderCells/renderActionCell';

const render = (reFetch: any) => (data: any) =>
    RenderActionCell({ data, modelName: 'poultrybatch', wfName: 'poultrybatch', formContext: null, reFetch });

export default render;