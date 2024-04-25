// Generated code (tools/templates/pages/model-page-endpoint.tsx.mustache)
// export { default } from '~/gen/pages/farmerDetails/ui'

import React, { useState } from 'react';
import axios from 'axios';
import { useAlert } from '~/contexts/AlertContext';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { SxProps } from '@mui/material';
import PopEvent from '~/container/pop/details/popevent';
import Tabs from '~/components/lib/Navigation/Tabs';
import Events from '~/container/crop/details/Events';
import TitleBarGeneric from '~/components/TitleBarGeneric';
import { initialTitleBarContextValues } from '~/contexts/TitleBar/TitleBarContext';
import { POP, PageConfig } from '~/frontendlib/dataModel';
import useFetch from 'hooks/useFetch';
import { useOperator } from '~/contexts/OperatorContext';
import CircularLoader from '~/components/common/CircularLoader';
import landParcelIcon from '/public/assets/images/landParcelIcon.svg';
import TabSubNav from '~/container/TabSubNav';
import Dialog from '~/components/lib/Feedback/Dialog';
import EntityHistoryCard from '~/components/common/EntityHistoryCard';
import * as XLSX from 'xlsx';
import { transformErrors } from '~/frontendlib/transformErrors/controlPoint';

export { default as getServerSideProps } from '~/utils/ggsp';

interface POPDetailsProps {
  sx: SxProps;
  pageConfig: PageConfig;
  data: POP;
}

const SupportingDocumentsEditor = dynamic(
  import('~/gen/data-views/supportingDocuments/supportingDocumentsEditor.rtml'),
);

const Pop_basicinfoEditor = dynamic(
  import('~/gen/data-views/pop_basicinfo/pop_basicinfoEditor.rtml'),
);
const ControlPointEditor = dynamic(
  import('~/gen/data-views/add_controlpoint/add_controlpointEditor.rtml'),
);

export default function POPDetails(props: POPDetailsProps) {
  const [openModal, setOpenModal] = useState<string | null>(null);
  const router = useRouter();
  const { openToast } = useAlert();
  const { operator, getAPIPrefix } = useOperator();
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

  const API_URL = `${getAPIPrefix()}/pop/${router.query.id}`;

  const { isLoading: loading, data: popData, reFetch } = useFetch<POP>(API_URL);

  const callOnDetailsChange = () => reFetch(API_URL);

  const data = popData;

  const handleClose = () => {
    setOpenModal(null);
  };

  const downloadPOP = () => {
    const title = ['CarbonMint POP Template'];
    const controlPoint = ['Control Points:'];
    const generalInfo = [
      { label: 'POP Name', value: data?.name },
      { label: 'Description', value: data?.description },
      { label: 'Recommended By', value: data?.recommendedBy },
      { label: 'Crop Name', value: data?.cropPopType?.name },
      { label: 'Variety Name', value: data?.cropPopType?.variety },
      { label: 'Season', value: data?.cropPopType?.season },
      { label: 'Duration type', value: data?.cropPopType?.durationType },
      { label: 'Crop duration in days', value: data?.cropPopType?.durationDays },
      { label: 'Region', value: data?.cropPopType?.region },
      { label: 'Scheme', value: data?.cropPopType?.scheme },
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

  const s2ab = (s: any) => {
    const buf = new ArrayBuffer(s.length);
    const view = new Uint8Array(buf);
    for (let i = 0; i < s.length; i++) {
      view[i] = s.charCodeAt(i) & 0xff;
    }
    return buf;
  };

  React.useEffect(() => {
    setTitleBarData({
      ...titleBarData,
      title: data?.name,
      subTitle:
        data?.cropPopType.name +
        ' • ' +
        (data?.cropPopType?.scheme ? data?.cropPopType?.scheme : ''),
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
    { title: 'Crop', subText: data?.cropPopType?.name },
    { title: 'Crop Variety', subText: data?.cropPopType?.variety },
    {
      title: 'Season',
      subText: data?.cropPopType?.season,
    },
    {
      title: 'Region',
      subText: data?.cropPopType.region,
    },
    {
      title: 'Crop Duration Type',
      subText: data?.cropPopType.durationType,
    },
    {
      title: 'Crop Duration (Days)',
      subText:
        typeof data?.cropPopType.durationDays === 'number'
          ? data.cropPopType.durationDays.toString()
          : data?.cropPopType.durationDays,
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
      const apiUrl = getApiUrl(`/pop/${router.query.id}`);
      delete formData._id;
      await axios
        .post(apiUrl, {
          ...formData,
        })
        .then((res) => {
          openToast('success', 'POP details updated');
          setOpenModal(null);
        });
      reFetch(API_URL);
    } catch (error: any) {
      openToast('error', 'Failed to update POP details');
      console.log(error);
    }
  };

  const handleAddControlPointFormSubmit = async (formData: any) => {
    try {
      const apiUrl = getApiUrl(`/pop/${router.query.id}/controlpoint`);

      await axios.post(apiUrl, formData).then((res) => {
        openToast('success', 'POP details updated');
        setOpenModal(null);
      });
      reFetch(API_URL);
    } catch (error: any) {
      openToast('error', 'Failed to update POP details');
      console.log(error);
    }
  };

  const componentList = [
    {
      component: TabSubNav,
      props: { data: componentData },
    },
    {
      component: PopEvent,
      props: {
        data: data,
        onClick: () => setOpenModal('controlPoint'),
        reFetch: callOnDetailsChange,
        transformErrors : transformErrors
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
            <Pop_basicinfoEditor
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
              transformErrors={transformErrors}
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
