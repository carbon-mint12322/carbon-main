// Generated code (tools/templates/pages/model-page-endpoint.tsx.mustache)
// export { default } from '~/gen/pages/farmerDetails/ui'

import React, { useState } from 'react';
import axios from 'axios';
import { useAlert } from '~/contexts/AlertContext';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { SxProps } from '@mui/material';
import PoultryPopEvent from '~/container/poultrypop/details/poultrypopevent';
import Tabs from '~/components/lib/Navigation/Tabs';
import Events from '~/container/crop/details/Events';
import TitleBarGeneric from '~/components/TitleBarGeneric';
import { PoultryPOP, PageConfig } from '~/frontendlib/dataModel';
import useFetch from 'hooks/useFetch';
import { useOperator } from '~/contexts/OperatorContext';
import CircularLoader from '~/components/common/CircularLoader';
import landParcelIcon from '/public/assets/images/landParcelIcon.svg';
import TabSubNav from '~/container/TabSubNav';
import Dialog from '~/components/lib/Feedback/Dialog';
import EntityHistoryCard from '~/components/common/EntityHistoryCard';
import * as XLSX from 'xlsx';

export { default as getServerSideProps } from '~/utils/ggsp';

interface PoultryPOPDetailsProps {
  sx: SxProps;
  pageConfig: PageConfig;
  data: PoultryPOP;
}

const SupportingDocumentsEditor = dynamic(
  import('~/gen/data-views/supportingDocuments/supportingDocumentsEditor.rtml'),
);

const PoultryPop_basicinfoEditor = dynamic(
  import('~/gen/data-views/poultrypop_basicinfo/poultrypop_basicinfoEditor.rtml'),
);
const ControlPointEditor = dynamic(
  import('~/gen/data-views/add_controlpoint/add_controlpointEditor.rtml'),
);

export default function PoultryPOPDetails(props: PoultryPOPDetailsProps) {
  const [openModal, setOpenModal] = useState<string | null>(null);
  const router = useRouter();
  const { openToast } = useAlert();
  const [titleBarData, setTitleBarData] = useState<any>({
    isTitleBarPresent: true,
    isTitlePresent: true,
    isSubTitlePresent: true,
    mainBtnTitle: 'Download POP',
    isMainBtnPresent: true,
    isAvatarIconPresent: false,
    titleIcon: landParcelIcon.src,
    isSearchBarPresent: false,
  });
  const { operator, getAPIPrefix } = useOperator();

  const API_URL = `${getAPIPrefix()}/poultrypop/${router.query.id}`;

  const { isLoading: loading, data: poultrypopData, reFetch } = useFetch<PoultryPOP>(API_URL);

  const data = poultrypopData;

  const handleClose = () => {
    setOpenModal(null);
  };

  const s2ab = (s: any) => {
    const buf = new ArrayBuffer(s.length);
    const view = new Uint8Array(buf);
    for (let i = 0; i < s.length; i++) {
      view[i] = s.charCodeAt(i) & 0xff;
    }
    return buf;
  };

  const downloadPOP = () => {
    const title = ['CarbonMint POP Template'];
    const controlPoint = ['Control Points:'];
    const generalInfo = [
      { label: 'POP Name', value: data?.name },
      { label: 'Poultry type', value: data?.poultryPopType?.poultryType },
      { label: 'Variety Name', value: data?.poultryPopType?.variety },
      { label: 'Poultry batch duration in days', value: data?.poultryPopType?.durationDays },
      { label: 'Region', value: data?.poultryPopType?.region },
      { label: 'Scheme', value: data?.poultryPopType?.scheme },
    ];
    const generalInfoRows = generalInfo.map((info) => [info.label, info.value]);
    const cpHeader = [
      'S.No',
      'Event/Activity Name',
      'Event Type',
      'Period Description',
      'Start Day',
      'End Day',
      'Technical Advice',
      'Critical Control Point',
      'Repeated',
      'Frequency(Days)',
      'Ends (Days)',
    ];
    const titleColspan = 14;

    // Calculate the range for the merged title cell
    const titleRange = { s: { r: 0, c: 0 }, e: { r: 0, c: titleColspan } };

    const rows = [
      title,
      ...generalInfoRows,
      controlPoint,
      cpHeader,
      ...(data?.controlPoints ?? []).map((cp, key) => [
        key + 1,
        cp.name,
        cp.activityType,
        cp.period,
        cp.days?.start,
        cp.days?.end,
        cp.technicalAdvice,
        cp.ccp === true ? 'Yes' : 'No',
        cp.repeated === true ? 'Yes' : 'No',
        cp.frequency ?? 0,
        cp.ends ?? 0,
      ]),
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(rows);

    // Merge the title cell
    worksheet['!merges'] = [titleRange];
    const workbook = XLSX.utils.book_new();
    const titleCell = XLSX.utils.encode_cell({ r: titleRange.s.r, c: titleRange.s.c });
    worksheet[titleCell].s = { alignment: { wrapText: true } };
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Control Points');

    const blob = new Blob([s2ab(XLSX.write(workbook, { bookType: 'xlsx', type: 'binary' }))], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });

    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = data?.name + '.xlsx';
    a.click();

    URL.revokeObjectURL(url);
  };

  React.useEffect(() => {
    setTitleBarData({
      ...titleBarData,
      title: data?.name,
      subTitle:
        data?.poultryPopType.poultryType +
        ' • ' +
        (data?.poultryPopType?.scheme ? data?.poultryPopType?.scheme : ''),
    });
  }, [data]);

  const labelList = [
    {
      label: `Info`,
    },
    {
      label: 'Events',
    },
    {
      label: 'History',
    },
  ];

  const basicInfo = [
    {
      title: 'Name',
      subText: data?.name,
    },
    { title: 'Crop', subText: data?.poultryPopType?.poultryType },
    { title: 'Crop Variety', subText: data?.poultryPopType?.variety },
    {
      title: 'Region',
      subText: data?.poultryPopType.region,
    },
    {
      title: 'Poultry Duration',
      subText:
        typeof data?.poultryPopType.durationDays === 'number'
          ? data.poultryPopType.durationDays.toString()
          : data?.poultryPopType.durationDays,
    },
  ];

  const supportingDocuments = data?.documents?.map((doc: any) => ({
    title: doc.documentType,
    subText: doc.documentDetails,
    url: doc.documentEvidence,
  }));

  const componentData = [
    {
      label: 'Basic Info',
      data: basicInfo,
      title: 'Basic Info',
      onClick: () => setOpenModal('basicInfo'),
    },
    {
      label: 'Supporting Documents',
      data: supportingDocuments,
      title: 'Supporting Documents',
      onClick: () => setOpenModal('supportingDocuments'),
    },
  ];

  const { getApiUrl } = useOperator();
  const handleFormSubmit = async (formData: any) => {
    try {
      const apiUrl = getApiUrl(`/poultrypop/${router.query.id}`);
      delete formData._id;
      await axios
        .post(apiUrl, {
          ...formData,
        })
        .then((res) => {
          openToast('success', 'PoultryPOP details updated');
          setOpenModal(null);
        });
      reFetch(API_URL);
    } catch (error: any) {
      openToast('error', 'Failed to update PoultryPOP details');
      console.log(error);
    }
  };

  const handleAddControlPointFormSubmit = async (formData: any) => {
    try {
      const apiUrl = getApiUrl(`/poultrypop/${router.query.id}`);

      const newData = { ...data };

      const newControlPoints = newData?.controlPoints
        ? [...newData.controlPoints]
        : [];
      newControlPoints.push(formData.addCP);
      if (newData?.controlPoints) {
        newData.controlPoints = newControlPoints;
      }

      //console.log('Updated data', newData);
      delete newData._id;

      await axios
        .post(apiUrl, {
          ...newData,
        })
        .then((res) => {
          openToast('success', 'PoultryPOP details updated');
          setOpenModal(null);
        });
      reFetch(API_URL);
    } catch (error: any) {
      openToast('error', 'Failed to update PoultryPOP details');
      console.log(error);
    }
  };

  const componentList = [
    {
      component: TabSubNav,
      props: { data: componentData },
    },
    {
      component: PoultryPopEvent,
      props: {
        data: data,
        onClick: () => setOpenModal('controlPoint'),
      },
    },
    {
      component: EntityHistoryCard,
      props: {
        data: {
          history: data?.history,
          collective: operator,
        },
      },
    },
  ];

  const renderModal = () => {
    switch (openModal) {
      case 'basicInfo':
        return (
          <Dialog open={Boolean(openModal)} onClose={handleClose} fullWidth maxWidth={'md'}>
            <PoultryPop_basicinfoEditor
              formData={{
                data: data,
              }}
              onSubmit={handleFormSubmit}
            />
          </Dialog>
        );

      case 'supportingDocuments':
        return (
          <Dialog open={Boolean(openModal)} onClose={handleClose} fullWidth maxWidth={'md'}>
            <SupportingDocumentsEditor
              formData={{
                data: {
                  documents: data?.documents,
                },
              }}
              onSubmit={handleFormSubmit}
              onCancelBtnClick={handleClose}
            />
          </Dialog>
        );

      case 'controlPoint':
        return (
          <Dialog open={Boolean(openModal)} onClose={handleClose} fullWidth maxWidth={'md'}>
            <ControlPointEditor
              formData={{
                data: { data },
              }}
              onSubmit={handleAddControlPointFormSubmit}
              onCancelBtnClick={handleClose}
            />
          </Dialog>
        );

      default:
        return null;
    }
  };

  return (
    <CircularLoader value={loading}>
      <TitleBarGeneric
        titleBarData={titleBarData}
        handleMainBtnClick={downloadPOP}
      />
      <Tabs labelList={labelList} componentList={componentList} />
      {renderModal()}{' '}
    </CircularLoader>
  );
}
