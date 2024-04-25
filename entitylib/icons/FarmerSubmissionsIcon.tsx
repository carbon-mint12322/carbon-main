import { DownloadSimple } from '~/components/Icons';
import { useTheme } from '@mui/material';

export default function Component(_props: any) {
    const theme = useTheme();
    return <DownloadSimple color={theme.palette.iconColor.tertiary} />;
}