import React, { useState, useEffect, Dispatch, SetStateAction, ChangeEvent } from 'react';
import { useAlert } from '~/contexts/AlertContext';
import { read, utils } from 'xlsx';
import { getPopFromExcel } from '~/frontendlib/utils/getPopFromExcel';
import { PopFromExcel } from '~/backendlib/pop/types';
import moment from 'moment';
export function ReadExcelFromTemplate({
    showUpload,
    setShowUpload,
    onExcelDataFetched,
    isExternal
}: {
    showUpload: boolean;
    setShowUpload: Dispatch<SetStateAction<boolean>>;
    onExcelDataFetched: Dispatch<SetStateAction<PopFromExcel | undefined>> | any;
    isExternal?: boolean
}) {
    const { openToast } = useAlert();

    const readFile = (
        file: any,
        format: 'string' | 'arrayBuffer' | 'base64' = 'string',
    ): Promise<string | ArrayBuffer | null> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = function fileReadCompleted() {
                // when the reader is done, the content is in reader.result.
                resolve(reader.result);
            };

            if (format === 'base64') return reader.readAsDataURL(file);
            if (format === 'arrayBuffer') return reader.readAsArrayBuffer(file);

            reader.readAsText(file);
        });
    };

    const uploadHandler = async (event: any) => {
        try {
            const files = event?.target?.files;

            if (files.length === 0) {
                console.log('No file selected.');
                return;
            }

            const file = files[0];

            const content = (await readFile(file, 'arrayBuffer')) as ArrayBuffer;

            const wb = read(content, { cellDates: true });
            const firstSheet = wb.Sheets[Object.keys(wb.Sheets)[0]];
            const json = utils.sheet_to_json(firstSheet, { raw: true })
            json.forEach((item : any) => {
                item['Start Date'] = moment(item['Start Date']).format('YYYY-MM-DD')
                item['End Date'] = moment(item['End Date']).format('YYYY-MM-DD')
            })
            if (isExternal) { return onExcelDataFetched(json) }
            const pop = getPopFromExcel(json);

            if (pop) onExcelDataFetched(pop);
        } catch (e: any) {
            const errorMessage = `An error occurred: ${e.message}`;
            openToast('error', errorMessage);
        }
    };

    // Toggle upload file dialog
    useEffect(() => {
        // if show upload, then show dialog
        if (showUpload) {
            document.getElementById('fileUpload')?.click();
            setShowUpload(false);
        }
    }, [showUpload]);

    return <input type='file' id='fileUpload' style={{ display: 'none' }} onChange={uploadHandler} />;
}