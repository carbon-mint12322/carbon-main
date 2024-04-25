import React from 'react';
import { Box, TextField } from '@mui/material';
import { GridFilterItem, GridFilterOperator, GridFilterInputValueProps } from '@mui/x-data-grid';

export const containFilterOperator: GridFilterOperator[] = [
  {
    label: 'Contain',
    value: 'contain',
    getApplyFilterFn: (filterItem: GridFilterItem) => {
      if (!filterItem.columnField || !filterItem.value || !filterItem.operatorValue) {
        return null;
      }
      return (params: any): boolean => {
        if (params?.value?.length > 0) {
          const containsFilter = params?.value?.filter((containsFilter: any) =>
            containsFilter?.name?.toLowerCase().includes(filterItem.value.toString().toLowerCase()),
          );
          return containsFilter.length > 0;
        } else {
          return false;
        }
      };
    },
    InputComponent: ContainInputValue,
  },
];

function ContainInputValue(props: GridFilterInputValueProps) {
  const { item, applyValue, focusElementRef } = props;

  const handleFilterChange = (event: any) => {
    applyValue({ ...item, value: event.target.value });
  };

  return (
    <Box
      border={'3px solid blue'}
      sx={{
        display: 'inline-flex',
        flexDirection: 'row',
        alignItems: 'center',
        height: 48,
        pl: '20px',
      }}
    >
      <TextField
        id='standard-search'
        label='Search field'
        type='search'
        variant='standard'
        onChange={handleFilterChange}
      />
    </Box>
  );
}
