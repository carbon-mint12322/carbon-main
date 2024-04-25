// Given a URL, this component displays attachment in a pop up dialog.
// If it is an unsupported file type, it will provide a download
// link instead, so that the user can download the file.
// Uses pdf-viewer component to display PDF files, image-viewer to display images.

import { Button, Typography } from '@mui/material';
import { useState } from 'react';
import Dialog from '~/components/lib/Feedback/Dialog';
import { isImgUrl, isPdfUrl, getFileUrl } from '~/frontendlib/util';
import PDFViewer from '../pdf-viewer';
import { isDataUrl } from '~/utils/fileFormatter';

export enum AttachmentType {
  IMAGE = 'image',
  PDF = 'pdf',
  DOWNLOAD = 'download',
}

interface IAttachmentLinkProps {
  url: string;
  title: string;
  fileName?: string;
  diaogContentProps?: object;
  imgStyle?: object;
  documentStyle?: object;
  type?: AttachmentType;
}

interface ContentProps {
  url: string;
  contentStyle: object;
  fileName?: string;
}

const defaultDialogContentProps = { sx: { overflow: 'hidden', padding: '0' } };
const defaultImgStyle = {
  overflow: 'hidden',
  objectFit: 'contain',
  maxHeight: '100%',
  maxWidth: '100%',
};
const defaultDocumentStyle = {};

function AttachmentLink(props: IAttachmentLinkProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const close = () => setIsOpen(false);
  const open = () => setIsOpen(true);
  const dialogProps = props.diaogContentProps || defaultDialogContentProps;
  const imgStyle = props.imgStyle || defaultImgStyle;
  const documentStyle = props.documentStyle || defaultDocumentStyle;

  const type = props.type || url2type(props.url);

  const domain = window.location.hostname ? window.location.hostname : 'localhost';

  const url = getFileUrl(props.url, domain);

  return type != AttachmentType.DOWNLOAD ? (
    <>
      <Typography onClick={open} sx={{ cursor: 'pointer', gap: '1', textDecoration: 'underline' }}>
        {props.fileName || props.title}
      </Typography>
      <Dialog title={props.title} onClose={close} open={isOpen} dialogContentProps={dialogProps}>
        {type == AttachmentType.IMAGE ? (
          <ImageContent url={url} contentStyle={imgStyle} fileName={props.fileName} />
        ) : (
          <PdfContent url={url} contentStyle={documentStyle} fileName={props.fileName} />
        )}
      </Dialog>
    </>
  ) : (
    <DownloadContent url={url} fileName={props.fileName} contentStyle={{}} />
  );
}

function ImageContent(props: ContentProps) {
  const domain = window.location.hostname ? window.location.hostname : 'localhost';

  return (
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
        src={isDataUrl(props.url) ? props.url : getFileUrl(props.url, domain)}
        style={{
          height: '100%',
        }}
        alt='document'
      />
    </div>
  );
}

function PdfContent(props: ContentProps) {
  return (
    <div style={props.contentStyle}>
      <PDFViewer url={props.url} />
    </div>
  );
}

function DownloadContent(props: ContentProps) {
  const { url, fileName } = props;
  return (
    <a href={url} download={fileName || 'download'} target='_blank' rel='noopener noreferrer'>
      <Button>Download</Button>
    </a>
  );
}

function url2type(url: string) {
  if (isImgUrl(url)) {
    return AttachmentType.IMAGE;
  } else if (isPdfUrl(url)) {
    return AttachmentType.PDF;
  } else {
    return AttachmentType.DOWNLOAD;
  }
}

export default AttachmentLink;
