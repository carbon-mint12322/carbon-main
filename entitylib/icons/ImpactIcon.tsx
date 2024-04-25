import { World } from '~/components/Icons';
import { useTheme } from '@mui/material';

export default function Component(_props: any) {
    const theme = useTheme();
    return <World color={theme.palette.iconColor.primary} />;
}