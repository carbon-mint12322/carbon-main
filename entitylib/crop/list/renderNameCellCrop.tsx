import renderNameCell from '~/entitylib/functions/renderCells/renderNameCell';

const render = (reFetch: any) => (data: any) =>
    renderNameCell(data?.row?.name, data?.row?.landParcel?.name);

export default render;