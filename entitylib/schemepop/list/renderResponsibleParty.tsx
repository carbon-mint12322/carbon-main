import stringFormatter from '~/utils/stringFormatter';
import numberFormatter from '~/utils/numberFormatter';
import dateFormatter from '~/utils/dateFormatter';

const identityFormatter = (value: any) => value;

const renderResponsibleParty = (reFetch: any) => (data: any) =>
    identityFormatter(data?.row?.responsibleParty);

export default renderResponsibleParty;

