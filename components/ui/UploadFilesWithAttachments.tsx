import React, { useEffect, useMemo, useState } from 'react';

import { WidgetProps, FieldProps } from '@rjsf/utils';
import { Box, Modal, Typography } from '@mui/material';

import FileUpload from '../FileUpload';
import { fetchFileType, stringToFileName } from '~/utils/fileFormatter';
import AttachmentLink from './AttachmentLink';
import If, { IfNot } from '../lib/If';
import EventsGallery from '../EventsGallery';
import CircularLoader from '../common/CircularLoader';
import { useEventAttachmentData } from '~/contexts/EventAttachmentDataContext';
import { isArray } from 'lodash';

interface UploadFilesOwnProps {
  readonly?: boolean; // new prop for readonly mode
}

type UploadFilesWithAttachmentsProps = UploadFilesOwnProps & (WidgetProps | FieldProps);

const UploadFilesWithAttachments = ({
  schema,
  uiSchema,
  onChange = () => null,
  value,
  required,
  formData,
  readonly = false,
  formContext,
}: UploadFilesWithAttachmentsProps) => {
  const [fileList, setFileList] = useState<string[]>([]);

  const [selectedImages, setSelectedImages] = useState<Record<string, any>[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<Record<string, any>[]>([]);
  const [selectedAudio, setSelectedAudio] = useState<Record<string, any>[]>([]);
  const [selectedNotes, setSelectedNotes] = useState<Record<string, any>[]>([]);
  const [isUpload, setIsUpload] = React.useState(false);
  const [uploadedFile, setUploadedFile] = useState<Record<string, any>[]>([]);

  const { eventAttachmentData: data, loading } = useEventAttachmentData();

  useEffect(() => {
    if ((formData || value) && !fileList?.length) {
      const data = formData || value;
      if (data) {
        if (schema?.type === 'array' && isArray(data)) {
          setFileList(data);
        } else if (!schema?.type && !required) {
          setFileList([data]);
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleOnChange = (fileUrl: string[]) => {
    setFileList(fileUrl);
    onChange(checkMultipleData(fileUrl));
  };

  const handleOnClick = (event: React.MouseEvent<HTMLLabelElement, MouseEvent>) => {
    event.stopPropagation();
    event.preventDefault();
    setIsUpload(true);
  };

  const handleUploadClose = () => {
    setIsUpload(false);
  };

  const handleUploadSubmit = (selectedValues: Record<string, any>) => {
    let fileData = [...fileList];

    Object.keys(selectedValues).forEach((item: string) => {
      if (selectedValues[item]?.length > 0) {
        const selectedValue = selectedValues[item];
        switch (item) {
          case 'audio':
            {
              const fileLinks = selectedValue.map((item: Record<string, any>) => item.link);
              fileData = fileData.concat(fileLinks);
              setSelectedAudio(selectedValue);
            }
            break;
          case 'text':
            {
              const fileLinks = selectedValue.map((item: Record<string, any>) => item.link);
              fileData = fileData.concat(fileLinks);
              setSelectedNotes(selectedValue);
            }
            break;
          case 'image':
          case 'photo':
            {
              const fileLinks = selectedValue.map((item: Record<string, any>) => item.link);
              fileData = fileData.concat(fileLinks);
              setSelectedImages(selectedValue);
            }
            break;
          case 'document':
          default:
            {
              const fileLinks = selectedValue.map((item: Record<string, any>) => item.link);
              fileData = fileData.concat(fileLinks);
              setSelectedDocument(selectedValue);
            }
            break;
        }
      }
    });

    setFileList(fileData);
    onChange(checkMultipleData(fileData));
    setIsUpload(false);
  };

  const handleUploadBtnClick = async (recordData: any, filesDataURL: string) => {
    let fileData: any[] = [];
    if (filesDataURL) {
      if (schema?.type === 'array') {
        fileData = [filesDataURL, ...fileList];
        setUploadedFile((uploadedFiles) => [
          {
            filesDataURL,
            cardViewProps: recordData,
          },
          ...uploadedFiles,
        ]);
      } else {
        fileData = [filesDataURL, ...fileList];
        setUploadedFile([
          {
            filesDataURL,
            cardViewProps: recordData,
          },
        ]);
      }
    }
  };

  const handleSelection = () => {};

  const handleOnDelete = (dataUrl: string) => {
    const type = fetchFileType(dataUrl);
    switch (type) {
      case 'audio': {
        const trimmedData = removeDataFromArray(selectedAudio, dataUrl, 'link');
        setSelectedAudio([...trimmedData]);
        return;
      }
      case 'text': {
        const trimmedData = removeDataFromArray(selectedNotes, dataUrl, 'link');
        setSelectedNotes([...trimmedData]);
        return;
      }
      case 'image':
      case 'photo': {
        const trimmedData = removeDataFromArray(selectedImages, dataUrl, 'link');
        setSelectedImages([...trimmedData]);
        return;
      }
      case 'document':
      default: {
        const trimmedData = removeDataFromArray(selectedDocument, dataUrl, 'link');
        setSelectedDocument([...trimmedData]);
        return;
      }
    }
  };

  const removeDataFromArray = (
    arrayData: Record<string, any>[],
    dataValue: string,
    key: string,
  ): Record<string, any>[] => {
    const index = arrayData.findIndex((item: Record<string, any>) => item[key] === dataValue);
    if (index > -1) {
      const fileData = [...arrayData];

      fileData?.splice(index, 1);
      return fileData;
    }
    return arrayData;
  };

  const checkMultipleData = (arrayData: any[]): any[] | any => {
    if (schema?.type === 'array') {
      return arrayData;
    } else {
      return arrayData[0];
    }
  };

  const uploadModelStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    minWidth: '75%',
    maxHeight: '85%',
    bgcolor: 'background.paper',
    border: '1px solid #EFEFEF',
    boxShadow: 24,
    p: 4,
    overflow: 'scroll',
  };

  return (
    <Box sx={{ border: '2px solid #EEEEEE', borderRadius: '6px', padding: '16px', width: '100%' }}>
      <If value={readonly}>
        {isArray(fileList) &&
          fileList?.map((fileUrl, index) => (
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
          onClick={handleOnClick}
          onDelete={handleOnDelete}
        />
      </IfNot>

      <If value={isUpload}>
        <Modal open={isUpload} onClose={handleUploadClose}>
          <CircularLoader
            value={loading}
            sx={{
              minHeight: '15rem',
              maxHeight: '15rem',
            }}
          >
            <Box sx={uploadModelStyle}>
              <EventsGallery
                data={data}
                uploadedFile={uploadedFile}
                selectedImages={selectedImages}
                selectedDocument={selectedDocument}
                selectedAudio={selectedAudio}
                selectedNotes={selectedNotes}
                onImageSelect={handleSelection}
                onDocumentSelect={handleSelection}
                onAudioSelect={handleSelection}
                onNotesSelect={handleSelection}
                handleMainBtnClick={handleUploadSubmit}
                handleSubBtnClick={handleUploadClose}
                handleUploadBtnClick={handleUploadBtnClick}
                multipleSelection={schema?.type === 'array'}
              />
            </Box>
          </CircularLoader>
        </Modal>
      </If>
    </Box>
  );
};

export default UploadFilesWithAttachments;
