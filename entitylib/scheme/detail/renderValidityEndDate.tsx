import stringFormatter from '~/utils/stringFormatter';
import numberFormatter from '~/utils/numberFormatter';
import dateFormatter from '~/utils/dateFormatter';

const identityFormatter = (value: any) => value;

const renderValidityEndDate = (reFetch: any) => (data: any) =>
    dateFormatter(data?.validityEndDate);

export default renderValidityEndDate;

