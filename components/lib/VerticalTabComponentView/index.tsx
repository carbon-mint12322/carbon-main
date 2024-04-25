import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { VerticalTabComponentViewProps } from './index.interface';
import Dialog from '~/components/lib/Feedback/Dialog';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

const ReactJsonSchemaForm = dynamic(() => import("~/components/lib/ReactJsonSchemaForm"));


const styles = {
    cardTitleBarStyle: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    cardStyle: {
        padding: '32px 48px',
    },
};


const VerticalTabComponentView = ({
    children,
    title,
    cardTitleBarStyle,
    handleMainBtnClick,
    buttonLabel,
    jsonSchema,
    uiSchema,
    data
}: VerticalTabComponentViewProps) => {
    const [openModal, setOpenModal] = useState<boolean>(false);
    const handleClose = () => {
        setOpenModal(false);
    };
    const onSubmit = async (data: any) => {
        await handleMainBtnClick(data)
        await handleClose()
    }

    return (
        <Paper sx={{ ...styles.cardStyle, ...cardTitleBarStyle }} elevation={0} square={true}>
            <Box sx={{ ...styles.cardTitleBarStyle, ...cardTitleBarStyle }}>
                <Typography>{title}</Typography>
                <Button
                    variant={'contained'}
                    color={'primary'}
                    onClick={() => setOpenModal(true)}
                    size={'small'}
                >
                    {buttonLabel || 'Edit'}
                </Button>
            </Box>
            <Box display={['flex', 'flex']} flexDirection={['column', 'row']}>
                {children}
            </Box>
            <Dialog open={Boolean(openModal)} onClose={handleClose} fullWidth maxWidth={'md'}>
                <ReactJsonSchemaForm
                    modelName="farmerPersonalDetails"
                    schema={jsonSchema}
                    uiSchema={{ "ui:order": uiSchema }}
                    formData={{ data }}
                    onSubmit={onSubmit}
                    onCancelBtnClick={handleClose}
                />
            </Dialog>
        </Paper>
    )
}
export default VerticalTabComponentView