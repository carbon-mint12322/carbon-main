import renderRecentEvent from '~/entitylib/functions/renderCells/renderRecentEvent'

const render = (reFetch: any) => (data: any) =>
    renderRecentEvent(data, 'poultrybatch');

export default render;