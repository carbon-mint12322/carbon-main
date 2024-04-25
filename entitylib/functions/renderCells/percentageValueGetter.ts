import { GridValueGetterParams } from '@mui/x-data-grid';

const percentageValueGetter = (value: number) => (params: GridValueGetterParams) =>
    params.row[value] ? `${params.row[value]}%` : '0%';

export default percentageValueGetter;