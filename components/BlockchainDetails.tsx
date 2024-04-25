import React from 'react';
import { Box, Paper, Typography } from '@mui/material';
import { EvidenceRecords } from '~/smart-contracts/typechain-types';
import List from '@mui/material/List';
import Loop from '~/components/lib/Loop';

interface BlockchainDataType extends EvidenceRecords.RecordStruct {
  issuer: string;
  link: string;
  txhash: string;
  block: number;
  joiningDate?: string;
}

const BlockchainDetails = ({
  reportData,
  blockchainData,
}: {
  reportData: any;
  blockchainData: BlockchainDataType;
}) => {
  const {
    uri = '',
    userId = '',
    userName = '',
    latitude = '',
    longitude = '',
    joiningDate = '',
    issuer = '',
    link = '',
    txhash = '',
    block = '',
  } = blockchainData;

  const fields = [
    { title: 'File', subText: uri },
    {
      title: 'File Hash',
      subText:
        '44d2c0f7a24037c2ff28754cee9580f5622eebad7e14a9811aaf05e75558745f249dd396599b26448687f0404a3355658256cdbfe3666',
    },
    { title: 'Transaction', subText: txhash },
    {
      title: 'Transaction Link',
      subText: (
        <a color='blue' href={link}>
          Link
        </a>
      ),
    },
    { title: 'Block#', subText: block },
    { title: 'Locking wallet', subText: issuer },
    { title: 'Geo Location', subText: `${latitude}, ${longitude}` },
    { title: 'User ID', subText: userId },
    { title: 'User Name', subText: userName },
    { title: 'Timestamp', subText: joiningDate },
  ];

  return (
    <BlockchainCard
      title='Blockchain Details'
      BioChipComponent={FieldDisplay}
      bioItems={fields}
      cardStyle={cardStyle}
      cardTitleBarStyle={cardTitleBarStyle}
    />
  );
};

const FieldDisplay = (props: any) => {
  return (
    <Box sx={{ paddingTop: '14px' }}>
      <Typography variant='subtitle2' sx={{ color: '#757575', paddingBottom: '4px' }}>
        {props?.title}
      </Typography>
      {props?.subText}
    </Box>
  );
};

function BlockchainCard(props: any) {
  return (
    <Paper sx={props.cardStyle} elevation={0}>
      <Typography variant={'h6'}>{props.title}</Typography>
      <List>
        <Loop mappable={props.bioItems} Component={props.BioChipComponent} />
      </List>
    </Paper>
  );
}

const cardTitleBarStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: '28px',
};
const cardStyle = {
  padding: '32px 48px',
  height: '800px',
};

export default BlockchainDetails;
