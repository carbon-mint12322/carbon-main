import FarmerDetailsBioCardContent from '~/container/farmer/details/FarmerDetailsBioCardContent';
import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import VerticalTabs from '~/components/lib/Navigation/VerticalTabs';
import DetailsCardWithMap from './DetailsCardWithMap';
import Dialog from '~/components/lib/Feedback/Dialog';
import SoilHistory from '~/components/common/SoilHistory';

export default function SoilInfo(props: any) {
  const [openModal, setOpenModal] = useState<string | null>(null);
  const SoilInfoEditor = dynamic(import('~/gen/data-views/soilInfo/soilInfoEditor.rtml'));
  const styles = {
    paper: {
      height: '100%',
      p: 1,
    },
  };

  const soilInfo = [
    {
      title: 'Soil test report',
      subText: props?.data?.soilInfo?.soilTestReport ? 'Soil test report evidence' : '',
      url: props?.data?.soilInfo?.soilTestReport,
    },
    {
      title: 'Lab certified by NABL',
      subText: props?.data?.soilInfo?.labCertifiedByNabl,
    },
    {
      title: 'NABL certification evidence',
      subTest: props?.data?.soilInfo?.nablCertificationEvidence,
    },
    {
      title: 'Soil texture (soil type)',
      subText: props?.data?.soilInfo?.soilTexture,
    },
    {
      title: 'Soil color',
      subText: props?.data?.soilInfo?.soilColor,
    },
    {
      title: 'Depth of surface soil (cm)',
      subText: props?.data?.soilInfo?.depthOfSurfaceSoil,
    },
    {
      title: 'Nitrogen (N)',
      subText: props?.data?.soilInfo?.n,
    },
    {
      title: 'Phosphorus (P)',
      subText: props?.data?.soilInfo?.p,
    },
    {
      title: 'Potassium (K)',
      subText: props?.data?.soilInfo?.k,
    },
    {
      title: 'Calcium (Ca)',
      subText: props?.data?.soilInfo?.ca,
    },
    {
      title: 'Magnesium (Mg)',
      subText: props?.data?.soilInfo?.mg,
    },
    {
      title: 'Sulfur (s)',
      subText: props?.data?.soilInfo?.s,
    },
    {
      title: 'Other micronutrients',
      subText: props?.data?.soilInfo?.otherMicroNutrients,
    },
    {
      title: 'pH',
      subText: props?.data?.soilInfo?.ph,
    },
    {
      title: 'Electrical conductivity (Ec)',
      subText: props?.data?.soilInfo?.ec,
    },
    {
      title: 'Soil Organic carbon (%)',
      subText: props?.data?.soilInfo?.organicCarbon,
    },
    {
      title: 'Soil heavy metals contamination report',
      subText: props?.data?.soilInfo?.soilHeavyMetalsContamincationReport,
      url: props?.data?.soilInfo?.soilHeavyMetalsContamincationReport,
    },
    {
      title: 'Soil pesticide & herbicide residues report',
      subText: props?.data?.soilInfo?.soilPesticideHerbcideResiduesReport,
      url: props?.data?.soilInfo?.soilPesticideHerbcideResiduesReport,
    },
    {
      title: 'Soil beneficial and harmful microbial mass report',
      subText: props?.data?.soilInfo?.soilBenficialHarmfulMicrobialMassReport,
      url: props?.data?.soilInfo?.soilBenficialHarmfulMicrobialMassReport,
    },
  ];

  const componentData = [
    {
      title: 'Land Parcel Soil Information',
      label: 'Land Parcel Soil Information',
      data: soilInfo,
      map: props?.data?.map,
      onClick: () => setOpenModal('landParcelSoilInfo'),
    },
    {
      label: 'Soil History',
      count: 1,
      component: (
        <SoilHistory
          data={props?.data.events.filter((item: any) => item.name === 'LandParcelSoilTestEvent')}
        />
      ),
    },
  ];

  const handleClose = () => {
    setOpenModal(null);
  };

  const handleSoilInfoSubmit = async (formData: any) => {
    props.handleFormSubmit(formData);
    setOpenModal(null);
  };

  return (
    <>
      <VerticalTabs
        labels={componentData.map((item: any, index: any) => {
          return { label: item.label };
        })}
        panels={componentData.map((item: any, index: any) => {
          return index == 0 ? (
            <DetailsCardWithMap
              title={item.title}
              key={index}
              items={item.data}
              map={item.map}
              handleMainBtnClick={item.onClick}
              showMainBtn={false}
            />
          ) : (
            item.component
          );
        })}
      />
    </>
  );
}
