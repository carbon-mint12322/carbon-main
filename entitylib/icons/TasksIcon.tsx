import { ClipBoard } from '~/components/Icons';
import { useTheme } from '@mui/material';

export default function Component(_props: any) {
    const theme = useTheme();
    return <ClipBoard color={theme.palette.iconColor.secondary} />;
}