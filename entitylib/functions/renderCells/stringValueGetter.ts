import { GridValueGetterParams } from '@mui/x-data-grid';

const stringValueGetter = (value: string) => (params: GridValueGetterParams) => {
    const nestedValue = value.split('.').reduce((acc, field) => acc?.[field], params.row);
    return nestedValue !== undefined && nestedValue !== null ? nestedValue : '';
};

export default stringValueGetter;