import { useTheme } from '@mui/material';

import { LayersOutlined } from '@mui/icons-material';

export default function Component(_props: any) {
  const theme = useTheme();
  return <LayersOutlined fontSize='medium' sx={{ color: theme.palette.iconColor.secondary, margin: '0 6px', }} />;
}
