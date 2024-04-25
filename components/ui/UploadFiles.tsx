import React, { useEffect, useState } from 'react';

import { WidgetProps, FieldProps } from '@rjsf/utils';
import { Box, Typography } from '@mui/material';

import { CustomWidgetsProps } from '~/frontendlib/dataModel';
import FileUpload from '../FileUpload';
import PdfViewerModel from '~/components/ui/PdfViewerModel';
import { fileToDataURL, dataURLToFile, stringToFileName } from '~/utils/fileFormatter';
import AttachmentLink from './AttachmentLink';
import If, { IfNot } from '../lib/If';

interface UploadFilesOwnProps {
  readonly?: boolean; // new prop for readonly mode
}

type UploadFilesProps = UploadFilesOwnProps & (WidgetProps | FieldProps);

const UploadFiles = ({
  schema,
  onChange = () => null,
  value,
  required,
  formData,
  readonly = false,
}: UploadFilesProps) => {
  const [fileList, setFileList] = useState<string[]>([]);
  const [showPdf, setShowPdf] = useState(false);
  useEffect(() => {
    if ((formData || value) && !fileList?.length) {
      const data = formData || value;

      if (schema?.type === 'array') {
        setFileList(data);
      } else {
        setFileList([data]);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleOnChange = (fileUrl: string[]) => {
    setFileList(fileUrl);
    if (schema?.type === 'array') {
      onChange(fileUrl);
    } else {
      onChange(fileUrl?.[0]);
    }
  };

  return (
    <Box sx={{ border: '2px solid #EEEEEE', borderRadius: '6px', padding: '16px', width: '100%' }}>
      <If value={readonly}>
        {fileList.map((fileUrl, index) => (
          <AttachmentLink
            key={index}
            url={fileUrl}
            fileName={stringToFileName(fileUrl)}
            title={'Attachment'}
          />
        ))}
      </If>

      <IfNot value={readonly}>
        <Typography>{`${schema.title}${required ? ' *' : ''}`}</Typography>
        <FileUpload
          files={fileList}
          onChange={handleOnChange}
          isMultipleFileSelectionAllowed={schema?.type === 'array'}
        />
      </IfNot>
    </Box>
  );
};

export default UploadFiles;
