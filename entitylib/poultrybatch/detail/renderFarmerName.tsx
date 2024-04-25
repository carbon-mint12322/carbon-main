
const render = (reFetch: any) => (data: any) =>
  "" + data?.farmerDetails?.personalDetails?.firstName + " " + (data?.farmerDetails?.personalDetails?.lastName || "");

export default render;

