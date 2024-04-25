import renderRecentEvent from '~/entitylib/functions/renderCells/renderRecentEvent'

const render = (reFetch: any) => (data: any) =>
    renderRecentEvent(data, 'crop');

export default render;