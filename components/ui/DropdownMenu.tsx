import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';

export default function DropdownMenu({ handleChange, val, label, menuItems, dropdownStyles }: any) {
  return (
    <FormControl fullWidth variant='standard' style={dropdownStyles}>
      <InputLabel id='demo-simple-select-label'>{label}</InputLabel>
      <Select
        labelId='select-label'
        id='crabonmit-select'
        value={val}
        label={label}
        onChange={handleChange}
      >
        {menuItems?.map((item: any, index: number) => (
          <MenuItem value={item.id} key={index}>
            {item.operator}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
