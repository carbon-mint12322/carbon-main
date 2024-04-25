import stringFormatter from '~/utils/stringFormatter';
import numberFormatter from '~/utils/numberFormatter';
import dateFormatter from '~/utils/dateFormatter';

const identityFormatter = (value: any) => value;

const renderScope = (reFetch: any) => (data: any) =>
    stringFormatter(data?.row?.scope);

export default renderScope;

