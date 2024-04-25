import React, { useState } from 'react';
import axios from 'axios';

import { Button } from '@mui/material';

import { useOperator } from '~/contexts/OperatorContext';
import { useAlert } from '~/contexts/AlertContext';

interface DownloadCSVButtonProps {
  id: string;
  reportUrl?: string;
}

function DownloadCSVButton({ id, reportUrl }: DownloadCSVButtonProps) {
  const { getAPIPrefix } = useOperator();
  const { openToast } = useAlert();
  const [isDownloading, setIsDownloading] = useState(false);
  // const handleDownloadReport = async () => {
  //   setIsDownloading(true);
  //   try {
  //     const res = await axios.get(getAPIPrefix() + `/reports/${id}`, { responseType: 'blob' });
  //     if (res) {
  //       const blob = new Blob([res.data], { type: 'text/csv' });
  //       const url = URL.createObjectURL(blob);
  //       const contentDispositionHeader = res.headers?.['content-disposition'];

  //       let fileName = 'report.csv';
  //       if (contentDispositionHeader) {
  //         const matches = contentDispositionHeader.match(/filename=(.+)/);
  //         if (matches && matches.length > 1) {
  //           fileName = `${matches[1]}.csv`;
  //         }
  //       }
  //       const link = document.createElement('a');
  //       link.href = url;
  //       link.download = fileName;
  //       document.body.appendChild(link);
  //       link.click();

  //       openToast('success', 'Report downloaded');
  //     }
  //   } catch (error: any) {
  //     openToast('error', error?.message || 'Something went wrong');
  //   } finally {
  //     setIsDownloading(false);
  //   }
  // };

  return (
    <Button
      disabled={isDownloading}
      // onClick={handleDownloadReport}
      href={reportUrl}
    >
      {isDownloading ? 'Downloading...' : 'Download'}
    </Button>
  );
}

export default DownloadCSVButton;
