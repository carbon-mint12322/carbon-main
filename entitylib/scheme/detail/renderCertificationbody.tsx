import stringFormatter from '~/utils/stringFormatter';
import numberFormatter from '~/utils/numberFormatter';
import dateFormatter from '~/utils/dateFormatter';

const identityFormatter = (value: any) => value;

const renderCertificationbody = (reFetch: any) => (data: any) =>
    identityFormatter(data?.certificationbody?.name);

export default renderCertificationbody;

