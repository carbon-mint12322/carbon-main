import React, { MouseEvent } from 'react';
import { useRouter } from 'next/router';

import LandParcelsCard from './LandParcelsCard';
import landParcelImage from '../../../../public/assets/images/landParcelImage.png';
import { LandParcel } from '.';
import { useOperator } from '~/contexts/OperatorContext';

interface LandParcelsCardContentProps {
  landParcelData: LandParcel;
}

const LandParcelsCardContent = ({ landParcelData }: LandParcelsCardContentProps) => {
  const router = useRouter();
  const { changeRoute } = useOperator();
  const landParcelType = landParcelData?.own === true ? 'Own' : 'Leased';

  const landParcelTypeColor = landParcelType === 'Leased' ? '#007DBB' : '#2B9348';

  const onCropChipClick = (e: MouseEvent<HTMLElement>, id: string | number) =>
    changeRoute(`/crop/${id}`);

  const onCardClick = () => changeRoute(`/landparcel/${landParcelData?.id}`);

  return (
    <LandParcelsCard
      image={landParcelImage.src}
      landParcelData={landParcelData}
      landParcelTypeColor={landParcelTypeColor}
      landParcelType={landParcelType}
      onCropChipClick={onCropChipClick}
      onCardClick={onCardClick}
    />
  );
};

export default LandParcelsCardContent;
