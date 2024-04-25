import React from 'react';

import { FormControl, Box, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

interface DropdownListProps {
  selectedValues: {
    [key: string]: string;
  };
  handleChange: (event: SelectChangeEvent) => void;
  menuItemsList: string[][];
  MinWidthToSelectItem?: string[];
  selectType?: string[];
}

const DropdownList = ({
  selectedValues,
  handleChange,
  menuItemsList,
  MinWidthToSelectItem = menuItemsList?.map(() => 'unset'),
  selectType = Object.keys(selectedValues),
}: DropdownListProps) => {
  return (
    <Box
      sx={{
        display: 'flex',
        width: '86%',
        justifyContent: 'space-between',
      }}
    >
      {menuItemsList?.map((menuItems: string[], index: number) => (
        <FormControl
          variant='standard'
          key={`select${index}`}
          sx={{ minWidth: `${MinWidthToSelectItem[index]}` }}
        >
          <Select
            value={selectedValues[selectType[index]]}
            onChange={handleChange}
            name={selectType[index]}
            sx={{
              '&::before': {
                borderBottom: 0,
              },
              '&::after': {
                borderBottom: 0,
              },
            }}
            autoWidth={false}
            IconComponent={KeyboardArrowDownIcon}
          >
            {menuItems?.map((item: string, idx: number) => (
              <MenuItem value={item} key={`menuItems${idx}`}>
                {item}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      ))}
    </Box>
  );
};

export default DropdownList;
