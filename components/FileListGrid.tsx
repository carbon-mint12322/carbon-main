import { Box, Button, IconButton, Stack, Typography } from '@mui/material';
import React, { useState } from 'react';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined';
import PdfViewerModel from './ui/PdfViewerModel';
import ArrowCircleDownIcon from '@mui/icons-material/ArrowCircleDown';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';

const FileBar = ({ record, handlePdfOpen }: any) => {
  const [isMore, setIsMore] = React.useState(false);
  const fileHandler = () => {
    handlePdfOpen(record?.link);
  };
  const toggleMore = () => {
    setIsMore(!isMore);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '8px 32px',
        borderBottom: '1px solid #DEDEDE',
        borderTop: '1px solid #DEDEDE',
      }}
    >
      <Box
        sx={{ display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer' }}
        onClick={fileHandler}
      >
        <InsertDriveFileOutlinedIcon sx={{ fontSize: '20px', color: '#536DFE' }} />
        <Typography>{record?.name}</Typography>
      </Box>
      <Stack direction='row' spacing={2}>
        {isMore && (
          <Button
            variant='text'
            startIcon={<ArrowCircleDownIcon />}
            onClick={() => {
              var url = record?.link;
              fetch(url).then((response) => {
                response.blob().then((blob) => {
                  // Creating new object of PDF file
                  const fileURL = window.URL.createObjectURL(blob);
                  // Setting various property values
                  let alink = document.createElement('a');
                  alink.href = fileURL;
                  alink.download = `${record?.name}_pdf.pdf`;
                  alink.click();
                });
              });
              setIsMore(false);
            }}
          >
            Download
          </Button>
        )}
        {isMore && (
          <Button variant='text' startIcon={<VisibilityIcon />} onClick={fileHandler}>
            View
          </Button>
        )}
        {isMore && (
          <Button variant='text' startIcon={<DeleteIcon />}>
            Delete
          </Button>
        )}
        <IconButton onClick={toggleMore}>
          <MoreHorizIcon sx={{ fontSize: '24px', color: 'grey' }} />
        </IconButton>
      </Stack>
    </Box>
  );
};

const FileListGrid = ({ recordsList = [] }: any) => {
  const [open, setOpen] = React.useState(false);
  const [pdfLink, setPdfLink] = useState('');
  const handleOpen = (pdf: string) => {
    setOpen(true);
    setPdfLink(pdf);
  };
  const handleClose = () => setOpen(false);

  return (
    <>
      <PdfViewerModel open={open} handleClose={handleClose} pdfLink={pdfLink} />
      {recordsList?.lenght &&
        recordsList?.map((record: any, index: number) => {
          return <FileBar record={record} key={`fileBar${index}`} handlePdfOpen={handleOpen} />;
        })}
    </>
  );
};
export default FileListGrid;
