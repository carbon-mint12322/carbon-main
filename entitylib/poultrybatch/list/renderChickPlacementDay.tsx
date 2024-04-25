import stringFormatter from '~/utils/stringFormatter';
import numberFormatter from '~/utils/numberFormatter';
import dateFormatter from '~/utils/dateFormatter';

const identityFormatter = (value: any) => value;

const renderChickPlacementDay = (reFetch: any) => (data: any) =>
    dateFormatter(data?.row?.actualChickPlacementDay || data?.row?.chickPlacementDay);

export default renderChickPlacementDay;

