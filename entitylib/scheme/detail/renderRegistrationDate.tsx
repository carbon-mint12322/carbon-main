import stringFormatter from '~/utils/stringFormatter';
import numberFormatter from '~/utils/numberFormatter';
import dateFormatter from '~/utils/dateFormatter';

const identityFormatter = (value: any) => value;

const renderRegistrationDate = (reFetch: any) => (data: any) =>
    dateFormatter(data?.registrationDate);

export default renderRegistrationDate;

