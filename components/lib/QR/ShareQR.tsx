import React, { useState } from 'react';


import { Grid, IconButton, Popover } from '@mui/material';
import { WhatsApp } from '~/components/Icons';
import { Telegram } from '~/components/Icons';
import { Gmail } from '~/components/Icons';
import { Link, Download } from '@mui/icons-material';

export function ShareQR({ link, qrcode }: any) {
    const [open, setOpen] = useState(false);
    const handleCopyLink = () => {
        // NOTE: will result in Safari if the website is http://
        navigator?.clipboard?.writeText(link).then(
            function () {
                console.log('Async: Copying to clipboard was successful!');
            },
            function (err) {
                console.error('Async: Could not copy text: ', err);
            },
        );
    };
    const handleClose = () => {
        setOpen(false);
    };
    return (
        <>
            <Grid
                maxWidth='calc(100vw - 10px)'
                width='fit-content'
                container
                alignItems='center'
                p={1}
                flexWrap='wrap'
                style={{ backgroundColor: '#fff', marginBottom: 8, width: 250 }}
            >
                <a
                    href={`whatsapp://send?text=${link}`}
                    data-action='share/whatsapp/share'
                    target='_blank'
                    rel='noreferrer'
                >
                    <IconButton>
                        <WhatsApp height='40px' width='40px' />
                    </IconButton>
                </a>
                <a
                    href={`tg://msg?text=${link}`}
                    data-action='share/whatsapp/share'
                    target='_blank'
                    rel='noreferrer'
                >
                    <IconButton>
                        <Telegram height='40px' width='40px' />
                    </IconButton>
                </a>
                <a
                    href={`mailto:?body=${link}`}
                    data-action='share/whatsapp/share'
                    target='_blank'
                    rel='noreferrer'
                >
                    <IconButton>
                        <Gmail height='40px' width='40px' />
                    </IconButton>
                </a>

                <IconButton onClick={handleCopyLink}>
                    <Link
                        sx={{ fontSize: '40px', border: 'solid #f0f0f0 1px', borderRadius: '100%' }}
                        htmlColor='#3A7BFA'
                    />
                </IconButton>
                <a download={'QR.png'} href={qrcode} target='_blank' rel='noreferrer'>
                    <IconButton type='button'>
                        <Download
                            sx={{ fontSize: '40px', border: 'solid #f0f0f0 1px', borderRadius: '100%' }}
                            htmlColor='#3A7BFA'
                        />
                    </IconButton>
                </a>
            </Grid>
        </>
    );
}
