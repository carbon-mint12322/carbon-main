import { Cube } from '~/components/Icons';
import { useTheme } from '@mui/material';

export default function Component(_props: any) {
  const theme = useTheme();
  return <Cube color={theme.palette.iconColor.default} />;
}
