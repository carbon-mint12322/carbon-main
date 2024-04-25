import { stringDateFormatter } from '~/utils/dateFormatter';
import { GridValueGetterParams } from '@mui/x-data-grid';

const dateValueGetter = (value: string) => (params: GridValueGetterParams) =>
    params.row[value] ? stringDateFormatter(params.row[value]) : '';

export default dateValueGetter;