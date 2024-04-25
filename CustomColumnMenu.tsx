import { GridColumnMenu, GridColumnMenuProps } from '@mui/x-data-grid';
import ClearIcon from '@mui/icons-material/Clear';
import { RefAttributes } from 'react';

interface CustomColumnMenuProps extends GridColumnMenuProps {}

function CustomColumnMenu(
  props: JSX.IntrinsicAttributes & GridColumnMenuProps & RefAttributes<HTMLUListElement>,
) {
  const handleClearFilter = () => {};

  return (
    <GridColumnMenu
      {...props}

      // components={{
      //   ColumnMenuIconClear: ClearIcon,

      // }}
    />
  );
}

export default CustomColumnMenu;
