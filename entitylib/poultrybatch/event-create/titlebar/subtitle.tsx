export const renderSubTitle = ({props,data}:any) => 
  (data?.batchIdName + " • " + data?.landParcelDetails?.name + " • " + data?.farmerDetails?.personalDetails?.firstName) || "";

export default renderSubTitle;
