
import React, { useState, useEffect } from 'react';
import qrlib from 'qrcode';
import Image from 'next/image';
import { ShareQR } from "./ShareQR";


export const QRCode = ({ link }: any) => {
    const [qrcode, setQrcode]: any = useState(null);
    useEffect(() => {
        qrlib.toDataURL(link).then((data) => {
            setQrcode(data);
        });
    }, []);
    return (
        <>
            {qrcode && (
                <div
                    style={{
                        width: '100%',
                        justifyContent: 'flex-start',
                        alignItems: 'flex-start',
                        display: 'flex',
                        flexDirection: 'row',
                        background: 'white',
                        marginBottom: 20,
                    }}
                >
                    <Image src={qrcode} width={250} height={250} alt='QR Code'/>
                    <ShareQR link={link} qrcode={qrcode} />
                </div>
            )}
        </>
    );
};
