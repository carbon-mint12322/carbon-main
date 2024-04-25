import stringFormatter from '~/utils/stringFormatter';
import numberFormatter from '~/utils/numberFormatter';
import dateFormatter from '~/utils/dateFormatter';
import RenderActionCell from '~/entitylib/functions/renderCells/renderActionCell';

const identityFormatter = (value: any) => value;

const renderPrimaryPhone = (reFetch: any) => (data: any) =>
    identityFormatter(data?.row?.personalDetails.primaryPhone);

export default renderPrimaryPhone;

