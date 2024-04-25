import stringFormatter from '~/utils/stringFormatter';
import numberFormatter from '~/utils/numberFormatter';
import dateFormatter from '~/utils/dateFormatter';
import RenderActionCell from '~/entitylib/functions/renderCells/renderActionCell';

const identityFormatter = (value: any) => value;

const renderLandownerName = (reFetch: any) => (data: any) =>
    stringFormatter(data.row.personalDetails?.firstName) + ' ' + stringFormatter(data.row.personalDetails?.lastName ? data.row.personalDetails.lastName : '');

export default renderLandownerName;

