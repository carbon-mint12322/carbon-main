import React, { useState, useEffect } from 'react';

import { Typography, Box, IconButton } from '@mui/material';

import UploadFileIcon from '@mui/icons-material/UploadFile';
import DeleteIcon from '@mui/icons-material/Delete';
import PdfViewerModel from '~/components/ui/PdfViewerModel';

import If, { IfNot } from '~/components/lib/If';

import CircularLoader from '../common/CircularLoader';

import {
  fileToDataURL,
  dataURLToFile,
  stringToFileName,
  fetchFileType,
  isDataUrl,
} from '~/utils/fileFormatter';
import AttachmentLink from '../ui/AttachmentLink';
import Dialog from '~/components/lib/Feedback/Dialog';
import { getFileUrl, isImgUrl } from '~/frontendlib/util';
import { isArray } from 'lodash';

export interface FileUploadProps {
  onChange: (files: string[]) => void;
  files: string[];
  isMultipleFileSelectionAllowed?: boolean;
  onClick?: (event: React.MouseEvent<HTMLLabelElement, MouseEvent>) => void;
  onDelete?: (file: string) => void;
}

function FileUpload({
  files,
  isMultipleFileSelectionAllowed = false,
  onChange = () => { },
  onClick = () => { },
  onDelete = () => null,
}: FileUploadProps) {
  const [dataUrlFileList, setDataUrlFileList] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>();
  const [showPdf, setShowPdf] = useState(false);
  const [showImage, setShowImage] = useState(false);
  const [openFile, setOpenFile] = useState('');

  const domain = window.location.hostname ? window.location.hostname : 'localhost';

  useEffect(() => {
    if (files?.length) {
      setDataUrlFileList(files);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [files]);

  const allowDrop = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
  };

  const drop = (event: React.DragEvent<HTMLLabelElement>) => {
    event?.preventDefault();
    event?.stopPropagation();
    const { files } = event.dataTransfer;
    files && files?.length && uploadFiles(files);
  };

  const setSelectedFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    event?.preventDefault();
    event?.stopPropagation();
    const { files } = event.currentTarget;
    files && files?.length && uploadFiles(files);
  };

  const uploadFiles = async (files: FileList) => {
    try {
      setLoading(true);
      setError(undefined);

      if (files && files.length) {
        const fileNamesData: File[] = Object.values(files)?.map((file: File) => file);

        if (isMultipleFileSelectionAllowed) {
          const _files = await fileNamesData.reduce(async (acc: Promise<string[]>, file: File) => {
            const accData = await acc;
            if (+(file.size / 1024 / 1024).toFixed(2) > 5) {
              setError('File size cannot be more than 5mb');
              return accData;
            }
            if (file.type !== 'application/pdf' && !file.type.startsWith('image/')) {
              setError('Please upload only PDF or Image files');

              return accData;
            }
            const fileDataURL = await fileToDataURL(file);
            return [...(accData || []), fileDataURL];
          }, Promise.resolve([]));

          const filesDataURL = [...dataUrlFileList, ..._files];
          setDataUrlFileList(filesDataURL);
          onChange(filesDataURL);
        } else {
          if (+(fileNamesData[0].size / 1024 / 1024).toFixed(2) > 5) {
            setError('File size cannot be more than 5mb');
          }

          if (
            !fileNamesData[0].type.startsWith('image/jpeg') &&
            !fileNamesData[0].type.startsWith('image/jpg') &&
            !fileNamesData[0].type.startsWith('image/png') &&
            !fileNamesData[0].type.startsWith('image/webp') &&
            !fileNamesData[0].type.startsWith('application/pdf')
          ) {
            setError('Please upload only PDF or Image files');
          } else {
            const file = await fileToDataURL(fileNamesData[0]);
            const filesDataURL = [file];
            setDataUrlFileList(filesDataURL);
            // setFileList([fileNamesData[0]]);
            onChange(filesDataURL);
          }
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const deleteSelectedFile = (index: number) => {
    const dataUrlFiles = [...dataUrlFileList];

    // files?.splice(index, 1);
    dataUrlFiles?.splice(index, 1);
    setDataUrlFileList([...dataUrlFiles]);
    onDelete(dataUrlFileList[index]);
    onChange([...dataUrlFiles]);
  };

  const openFileModal = (file: any) => {
    isImgUrl(file) ? setShowImage(true) : setShowPdf(true);
    setOpenFile(file);
  };

  const closeFileModal = () => {
    setShowImage(false);
    setShowPdf(false);
    setOpenFile('');
  };

  return (
    <CircularLoader value={loading}>
      <IfNot value={loading}>
        <If value={dataUrlFileList?.length}>
          {isArray(dataUrlFileList) &&
            dataUrlFileList?.map((file: string, index: number) => (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '2rem',
                  justifyContent: 'space-between',
                }}
                key={`fileList${index}`}
              >
                <React.Fragment key={index}>
                  {/*<AttachmentLink url={file} fileName={stringToFileName(file)} title={'Attachment'} />*/}
                  <Typography
                    sx={{ cursor: 'pointer', gap: '1', textDecoration: 'underline' }}
                    onClick={() => openFileModal(file)}
                  >
                    {stringToFileName(file).length < 17
                      ? stringToFileName(file)
                      : `${stringToFileName(file).slice(0, 15)}..`}
                  </Typography>
                </React.Fragment>
                <IconButton onClick={() => deleteSelectedFile(index)}>
                  <DeleteIcon />
                </IconButton>
              </Box>
            ))}
          {showPdf && (
            <PdfViewerModel
              open={showPdf}
              handleClose={() => closeFileModal()}
              pdfLink={isDataUrl(openFile) ? openFile : getFileUrl(openFile, domain)}
            />
          )}
          {showImage && (
            <Dialog
              onClose={() => closeFileModal()}
              open={showImage}
              dialogContentProps={{ sx: { overflow: 'hidden', padding: '0' } }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  position: 'relative',
                  width: 'auto',
                  aspectRatio: '1/1',
                  maxHeight: '70vh',
                  minHeight: '45vh',
                  overflow: 'hidden',
                }}
              >
                <img
                  src={isDataUrl(openFile) ? openFile : getFileUrl(openFile, domain)}
                  style={{
                    height: '100%',
                  }}
                  alt='document'
                />
              </div>
            </Dialog>
          )}
        </If>

        <If value={!dataUrlFileList?.length || isMultipleFileSelectionAllowed}>
          <Box
            sx={{
              background: 'rgba(141, 36, 170, 0.09)',
              borderStyle: 'dashed',
              borderColor: 'primary.main',
              marginTop: '1rem',
            }}
          >
            <label
              style={{
                width: '100%',
                marginTop: '8px',
                background: 'rgba(141, 36, 170, 0.03)',
              }}
              onDrop={drop}
              onDragOver={allowDrop}
              onClick={onClick}
            >
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '1rem',
                  padding: '50px 75px 30px',
                }}
              >
                <UploadFileIcon />

                <Typography>Select files from your computer or drag and drop them here</Typography>
              </Box>
              <input
                type='file'
                multiple={isMultipleFileSelectionAllowed}
                name='myfile'
                onChange={setSelectedFile}
                hidden
                accept='image/jpeg,image/png,image/jpg,application/pdf'
              />
            </label>
          </Box>
          <If value={error}>
            <Typography color='error'>{error}</Typography>
          </If>
        </If>
      </IfNot>
    </CircularLoader>
  );
}

export default FileUpload;
