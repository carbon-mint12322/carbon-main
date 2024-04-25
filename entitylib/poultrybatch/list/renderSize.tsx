import stringFormatter  from '~/utils/stringFormatter';
import numberFormatter  from '~/utils/numberFormatter';
import dateFormatter  from '~/utils/dateFormatter';

const identityFormatter = (value: any) => value;

const renderSize = (reFetch: any) => (data: any)  =>
    numberFormatter(data?.row?.actualSize || data?.row?.size);

export default renderSize;

