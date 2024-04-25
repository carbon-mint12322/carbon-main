import { useTheme } from '@mui/material';
import { CalendarBlank } from '~/components/Icons';

export default function Component(_props: any) {
  const theme = useTheme();
  return <CalendarBlank color={theme.palette.iconColor.secondary} />;
}
