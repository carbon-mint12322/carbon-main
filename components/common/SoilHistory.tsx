import dynamic from 'next/dynamic';
import React, { useState } from 'react';

import TableView from '~/container/landparcel/details/TableView';
import { GridRenderCellParams, GridValueGetterParams } from '@mui/x-data-grid';
import { Button } from '@mui/material';
import ListAction from '~/components/lib/ListAction';
import mapStyles from '~/styles/theme/map/styles';
import Typography from '@mui/material/Typography';
import { isImgUrl } from '~/frontendlib/util';
import PdfViewerModel from '~/components/ui/PdfViewerModel';
import Dialog from '~/components/lib/Feedback/Dialog';

interface SoilHistoryProps {
  data: any;
}

export default function SoilHistory(props: SoilHistoryProps) {
  const [showPdf, setShowPdf] = useState(false);
  const [showImage, setShowImage] = useState(false);

  const handleMap = (id: string) => { };
  function renderActionCell(params: GridRenderCellParams) {
    return (
      <Button
        onClick={(e) => {
          e.stopPropagation();
          //setSelectedRowId(params.row.id);
          // setCheck(params.row);
          handleMap(params.row.id);
        }}
      >
        Show On Map
      </Button>
    );
  }

  function renderFileCell(params: GridRenderCellParams) {
    return (
      <>
        <Typography
          sx={{ cursor: 'pointer', gap: '1', textDecoration: 'underline' }}
          onClick={() =>
            isImgUrl(params.row.details?.soilInfo?.soilTestReport)
              ? setShowImage(true)
              : setShowPdf(true)
          }
        >
          View Report
        </Typography>
        <PdfViewerModel
          open={showPdf}
          handleClose={() => setShowPdf(false)}
          pdfLink={params.row.details?.soilInfo?.soilTestReport}
        />
        <Dialog
          onClose={() => setShowImage(false)}
          open={showImage}
          dialogContentProps={{ sx: { overflow: 'hidden', padding: '0' } }}
        >
          <img
            src={params.row.details?.soilInfo?.soilTestReport}
            style={{
              overflow: 'hidden',
              objectFit: 'contain',
              maxHeight: '100%',
              maxWidth: '100%',
            }}
            alt='document'
          />
        </Dialog>
      </>
    );
  }

  return (
    <>
      <TableView
        getRowId={(item) => item.id}
        name='Soil History'
        columnConfig={[
          {
            field: 'endDate',
            headerName: 'Date Tested',
            flex: 1,
            valueGetter: (params: GridValueGetterParams) =>
              `${params.row.details?.soilInfo?.endDate}`,
          },
          // {
          //     field: 'soilColor',
          //     headerName: 'Soil Color',
          //     flex: 1,
          // },
          // {
          //     field: 'soilTexture',
          //     headerName: 'Soil Texture',
          //     flex: 1,
          // },
          // {
          //     field: 'n',
          //     headerName: 'N',
          //     flex: 1,
          // },
          // {
          //     field: 'p',
          //     headerName: 'P',
          //     flex: 1,
          // },
          // {
          //     field: 'k',
          //     headerName: 'K',
          //     flex: 1,
          // },
          {
            field: 'soilTestReport',
            headerName: 'Report',
            flex: 1,
            renderCell: renderFileCell,
          },
          {
            field: 'actions',
            headerName: 'Actions',
            sortable: false,
            flex: 1,
            renderCell: renderActionCell,
          },
        ]}
        key='soil-history'
        data={props.data}
        addBtnVisible={false}
      />
    </>
  );
}
