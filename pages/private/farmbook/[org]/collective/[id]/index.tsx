// Generated code (tools/templates/pages/model-page-endpoint.tsx.mustache)
// export { default } from '~/gen/pages/farmerDetails/ui'
import React, { useState, useMemo, useRef } from 'react';
import { useRouter } from 'next/router';
import { SxProps, useTheme, Grid } from '@mui/material';
import dynamic from 'next/dynamic';
import Tabs from '~/components/lib/Navigation/Tabs';
import Drawer from '@mui/material/Drawer';
import styles from '~/styles/theme/brands/styles';
import TitleBarGeneric from '~/components/TitleBarGeneric';
import ValidationWorkflowView from '~/components/workflow/ValidationWorkflowView';
import { EventPlanModalHandler } from '~/container/crop/plan/EventPlan';
import { Collective, PageConfig } from '~/frontendlib/dataModel';
import useFetch from 'hooks/useFetch';
import { CalendarBlank, Person } from '~/components/Icons';
import { useOperator } from '~/contexts/OperatorContext';
import ScheduledEvents from '~/components/lib/ScheduledEvents';


import CircularLoader from '~/components/common/CircularLoader';
import landParcelIcon from '/public/assets/images/landParcelIcon.svg';
import TabSubNav from '~/container/TabSubNav';
import Dialog from '~/components/lib/Feedback/Dialog';
import axios from 'axios';
import { useAlert } from '~/contexts/AlertContext';
import MasterCropDetails from '~/container/collective/details/MasterCropDetails';
import CollectiveGroupDetails from '~/container/collective/details/CollectiveGroupDetails';
import CollectiveSubGroupDetails from '~/container/collective/details/CollectiveSubGroupDetails';
import CollectiveDocumentDetails from '~/container/collective/details/CollectiveDocumentDetails';
import CollectiveDisputeDetails from '~/container/collective/details/CollectiveDisputeDetails';
import CollectiveComplaintDetails from '~/container/collective/details/CollectiveComplaintDetails';
import CollectiveSanctionDetails from '~/container/collective/details/CollectiveSanctionDetails';
import CollectiveInspectionDetails from '~/container/collective/details/CollectiveInspectionDetails';
import CollectiveScopeCertDetails from '~/container/collective/details/CollectiveScopeCertDetails';
import CollectiveValidationDetails from '~/container/collective/details/CollectiveValidationDetails';
import CollectiveSchemeDetails from '~/container/collective/details/CollectiveSchemeDetails';
import CollectiveEvaluationDetails from '~/container/collective/details/CollectiveEvaluationDetails';
import CollectiveNonConfirmityDetails from '~/container/collective/details/CollectiveNonConfirmityDetails';
import CollectiveTransactionCertDetails from '~/container/collective/details/CollectiveTransactionCertDetails';
import CollectiveNGMOTestRecordDetails from '~/container/collective/details/CollectiveNGMOTestRecordDetails';
import CollectiveInputLogDetails from '~/container/collective/details/CollectiveInputLogDetails';
import CollectiveInputPermissionDetails from '~/container/collective/details/CollectiveInputPermissionDetails';
import CollectiveSamplingDetails from '~/container/collective/details/CollectiveSamplingDetails';

import OrganicSystemPlanDetails from '~/container/collective/details/OrganicSystemPlanDetails';
import HarvestUpdateDetails from '~/container/collective/details/HarvestUpdateDetails';
import AggregationPlanDetails from '~/container/collective/details/AggregationPlanDetails';
import FarmTractorDetails from '~/container/landparcel/details/FarmMachineries/FarmTractorDetails';
import FarmMachineryDetails from '~/container/landparcel/details/FarmMachineries/FarmMachineryDetails';
import FarmToolsDetails from '~/container/landparcel/details/FarmMachineries/FarmToolsDetails';
import FarmEquipmentsDetails from '~/container/landparcel/details/FarmMachineries/FarmEquipmentsDetails';
import EntityHistoryCard from '~/components/common/EntityHistoryCard';
import getScheduledEventsData from "~/entitylib/functions/getData/getScheduledEventsData";
import Schemes from '~/components/lib/Schemes';
import EntityUsersList from '~/components/lib/EntityUsersList';



export { default as getServerSideProps } from '~/utils/ggsp';

interface CollectiveDetailsProps {
  sx: SxProps;
  pageConfig: PageConfig;
  data: Collective;
}

const CollectiveUserEditor = dynamic(import('~/gen/data-views/collectiveUser/collectiveUserEditor.rtml'));


const CollectiveBasicInfoEditor = dynamic(
  import('~/gen/data-views/collective_basicInfo/collective_basicInfoEditor.rtml'),
);
const CollectiveSchemesEditor = dynamic(
  import('~/gen/data-views/collective_schemes/collective_schemesEditor.rtml'),
);

const CollectiveMandatorEditor = dynamic(
  import('~/gen/data-views/collective_mandator/collective_mandatorEditor.rtml'),
);

const CollectiveFPODetailsEditor = dynamic(
  import('~/gen/data-views/collective_fpoDetails/collective_fpoDetailsEditor.rtml'),
);

const CollectiveFPCDetailsEditor = dynamic(
  import('~/gen/data-views/collective_fpcDetails/collective_fpcDetailsEditor.rtml'),
);

const SupportingDocumentsEditor = dynamic(
  import('~/gen/data-views/supportingDocuments/supportingDocumentsEditor.rtml'),
);

const Add_mastercropEditor = dynamic(
  import('~/gen/data-views/add_mastercrop/add_mastercropEditor.rtml'),
);

const FarmTractorsEditor = dynamic(import('~/gen/data-views/farmTractors/farmTractorsEditor.rtml'));

const FarmMachineriesEditor = dynamic(
  import('~/gen/data-views/farmMachineries/farmMachineriesEditor.rtml'),
);
const FarmToolsEditor = dynamic(import('~/gen/data-views/farmTools/farmToolsEditor.rtml'));
const FarmEquipmentsEditor = dynamic(
  import('~/gen/data-views/farmEquipments/farmEquipmentsEditor.rtml'),
);

export default function CollectiveDetails(props: CollectiveDetailsProps) {
  const [openModal, setOpenModal] = useState<string | null>(null);
  const router = useRouter();
  const theme = useTheme();
  const parentRef = useRef(null);
  const { changeRoute, getAPIPrefix, getApiUrl } = useOperator();
  const [openVerifyCollectiveModal, setOpenVerifyCollectiveModal] = useState<boolean>(false);
  const collectiveId = router?.query?.id as string;
  const { openToast } = useAlert();
  const API_URL = `${getAPIPrefix()}/collective/${router.query.id}`;
  const modelName = `collective`
  const { isLoading: loading, data: collectiveData, reFetch } = useFetch<Collective>(API_URL);

  const data = collectiveData;
  // Updating plan id on crop data change
  const [currentPlanId, setCurrentPlanId] = useState<string | undefined>();
  const [titleBarData, setTitleBarData] = useState<any>({
    isTitleBarPresent: true,
    isTitlePresent: true,
    isSubTitlePresent: true,
    isMainBtnPresent: false,
    mainBtnTitle: 'Add Event',
    subBtnColor: 'secondary',
    isTitleIconPresent: true,
    isTitleBtnPresent: true,
    isSubBtnPresent: true,
    isAvatarIconPresent: false,
    titleIcon: landParcelIcon.src,
    isSearchBarPresent: false,
    subBtnDisabled: false,
  });

  function fetchData() {
    return reFetch(API_URL);
  }

  React.useEffect(() => {
    // Find the active plan, if not exists then return the first plan in array
    const getActivePlanId = (collectiveData: Collective | undefined) => {
      let plan = null,
        err = '';

      try {
        if (!collectiveData) {
          throw new Error('Collective Data not available');
        }

        const activePlan = collectiveData?.plan.find((item: any) => {
          return item.status.toLowerCase() === 'active';
        });

        plan = activePlan || collectiveData.plan[0];

        if (plan && plan._id) {
          return plan._id;
        }

        throw new Error('Plan not found.');
      } catch (e) {
        if (e instanceof Error) {
          err = e.message;
          console.error(err);
        }
      }
    };

    setCurrentPlanId(getActivePlanId(collectiveData));

    // Call the filtering function once when the component mounts
    //const initialFilteredUsers = getFilteredUsersByRole(data);
    //setFilteredUsers(initialFilteredUsers);

  }, [collectiveData]);

  const [planEventModalToggle, setPlanEventModalToggle] = useState(false);

  // Closes Event plan model
  const hideEventPlanModal = () => {
    setPlanEventModalToggle(false);
  };

  const handleClose = () => {
    setOpenModal(null);
    setOpenVerifyCollectiveModal(false);
  };

  const onPlanEventCreateOrUpdateCallback = () => {
    reFetch(API_URL);
  };

  const statusStep: {
    [key: string]: {
      buttonLabel: string;
      step: string;
    };
  } = {
    Draft: {
      buttonLabel: 'Submit for Review',
      step: 'basicinfo',
    },
    'Under Review': {
      buttonLabel: 'Review & Approve',
      step: 'verification',
    },
    'Under Validation': {
      buttonLabel: 'Validate',
      step: 'validation',
    },
    'Review Failed': {
      buttonLabel: 'Submit for Review',
      step: 'basicinfo',
    },
    'Validation Failed': {
      buttonLabel: 'Submit for Review',
      step: 'basicinfo',
    },
    Approved: {
      buttonLabel: 'Approved',
      step: 'basicinfo',
    },
  };

  React.useEffect(() => {
    setTitleBarData({
      ...titleBarData,
      title: data?.name,
      subTitle: data?.phone + ' • ' + (data?.address?.village ? data?.address?.village : ''),
      titleBtnText: data?.status || 'Draft',
      titleButtonColor:
        data?.status == 'Approved' ? 'success' : data?.status == 'Declined' ? 'error' : 'warning',
      subBtnTitle:
        data?.status == 'Approved'
          ? 'Approved'
          : data?.status
            ? statusStep[data?.status]?.buttonLabel
            : 'Verify Operator',
    });
  }, [data]);

  const category = data?.category;

  const basicInfo = [
    {
      title: 'Name',
      subText: data?.name,
    },
    { title: 'Type', subText: data?.category },
    {
      title: 'Email',
      subText: data?.email,
    },
    {
      title: 'Phone',
      subText: data?.phone,
    },
    {
      title: 'Point of Contact',
      subText: data?.poc,
    },
    {
      title: 'Address',
      subText: data?.address?.village
        ? data?.address?.village
        : '' + ' ' + data?.address?.state
          ? data?.address?.state
          : '' + ' ' + data?.address?.pincode
            ? data?.address?.pincode
            : '',
    },
  ];

  const mandatorDetails = [
    {
      title: 'Name',
      subText: data?.mandator?.operatedBy,
    },
    { title: 'Contact Person', subText: data?.mandator?.mandatorPoc },
    {
      title: 'Contact Phone',
      subText: data?.mandator?.mandatorPhone,
    },
    {
      title: 'Imports and Exports Licence Number',
      subText: data?.mandator?.iecNumber,
    },
    {
      title: 'Imports and Exports Licence Document',
      subText: data?.mandator?.iecDocumentFile,
      url: data?.mandator?.iecDocumentFile,
    },
    {
      title: 'GST Number',
      subText: data?.mandator?.gstNumber,
    },
    {
      title: 'GST Document',
      subText: data?.mandator?.gstDocumentFile,
      url: data?.mandator?.gstDocumentFile,
    },
    {
      title: 'PAM Number',
      subText: data?.mandator?.panNumber,
    },
    {
      title: 'PAN Document',
      subText: data?.mandator?.panDocumentFile,
      url: data?.mandator?.panDocumentFile,
    },
    {
      title: 'Bank Name',
      subText: data?.mandator?.registeredBankName,
    },
    {
      title: 'Bank Account Number',
      subText: data?.mandator?.registeredBankACNumber,
    },
  ];

  const fpoDetails = [
    {
      title: 'FPO Registration ID',
      subText: data?.fpoDetails?.fpRegistrationId,
    },
    {
      title: 'FPO Registration Document',
      subText: data?.fpoDetails?.fpRegistrationDocumentFile,
      url: data?.fpoDetails?.fpRegistrationDocumentFile,
    },
    {
      title: 'GST Number',
      subText: data?.fpoDetails?.gstNumber,
    },
    {
      title: 'GST Number Document',
      subText: data?.fpoDetails?.gstDocumentFile,
      url: data?.fpoDetails?.gstDocumentFile,
    },
    {
      title: 'PAN Number',
      subText: data?.fpoDetails?.panNumber,
    },
    {
      title: 'PAN Number Document',
      subText: data?.fpoDetails?.panDocumentFile,
      url: data?.fpoDetails?.panDocumentFile,
    },

    {
      title: 'Exports Licence Number',
      subText: data?.fpoDetails?.ecNumber,
    },
    {
      title: 'Exports Licence Document',
      subText: data?.fpoDetails?.ecDocumentFile,
      url: data?.fpoDetails?.ecDocumentFile,
    },
    {
      title: 'Bank Name',
      subText: data?.fpoDetails?.registeredBankName,
    },
    {
      title: 'Bank Account Number',
      subText: data?.fpoDetails?.registeredBankName,
    },
    {
      title: 'MSME Registration ID',
      subText: data?.fpoDetails?.msmeRegistrationId,
    },
    {
      title: 'MSME Registration Document',
      subText: data?.fpoDetails?.msmeRegistrationDocumentFile,
      url: data?.fpoDetails?.msmeRegistrationDocumentFile,
    },
    {
      title: 'Business Activity',
      subText: data?.fpoDetails?.businessActivity,
    },
    {
      title: 'Authorised Share Capital',
      subText: data?.fpoDetails?.shareCapital,
    },
    {
      title: 'Paid up Share Capital',
      subText: data?.fpoDetails?.paidCapital,
    },
    {
      title: 'Turnover since last 2 years',
      subText: data?.fpoDetails?.turnover,
    },
    {
      title: 'Marketplace',
      subText: data?.fpoDetails?.markerPlace,
    },
    {
      title: 'No of Farmers',
      subText: data?.fpoDetails?.noOfFarmers,
    },

    {
      title: 'Crops Covered',
      subText: data?.fpoDetails?.cropsCovered,
    },
  ];

  const fpcDetails = [
    {
      title: 'FPC Registration ID',
      subText: data?.fpcDetails?.fpRegistrationId,
    },
    {
      title: 'FPC Registration Document',
      subText: data?.fpcDetails?.fpRegistrationDocumentFile,
      url: data?.fpcDetails?.fpRegistrationDocumentFile,
    },
    {
      title: 'GST Number',
      subText: data?.fpcDetails?.gstNumber,
    },
    {
      title: 'GST Number Document',
      subText: data?.fpcDetails?.gstDocumentFile,
      url: data?.fpcDetails?.gstDocumentFile,
    },
    {
      title: 'PAN Number',
      subText: data?.fpcDetails?.panNumber,
    },
    {
      title: 'PAN Number Document',
      subText: data?.fpcDetails?.panDocumentFile,
      url: data?.fpcDetails?.panDocumentFile,
    },

    {
      title: 'Exports Licence Number',
      subText: data?.fpcDetails?.ecNumber,
    },
    {
      title: 'Exports Licence Document',
      subText: data?.fpcDetails?.ecDocumentFile,
      url: data?.fpcDetails?.ecDocumentFile,
    },
    {
      title: 'Bank Name',
      subText: data?.fpcDetails?.registeredBankName,
    },
    {
      title: 'Bank Account Number',
      subText: data?.fpcDetails?.registeredBankName,
    },
    {
      title: 'MSME Registration ID',
      subText: data?.fpcDetails?.msmeRegistrationId,
    },
    {
      title: 'MSME Registration Document',
      subText: data?.fpcDetails?.msmeRegistrationDocumentFile,
      url: data?.fpcDetails?.msmeRegistrationDocumentFile,
    },
    {
      title: 'Business Activity',
      subText: data?.fpcDetails?.businessActivity,
    },
    {
      title: 'Authorised Share Capital',
      subText: data?.fpcDetails?.shareCapital,
    },
    {
      title: 'Paid up Share Capital',
      subText: data?.fpcDetails?.paidCapital,
    },
    {
      title: 'Turnover since last 2 years',
      subText: data?.fpcDetails?.turnover,
    },
    {
      title: 'Marketplace',
      subText: data?.fpcDetails?.markerPlace,
    },
    {
      title: 'No of Farmers',
      subText: data?.fpcDetails?.noOfFarmers,
    },

    {
      title: 'Crops Covered',
      subText: data?.fpcDetails?.cropsCovered,
    },
  ];

  function getUsersByRole(data: any, roleName: string): string {
    const users = data?.users?.filter((user: any) =>
      user?.filteredRolesArray.some((role: { v: string }) => role.v.includes(roleName)),
    );

    const userNames = users?.map(
      (user: any) =>
        `${user.personalDetails?.firstName || ''} ${user.personalDetails?.lastName || ''
        } ( Phone: ${user.personalDetails?.primaryPhone || ''})`,
    );

    return userNames?.join('\n') || '';
  }

  const fieldOfficers = getUsersByRole(data, 'FIELD_OFFICER');
  const managers = getUsersByRole(data, 'MANAGER');
  const villageCoordinators = getUsersByRole(data, 'VILLAGE_COORDINATOR');
  const internalInspectors = getUsersByRole(data, 'INTERNAL_INSPECTOR');
  const ceos = getUsersByRole(data, 'CEO');
  const directors = getUsersByRole(data, 'DIRECTOR');
  const marketingOfficers = getUsersByRole(data, 'MARKETING_OFFICER');
  const accountsOfficers = getUsersByRole(data, 'ACCOUNTS_OFFICER');
  const productionOfficers = getUsersByRole(data, 'PRODUCTION_OFFICER');
  const storageOfficers = getUsersByRole(data, 'STORAGE_OFFICER');

  const icsOrgStructure = [
    {
      title: `${data?.category} Managers (${data?.users?.filter((user: any) =>
        user?.filteredRolesArray.some((role: any) => role.v?.includes('MANAGER')),
      ).length
        })`,
      subText: managers,
    },
    {
      title: `Field Officers (${data?.users?.filter((user: any) =>
        user?.filteredRolesArray.some((role: any) => role.v?.includes('FIELD_OFFICER')),
      ).length
        })`,
      subText: fieldOfficers,
    },
    {
      title: `Village Coordinators (${data?.users?.filter((user: any) =>
        user?.filteredRolesArray.some((role: any) => role.v?.includes('VILLAGE_COORDINATOR')),
      ).length
        })`,
      subText: villageCoordinators,
    },
    {
      title: `Internal Inspectors (${data?.users?.filter((user: any) =>
        user?.filteredRolesArray.some((role: any) => role.v?.includes('INTERNAL_INSPECTOR')),
      ).length
        })`,
      subText: internalInspectors,
    },
  ];

  const fpoOrgStructure = [
    {
      title: `${data?.category} CEO `,
      subText: ceos,
    },
    {
      title: `Directors (${data?.users?.filter((user: any) =>
        user?.filteredRolesArray.some((role: any) => role.v?.includes('DIRECTOR')),
      ).length
        })`,
      subText: directors,
    },
    {
      title: `Marketing Officers (${data?.users?.filter((user: any) =>
        user?.filteredRolesArray.some((role: any) => role.v?.includes('MARKETING_OFFICER')),
      ).length
        })`,
      subText: marketingOfficers,
    },
    {
      title: `Accounts Officers (${data?.users?.filter((user: any) =>
        user?.filteredRolesArray.some((role: any) => role.v?.includes('ACCOUNTS_OFFICER')),
      ).length
        })`,
      subText: accountsOfficers,
    },
    {
      title: `Storage Officers (${data?.users?.filter((user: any) =>
        user?.filteredRolesArray.some((role: any) => role.v?.includes('STORAGE_OFFICER')),
      ).length
        })`,
      subText: storageOfficers,
    },
    {
      title: `Production Officers (${data?.users?.filter((user: any) =>
        user?.filteredRolesArray.some((role: any) => role.v?.includes('PRODUCTION_OFFICER')),
      ).length
        })`,
      subText: productionOfficers,
    },
  ];

  const schemesAttached = data?.schemes?.map((scheme: any) => ({
    title: `Scheme\n: ${scheme.scheme} - Conversion Status: ${scheme.conversionStatus
      } - Certification Status: ${scheme.certificationStatus}) - 
            Validity Start Date: ${scheme.validityStartDate ? scheme.validityStartDate : '-'
      } - Validity End Date: ${scheme.validityEndDate ? scheme.validityEndDate : '-'}`,
    subText: `Certification document`,
    url: `${scheme.certificationDocument ? scheme.certificationDocument : ''}`,
  }));

  const supportingDocuments = data?.documents?.map((doc: any) => ({
    title: doc.documentType,
    subText: doc.documentDetails,
    url: doc.documentEvidence,
  }));

  function getFilteredUsersByRole(data: any) {
    // Assuming data.users is an array of user objects with rolesList property
    return data?.users.filter((user: any) => !user.rolesList.includes('FARMER'));
  }


  const handleFormSubmit = async (formData: any) => {
    try {
      const apiUrl = getApiUrl(`/collective/${router.query.id}`);
      delete formData._id;
      await axios
        .post(apiUrl, {
          ...formData,
        })
        .then((res) => {
          openToast('success', 'Operator details updated');
          setOpenModal(null);
        });
      reFetch(API_URL);
    } catch (error: any) {
      openToast('error', 'Failed to update operator details');
      console.log(error);
    }
  };

  const componentData = [
    {
      label: 'Basic Info',
      data: basicInfo,
      title: 'Basic Info',
      onClick: () => setOpenModal('basicInfo'),
    },
    {
      label: 'Organization Structure',
      data:
        category === 'ICS'
          ? icsOrgStructure
          : category === 'FPO' || category === 'FPC'
            ? fpoOrgStructure
            : fpoOrgStructure,
      title: 'Organization Structure',
    },

    {
      label:
        category === 'ICS'
          ? 'Mandator Details'
          : category === 'FPO'
            ? 'FPO Details'
            : category === 'FPC'
              ? 'FPC Details'
              : 'Mandator Details',
      data:
        category === 'ICS'
          ? mandatorDetails
          : category === 'FPO'
            ? fpoDetails
            : category === 'FPC'
              ? fpcDetails
              : mandatorDetails,
      title:
        category === 'ICS'
          ? 'Mandator Details'
          : category === 'FPO'
            ? 'FPO Details'
            : category === 'FPC'
              ? 'FPC Details'
              : 'Mandator Details',
      onClick: () =>
        setOpenModal(
          category === 'ICS'
            ? 'mandatorDetails'
            : category === 'FPO'
              ? 'fpoDetails'
              : category === 'FPC'
                ? 'fpcDetails'
                : 'mandatorDetails',
        ),
    },
    {
      label: 'Master Crops',
      count: data?.mastercrops?.length || 0,
      title: 'Master Crops',
      component: <MasterCropDetails data={data} reFetch={() => reFetch(API_URL)} />,
    },
    {
      label: 'Operator Groups',
      count: data?.collectivegroups?.length || 0,
      title: 'Operator Groups',
      component: <CollectiveGroupDetails data={data} reFetch={() => reFetch(API_URL)} modelName={modelName} />,
    },
    {
      label: 'Operator Subgroups',
      count: data?.collectivesubgroups?.length || 0,
      title: 'Operator Subgroups',
      component: <CollectiveSubGroupDetails data={data} reFetch={() => reFetch(API_URL)} modelName={modelName} />,
    },
    {
      label: 'Tractors',
      count: props?.data?.farmTractors?.length || 0,
      title: 'Tractors',
      component: (
        <FarmTractorDetails
          data={data}
          reFetch={() => reFetch(API_URL)}
          modelName={modelName}
          Editor={FarmTractorsEditor}
        />
      ),
    },
    {
      label: 'Machinery',
      data: data,
      title: 'Machinery',
      component: (
        <FarmMachineryDetails
          data={data}
          reFetch={() => reFetch(API_URL)}
          modelName={modelName}
          Editor={FarmMachineriesEditor}
        />
      ),
    },
    {
      label: 'Tools',
      data: data,
      title: 'Tools',
      component: (
        <FarmToolsDetails
          data={data}
          reFetch={() => reFetch(API_URL)}
          modelName={modelName}
          Editor={FarmToolsEditor}
        />
      ),
    },
    {
      label: 'Equipments',
      data: data,
      title: 'Equipments',
      component: (
        <FarmEquipmentsDetails
          data={data}
          handleFormSubmit={handleFormSubmit}
          reFetch={() => reFetch(API_URL)}
          Editor={FarmEquipmentsEditor}
        />
      ),
    },
  ];

  const managementData = [
    //{
    //  label: 'Schemes',
    //  data: schemesAttached,
    //  title: 'Schemes',

    //  onClick: () => setOpenModal('schemes'),
    // },
    {
      label: 'Schemes',
      count: data?.schemeslist?.length || 0,
      title: 'Schemes',
      component: <Schemes schemesData={data?.schemeslist} reFetch={() => reFetch(API_URL)} ownerType={'Operator'} />,
    },
    {
      label: 'Documents',
      count: data?.collectivedocuments?.length || 0,
      title: 'Documents',
      component: <CollectiveDocumentDetails data={data} reFetch={() => reFetch(API_URL)} modelName={modelName} />,
    },
    {
      label: 'Validations',
      count: data?.collectivevalidations?.length || 0,
      title: 'Validations',
      component: <CollectiveValidationDetails data={data} reFetch={() => reFetch(API_URL)} modelName={modelName} />,
    },
    {
      label: 'Evaluations',
      count: data?.collectiveevaluations?.length || 0,
      title: 'Evaluations',
      component: <CollectiveEvaluationDetails data={data} reFetch={() => reFetch(API_URL)} modelName={modelName} />,
    },
    {
      label: 'Organic System Plans',
      count: data?.farmerosps?.length || 0,
      title: 'Organic System Plans',
      component: <OrganicSystemPlanDetails data={data} reFetch={() => reFetch(API_URL)} />,
    },
    {
      label: 'Harvest Updates',
      count: data?.harvestupdates?.length || 0,
      title: 'Harvest Updates',
      component: <HarvestUpdateDetails data={data} reFetch={() => reFetch(API_URL)} modelName={modelName} />,
    },
    {
      label: 'Aggregation Plans',
      count: data?.aggregationplans?.length || 0,
      title: 'Aggregation Plans',
      component: <AggregationPlanDetails data={data} reFetch={() => reFetch(API_URL)} modelName={modelName} />,
    },
    {
      label: 'Complaints',
      count: data?.collectivecomplaints?.length || 0,
      title: 'Complaints',
      component: <CollectiveComplaintDetails data={data} reFetch={() => reFetch(API_URL)} modelName={modelName} />,
    },
    {
      label: 'Transaction Certificates',
      count: data?.transactioncertificates?.length || 0,
      title: 'Transaction Certificates',
      component: <CollectiveTransactionCertDetails data={data} reFetch={() => reFetch(API_URL)} />,
    },
    {
      label: 'Samplings',
      count: data?.collectivesamplings?.length || 0,
      title: 'Samplings',
      component: <CollectiveSamplingDetails data={data} reFetch={() => reFetch(API_URL)} modelName={modelName} />,
    },
    {
      label: 'Scope Certificates',
      count: data?.collectivescopecerts?.length || 0,
      title: 'Scope Certificates',
      component: <CollectiveScopeCertDetails data={data} reFetch={() => reFetch(API_URL)} modelName={modelName} />,
    },
    {
      label: 'Input Logs',
      count: data?.collectiveinputlogs?.length || 0,
      title: 'Input Logs',
      component: <CollectiveInputLogDetails data={data} reFetch={() => reFetch(API_URL)} modelName={modelName} />,
    },
    {
      label: 'Off-Farm Input Permissions',
      count: data?.collectiveinputpermissions?.length || 0,
      title: 'Off-Farm Input Permissions',
      component: <CollectiveInputPermissionDetails data={data} reFetch={() => reFetch(API_URL)} modelName={modelName} />,
    },
    {
      label: 'Test Records',
      count: data?.collectivengmotestrecords?.length || 0,
      title: 'Test Records',
      component: <CollectiveNGMOTestRecordDetails data={data} reFetch={() => reFetch(API_URL)} modelName={modelName} />,
    },
    {
      label: 'Supporting Documents',
      data: supportingDocuments,
      title: 'Supporting Documents',
      onClick: () => setOpenModal('supportingDocuments'),
    },
  ];

  const complianceData = [
    {
      label: 'Non-Confirmities',
      count: data?.collectivenonconfirmitys?.length || 0,
      title: 'Non-Confirmities',
      component: <CollectiveNonConfirmityDetails data={data} reFetch={() => reFetch(API_URL)} modelName={modelName} />,
    },

    {
      label: 'Disputes',
      count: data?.collectivedisputes?.length || 0,
      title: 'Disputes',
      component: <CollectiveDisputeDetails data={data} reFetch={() => reFetch(API_URL)} modelName={modelName} />,
    },

    {
      label: 'Sanctions',
      count: data?.collectivesanctions?.length || 0,
      title: 'Sanctions',
      component: <CollectiveSanctionDetails data={data} reFetch={() => reFetch(API_URL)} modelName={modelName} />,
    },
    {
      label: 'Inspections',
      count: data?.collectiveinspections?.length || 0,
      title: 'Inspections',
      component: <CollectiveInspectionDetails data={data} reFetch={() => reFetch(API_URL)} modelName={modelName} />,
    },
  ];

  const labelList = [
    {
      label: `Info`,
    },
    {
      label: `Management`,
    },
    {
      label: `Compliance`,
    },
    {
      label: 'Scheduled Events',
      icon: <CalendarBlank color={theme.palette.iconColor.secondary} />,
      count: collectiveData?.plan?.[0]?.events?.length ?? 0,
    },
    // {
    //   label: 'Users',
    //   icon: <Person color={theme.palette.iconColor.secondary} />,
    //   count: getFilteredUsersByRole(data)?.length ?? 0,
    // },
    {
      label: 'History',
    },
  ];

  const componentList = [
    {
      component: TabSubNav,
      props: { data: componentData },
    },
    {
      component: TabSubNav,
      props: { data: managementData },
    },
    {
      component: TabSubNav,
      props: { data: complianceData },
    },
    {
      component: ScheduledEvents,
      props: {
        ...getScheduledEventsData(data, 'collective', fetchData),
      },
    },
    // {
    //   component: EntityUsersList,
    //   props: { data: getFilteredUsersByRole(data), modelName: 'collective', entityId: router.query.id, reFetch: reFetch, EntityUserEditor: CollectiveUserEditor }
    // },
    {
      component: EntityHistoryCard,
      props: {
        data: {
          history: data?.history,
          collective: data,
        },
      },
    },
  ];

  const renderModal = () => {
    switch (openModal) {
      case 'basicInfo':
        return (
          <Dialog open={Boolean(openModal)} onClose={handleClose} fullWidth maxWidth={'md'}>
            <CollectiveBasicInfoEditor
              formData={{
                data: {
                  name: data?.name,
                  category: data?.category,
                  email: data?.email,
                  phone: data?.phone,
                  poc: data?.poc,
                  address: data?.address,
                },
              }}
              onSubmit={handleFormSubmit}
            />
          </Dialog>
        );

      case 'schemes':
        return (
          <Dialog open={Boolean(openModal)} onClose={handleClose} fullWidth maxWidth={'md'}>
            <CollectiveSchemesEditor
              formData={{
                data: {
                  schemes: data?.schemes,
                },
              }}
              onSubmit={handleFormSubmit}
            />
          </Dialog>
        );

      case 'mandatorDetails':
        return (
          <Dialog open={Boolean(openModal)} onClose={handleClose} fullWidth maxWidth={'md'}>
            <CollectiveMandatorEditor
              formData={{
                data: {
                  mandator: data?.mandator,
                },
              }}
              onSubmit={handleFormSubmit}
            />
          </Dialog>
        );

      case 'fpoDetails':
        return (
          <Dialog open={Boolean(openModal)} onClose={handleClose} fullWidth maxWidth={'md'}>
            <CollectiveFPODetailsEditor
              formData={{
                data: {
                  fpoDetails: data?.fpoDetails,
                },
              }}
              onSubmit={handleFormSubmit}
            />
          </Dialog>
        );

      case 'fpcDetails':
        return (
          <Dialog open={Boolean(openModal)} onClose={handleClose} fullWidth maxWidth={'md'}>
            <CollectiveFPCDetailsEditor
              formData={{
                data: {
                  fpcDetails: data?.fpcDetails,
                },
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
      case 'farmTractors':
        return (
          <Dialog open={Boolean(openModal)} onClose={handleClose} fullWidth maxWidth={'md'}>
            <FarmTractorsEditor
              formData={{
                data: {
                  farmTractors: data?.farmTractors,
                },
              }}
              onSubmit={handleFormSubmit}
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
        handleSubBtnClick={() => { setOpenVerifyCollectiveModal(true); }}
      />
      <EventPlanModalHandler
        currentPlanId={currentPlanId}
        showToggle={planEventModalToggle}
        setShowToggle={setPlanEventModalToggle}
        onClose={hideEventPlanModal}
        action='post'
        onCreateOrUpdateCallback={onPlanEventCreateOrUpdateCallback}
      />
      <Tabs labelList={labelList} componentList={componentList} />
      {renderModal()}{' '}
      <>
        <Grid container>
          <Grid ref={parentRef} item xs={10}>
            <Drawer
              sx={styles.rightDrawer(parentRef)}
              anchor={'right'}
              open={openVerifyCollectiveModal}
              onClose={handleClose}
            >
              <div style={{ padding: 20 }}>
                <ValidationWorkflowView
                  domainObjectId={collectiveId}
                  domainSchemaName={'collective'}
                  wfId={collectiveData?.validationWorkflowId}
                  reload={() => reFetch(API_URL)}
                  closeDrawer={handleClose}
                />
              </div>
            </Drawer>
          </Grid>
        </Grid>
      </>
    </CircularLoader>
  );
}
