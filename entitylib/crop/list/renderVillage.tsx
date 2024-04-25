const render = (reFetch: any) => (data: any) =>
    data?.row?.landParcelDetails?.[0]?.address?.village ? data?.row?.landParcelDetails?.[0]?.address?.village : '';

export default render;