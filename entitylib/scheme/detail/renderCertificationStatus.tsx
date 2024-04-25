import stringFormatter from '~/utils/stringFormatter';
import numberFormatter from '~/utils/numberFormatter';
import dateFormatter from '~/utils/dateFormatter';

const identityFormatter = (value: any) => value;

const renderCertificationStatus = (reFetch: any) => (data: any) =>
    stringFormatter(data?.certificationStatus);

export default renderCertificationStatus;

