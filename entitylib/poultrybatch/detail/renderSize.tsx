import stringFormatter from '~/utils/stringFormatter';
import numberFormatter from '~/utils/numberFormatter';
import dateFormatter from '~/utils/dateFormatter';

const identityFormatter = (value: any) => value;

const renderSize = (reFetch: any) => (data: any) =>
    identityFormatter(data?.actualSize || data?.size);

export default renderSize;

