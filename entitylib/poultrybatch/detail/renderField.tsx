import renderNameCell from '~/entitylib/functions/renderCells/renderNameCell';

const render = (reFetch: any) => (data: any) =>
  "" + data?.fieldDetails?.fbId;

export default render;
