import stringFormatter from '~/utils/stringFormatter';
import numberFormatter from '~/utils/numberFormatter';
import dateFormatter from '~/utils/dateFormatter';

const identityFormatter = (value: any) => value;

const renderCertificationDocument = (reFetch: any) => (data: any) =>
    identityFormatter(data?.certificationDocument);

export default renderCertificationDocument;

