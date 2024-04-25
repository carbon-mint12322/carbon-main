import React, { MouseEvent, ElementType } from 'react';
import { Stack, Chip, SxProps, Theme } from '@mui/material';
import { toCamelCase } from './lib/toCamelCase';

const styles = {
  iconColor: {
    display: 'block',
  },
  chipColor: {
    borderRadius: '0.5rem !important',
  },
};

interface Item {
  name: string;
  id: number | string;
}

interface CropChipProps {
  params: Item[];
  handleChipClick?: (event: MouseEvent<HTMLElement>, id: number | string) => void;
  handleMoreChipClick?: (event: MouseEvent<HTMLElement>) => void;
  Icon: ElementType;
  sx?: SxProps;
  iconSx?: SxProps;
}

const CropChip = ({
  params,
  handleChipClick = () => null,
  handleMoreChipClick = () => null,
  Icon,
  sx = {},
  iconSx = {},
  ...props
}: CropChipProps) => {
  return (
    <Stack direction='row' columnGap={1}>
      {params ? (
        params?.slice(-1).map((item: Item, index: number) => (
          <Chip
            id={toCamelCase(
              item.name +
                (item.id.toString().length > 6 ? item.id.toString().slice(-6) : item.id.toString()),
              'Chip',
            )}
            icon={
              <Icon
                sx={{
                  fill: (theme: Theme) => theme.palette.primary.main,
                  ...styles.iconColor,
                  ...iconSx,
                }}
              />
            }
            key={index}
            label={item?.name}
            sx={{
              color: 'primary',
              ...styles.chipColor,
              ...sx,
            }}
            clickable
            onClick={(event: MouseEvent<HTMLElement>) => handleChipClick(event, item?.id)}
            {...props}
          />
        ))
      ) : (
        <></>
      )}
      {params && params.length > 1 ? (
        <Chip
          label={`+${params.length - 1}`}
          sx={{
            ...styles.chipColor,
            ...sx,
          }}
          clickable
          onClick={handleMoreChipClick}
          {...props}
        />
      ) : (
        <></>
      )}
    </Stack>
  );
};

export default CropChip;
