import React from 'react';

import { FormControl, MenuItem, Select } from '@mui/material';

import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

interface MenuItemData {
  label: string;
  value: string;
}

interface DefaultValueSelectProps {
  value: string;
  menuItems: MenuItemData[];
  onChange: (value: string) => void;
}

function DefaultValueSelect({ value, menuItems, onChange }: DefaultValueSelectProps) {
  return (
    <FormControl variant='standard' sx={{ m: 1, maxWidth: 200 }}>
      <Select
        disableUnderline
        IconComponent={KeyboardArrowDownIcon}
        displayEmpty
        value={value}
        onChange={(event) => onChange(event.target.value)}
        sx={{
          '& .MuiInput-input:focus': {
            backgroundColor: 'unset',
          },
        }}
      >
        {menuItems?.map((item: MenuItemData, index: number) => (
          <MenuItem key={index} value={item?.value}>
            {item?.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

export default DefaultValueSelect;
