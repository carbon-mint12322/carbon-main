import renderNameCell from '~/entitylib/functions/renderCells/renderNameCell';

const render = (reFetch: any) => (data: any) =>
    renderNameCell(data?.row?.batchIdName, data?.row?.landParcel?.name);

export default render;