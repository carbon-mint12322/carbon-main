import stringFormatter from '~/utils/stringFormatter';
import numberFormatter from '~/utils/numberFormatter';
import dateFormatter from '~/utils/dateFormatter';

const identityFormatter = (value: any) => value;

const renderConversionStatus = (reFetch: any) => (data: any) =>
    stringFormatter(data?.conversionStatus);

export default renderConversionStatus;

