import stringFormatter from '~/utils/stringFormatter';
import numberFormatter from '~/utils/numberFormatter';
import dateFormatter from '~/utils/dateFormatter';

const identityFormatter = (value: any) => value;

const renderSchemeName = (reFetch: any) => (data: any) =>
    stringFormatter(data?.row?.schemeName);

export default renderSchemeName;

