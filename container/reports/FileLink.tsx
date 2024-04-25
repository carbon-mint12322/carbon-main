import React from 'react';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import { getFileUrl } from '~/frontendlib/util';

interface FileLinkProps {
  fileName: string;
  fileUrl: string;
}

const FileLink = ({ fileName, fileUrl }: FileLinkProps) => {
  const domain = window.location.hostname ? window.location.hostname : 'localhost';

  const url = getFileUrl(fileUrl, domain);

  return (
    <div>
      <Typography variant='body1'>
        <Link href={url} target='_blank' rel='noopener noreferrer'>
          {fileName}
        </Link>
      </Typography>
    </div>
  );
};

export default FileLink;
