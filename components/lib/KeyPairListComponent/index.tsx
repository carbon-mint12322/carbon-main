import { Box, Typography } from "@mui/material";
import List from '@mui/material/List';
import Loop from '~/components/lib/Loop';
import { ItemRenderComponentProps, KeyPairListComponentProps } from "./index.interface";
import { toCamelCase } from "~/components/lib/toCamelCase";




const ItemRenderComponent = (props: ItemRenderComponentProps) => {
    return (
        <Box sx={{ paddingTop: '28px' }}>
            <Typography variant='subtitle2' sx={{ color: '#757575', paddingBottom: '4px' }}>
                {props?.title}
            </Typography>
            <Typography id={toCamelCase(props?.title, 'Value')}>{props?.subText}</Typography>
        </Box>

    )
}


const KeyPairListComponent = ({ items }: KeyPairListComponentProps) => {
    return (
        <Box display='flex' justifyContent='left' width={['100%', '40%']}>
            <List>
                <Loop mappable={items} Component={ItemRenderComponent} />
            </List>
        </Box>
    )
}

export default KeyPairListComponent