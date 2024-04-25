import { Files } from '~/components/Icons';
import { useTheme } from '@mui/material';

export default function Component(_props: any) {
    const theme = useTheme();
    return <Files color={theme.palette.iconColor.secondary} />;
}