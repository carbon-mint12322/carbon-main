import stringFormatter from '~/utils/stringFormatter';
import numberFormatter from '~/utils/numberFormatter';
import dateFormatter from '~/utils/dateFormatter';

const identityFormatter = (value: any) => value;

const renderStatus = (reFetch: any) => (data: any) =>
    stringFormatter(data?.row?.status);

export default renderStatus;

