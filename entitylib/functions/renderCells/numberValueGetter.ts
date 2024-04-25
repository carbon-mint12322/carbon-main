import { GridValueGetterParams } from '@mui/x-data-grid';

const numberValueGetter = (value: number) => (params: GridValueGetterParams)  =>
     params.row[value] !== undefined && params.row[value] !== null ? params.row[value] : '';

export default numberValueGetter;