import React, { useEffect, useMemo, useState } from 'react';

import { WidgetProps, FieldProps } from '@rjsf/utils';
import { Box } from '@mui/material';

import { stringToFileName } from '~/utils/fileFormatter';
import AttachmentLink from '~/components/ui/AttachmentLink';
import If from '~/components/lib/If';
import { isArray } from 'lodash';

interface UploadFilesOwnProps {
    readonly?: boolean; // new prop for readonly mode
}

type UploadFilesWithAttachmentsProps = UploadFilesOwnProps & (WidgetProps | FieldProps);

export const UploadFilesWithAttachmentsWidget = ({
    schema,
    uiSchema,
    onChange = () => null,
    value,
    required,
    formData,
    readonly = false,
    formContext,
}: UploadFilesWithAttachmentsProps) => {

    let fileList = [];

    const data = formData || value;

    if (data) {
        if (schema?.type === 'array' && isArray(data)) {
            fileList = data
        } else if (!schema?.type && !required) {
            fileList = [data];
        }
    }

    return (
        <>
            <p>{schema.title ?? ""}</p>
            <div className='card-text d-flex flex-row flex-wrap gap-2'>
            {
                isArray(fileList) &&
                fileList?.map((fileUrl, index) => {
                    return <div className='documentLink flex-column col-xs-4 imgs' key={index} data-fileurl={fileUrl} data-title='' />
                })
            }
            </div>
        </>
    );
};
