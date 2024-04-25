import React, { useState } from 'react';
import {
  Button,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
} from '@mui/material';

import Dialog from '~/components/lib/Feedback/Dialog';
import FileUpload from './FileUpload';
import If from './lib/If';

export interface DocumentType {
  label: string;
  value: string;
}

export interface UploadFileDialogProps {
  title: string;
  open: boolean;
  onClose: () => void;
  onSubmit: (fileUrl: string[], documentType?: string) => void;
  isMultipleFileSelectionAllowed?: boolean;
  documentTypeList?: DocumentType[];
  documentTypeListLabel?: string;
}

function UploadFileDialog({
  title,
  open,
  onClose,
  onSubmit,
  isMultipleFileSelectionAllowed = false,
  documentTypeList,
  documentTypeListLabel = 'Document Type',
}: UploadFileDialogProps) {
  const [files, setFiles] = useState<string[]>([]);

  const [documentType, setDocumentType] = useState<string>();

  const handleSubmit = () => {
    onSubmit(files, documentType);
  };

  const handleOnChange = (fileUrl: string[]) => {
    setFiles(fileUrl);
  };

  const handleSupportingDocumentTypeChange = (event: SelectChangeEvent) => {
    setDocumentType(event.target.value as string);
  };

  return (
    <Dialog fullWidth maxWidth={'md'} open={Boolean(open)} onClose={onClose} title={title}>
      <Stack
        spacing={3}
        sx={{
          pt: 1,
        }}
      >
        <If value={documentTypeList?.length}>
          <FormControl fullWidth>
            <InputLabel>{documentTypeListLabel}</InputLabel>
            <Select
              value={documentType}
              label={documentTypeListLabel}
              onChange={handleSupportingDocumentTypeChange}
            >
              {documentTypeList?.map((item, index) => (
                <MenuItem value={item.value} key={index}>
                  {item.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </If>
        <FileUpload
          files={files}
          onChange={handleOnChange}
          isMultipleFileSelectionAllowed={isMultipleFileSelectionAllowed}
        />
        <Stack direction='row' spacing={2} justifyContent='flex-start'>
          <Button
            variant='contained'
            onClick={handleSubmit}
            disabled={
              files?.length === 0 ||
              (documentTypeList && documentTypeList?.length > 0 && !documentType)
            }
          >
            Submit
          </Button>
          <Button onClick={onClose} variant='contained' color='secondary'>
            Cancel
          </Button>
        </Stack>
      </Stack>
    </Dialog>
  );
}

export default UploadFileDialog;
