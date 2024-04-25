import stringFormatter from '~/utils/stringFormatter';
import numberFormatter from '~/utils/numberFormatter';
import dateFormatter from '~/utils/dateFormatter';

const identityFormatter = (value: any) => value;

const renderCertificationAuthority = (reFetch: any) => (data: any) => {
    return stringFormatter(data?.row?.certificationAuthority);
};

export default renderCertificationAuthority;

