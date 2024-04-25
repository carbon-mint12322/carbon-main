import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { Paper, Box, Button, Typography } from '@mui/material';
import axios from 'axios';
import { useOperator } from '~/contexts/OperatorContext';
import { useAlert } from '~/contexts/AlertContext';
import { CropFormData, LandParcel } from '~/frontendlib/dataModel';
import EntityCreationWizard from '~/components/lib/EntityCreationWizard';


const FarmerSelect = dynamic(import('~/gen/data-views/farmerselect/farmerselectEditor.rtml'));
const LandParcelSelect = dynamic(import('~/gen/data-views/landparcelselect/landparcelselectEditor.rtml'));
const FieldParcelSelect = dynamic(import('~/gen/data-views/fieldparcelselect/fieldparcelselectEditor.rtml'));
const CroppingSystemSelect = dynamic(import('~/gen/data-views/croppingsystemselect/croppingsystemselectEditor.rtml'));
const Add_cropEditor = dynamic(import('~/gen/data-views/add_crop/add_cropEditor.rtml'));


interface CropCreationWizardProps {
  onSubmit: (formData: any) => void;
}

const CropCreationWizard: React.FC<CropCreationWizardProps> = ({ onSubmit }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const { openToast } = useAlert();
  //const [formData, setFormData] = useState({});
  const { changeRoute, getAPIPrefix } = useOperator();
  const [formDatas, setFormDatas] = useState<any[]>([]);
  const [formDataNames, setFormDataNames] = useState<any[]>([]);

  const csFilter = {
    landParcel: formDatas?.[1],
  };
  const plotFilter = {
    landParcel: formDatas?.[1],
  };
  const popFilter = {};
  const masterCropFilter = {};

  const validateFormData = () => {
    if (formDatas[currentStep]) {
      return true;
    }
    return false; // Replace this with your actual validation
  };

  const handleFormDataChange = (formData: any) => {
    //console.log("formData", formData);

    setFormDatas((prevFormDatas) => {
      const updatedFormDatas = [...prevFormDatas];
      if (currentStep === 0) {
        // Update for step 0 (farmer)
        updatedFormDatas[0] = formData?.farmer?.id;
      } else if (currentStep === 1) {
        // Update for step 1 (landparcel)
        updatedFormDatas[1] = formData?.landparcel?.id;
      } else if (currentStep === 2) {
        // Update for step 2 (field)
        updatedFormDatas[2] = formData?.fieldparcel?.id;
      } else if (currentStep === 3) {
        // Update for step 3 (croppingsystem)
        updatedFormDatas[3] = formData?.croppingsystem?.id;
      }

      //console.log("updatedFormDatas", updatedFormDatas);
      return updatedFormDatas;
    });

    setFormDataNames((prevFormDataNames) => {
      const updatedFormDataNames = [...prevFormDataNames];
      if (currentStep === 0) {
        // Update for step 0 (farmer)
        updatedFormDataNames[0] = formData?.farmer?.name;
      } else if (currentStep === 1) {
        // Update for step 1 (landparcel)
        updatedFormDataNames[1] = formData?.landparcel?.name;
      } else if (currentStep === 2) {
        // Update for step 2 (field)
        updatedFormDataNames[2] = formData?.fieldparcel?.name;
      } else if (currentStep === 3) {
        // Update for step 3 (croppingsystem)
        updatedFormDataNames[3] = formData?.croppingsystem?.name;
      }

      //console.log("updatedFormDataNames", updatedFormDataNames);
      return updatedFormDataNames;
    });
  };

  const handleFormSubmit = async (data: CropFormData) => {

    // Submit the final form data
    onSubmit(data);
  };


  async function defaultListFilter(options: any) {
    const res: {
      data: any;
    } = await axios.get(getAPIPrefix() + `/farmer`);
    return res.data;
  }


  async function customFilterForLandParcel(options: any) {

    const lpres: {
      data: any;
    } = await axios.get(getAPIPrefix() + `/landparcel`);

    const filteredData = lpres.data.filter((landparcel: any) => landparcel?.landParcelFarmer?.farmer === formDatas?.[0]);

    return filteredData;
  }

  async function customFilterForFieldParcel(options: any) {
    const res: {
      data: any;
    } = await axios.get(getAPIPrefix() + `/field`);
    const filteredData = res.data.filter((field: any) => field.landParcel === formDatas?.[1]);
    return filteredData;
  }

  async function customFilterForCroppingSystem(options: any) {
    const res: {
      data: any;
    } = await axios.get(getAPIPrefix() + `/croppingsystem`);
    const filteredData = res.data.filter((croppingsystem: any) => croppingsystem.field === formDatas?.[2]);
    return filteredData;
  }

  const cropFormContext: any = {
    getFilter: (key: string) => {
      switch (key) {
        case 'croppingSystem': // this key is defined as ui:options in yaml
          return csFilter;
        case 'plot': // this key is defined as ui:options in yaml
          return plotFilter;
        case 'pop': // this key is defined as ui:options in yaml
          return popFilter;
        case 'mastercrop': // this key is defined as ui:options in yaml
          return masterCropFilter;
        default:
          break;
      }
      throw new Error(`Unknown filter key in ui:options ${key}`);
    },
  };

  const handleNext = async () => {
    // Validate and process data for the current step
    const isValid = await validateFormData();

    if (isValid) {
      // Move to the next step
      setCurrentStep((prevStep) => prevStep + 1);
    } else {
      openToast('error', `Current step data is not valid. Cannot proceed to the next step!`);
    }
  };

  const handleBack = () => {
    // Move to the previous step
    setCurrentStep((prevStep) => prevStep - 1);
  };

  const handleCreateLandParcel = () => {
    // Redirect to the create page for the Land Parcel
    changeRoute('/landparcel/create');
  };
  const handleCreateFarmer = () => {
    // Redirect to the create page for the Land Parcel
    changeRoute('/farmer/create');
  };
  const handleCreateFieldParcel = () => {
    // Redirect to the create page for the Land Parcel
    changeRoute(`/landparcel/${formDatas[1]}`);
  };
  const handleCreateCroppingSystem = () => {
    // Redirect to the create page for the Land Parcel
    changeRoute(`/landparcel/${formDatas[1]}`);
  };


  const steps = [
    {
      name: 'SelectOrCreateFarmer',
      entityName: 'Farmer',

      createEntity: { handleCreateFarmer },
      component: <FarmerSelect hideSubmitButton={true} onChange={handleFormDataChange} formData={{ data: { farmer: { id: formDatas[0], name: formDataNames[0] } } }} formContext={{ foreignObjectLoader: defaultListFilter, formData: formDatas[0] }} />,
    },
    {
      name: 'SelectOrCreateLandParcel',
      entityName: 'Land Parcel',

      createEntity: { handleCreateLandParcel },
      component: <LandParcelSelect hideSubmitButton={true} onChange={handleFormDataChange} formData={{ data: { landparcel: { id: formDatas[1], name: formDataNames[1] } } }} formContext={{ foreignObjectLoader: customFilterForLandParcel, formData: formDatas[1] }} />,
    },

    {
      name: 'SelectOrCreateFieldParcel',
      entityName: 'Field Parcel',

      createEntity: { handleCreateFieldParcel },
      component: <FieldParcelSelect hideSubmitButton={true} onChange={handleFormDataChange} formData={{ data: { fieldparcel: { id: formDatas[2], name: formDataNames[2] } } }} formContext={{ foreignObjectLoader: customFilterForFieldParcel, formData: formDatas[2] }} />,
    },

    {
      name: 'SelectCroppingSystem',
      entityName: 'Cropping System',

      createEntity: { handleCreateCroppingSystem },
      component: <CroppingSystemSelect hideSubmitButton={true} onChange={handleFormDataChange} formData={{ data: { croppingsystem: { id: formDatas[3], name: formDataNames[3] } } }} formContext={{ foreignObjectLoader: customFilterForCroppingSystem, formData: formDatas[3] }} />,
    },
    {
      name: 'CropDetails',
      entityName: 'Crop',

      component: <Add_cropEditor onSubmit={handleFormSubmit} formContext={cropFormContext} formData={{ data: { croppingSystem: formDatas[3] } }} />,
    },
  ];



  const CurrentStepComponent = steps[currentStep].component;
return (<></>);
  // return (<EntityCreationWizard steps={steps} entityType={'Crop'} onNext={handleNext} onBack={handleBack} />);
  // return (
  //   <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
  //     <Typography variant="h5" gutterBottom style={{ marginTop: '16px' }}>
  //       Crop Creation Wizard - Step {currentStep + 1}
  //     </Typography>

  //     <div style={{ display: 'flex', alignItems: 'center' }}>
  //       {/* Left side, takes 75% of the width */}
  //       <div style={{ flex: currentStep === 4 ? 4 : 3, marginRight: '16px', textAlign: 'left', maxWidth: '600x' }}>
  //         {CurrentStepComponent}
  //       </div>

  //       {/* Right side, takes 25% of the width */}
  //       <div style={{ flex: 1, display: 'flex', alignItems: 'right', flexDirection: 'column', gap: '8px', maxWidth: currentStep !== 4 ? '200px' : '0px' }}>
  //         {/* New button for creating a farmer */}
  //         {currentStep === 0 && (
  //           <Button
  //             variant={'contained'}
  //             color={'primary'}
  //             size={'small'}
  //             onClick={() => changeRoute('/farmer/create')}
  //             style={{ width: '100%', whiteSpace: 'nowrap' }}
  //           >
  //             {'Create Farmer'}
  //           </Button>
  //         )}
  //         {currentStep === 1 && (
  //           <Button
  //             variant={'contained'}
  //             color={'primary'}
  //             onClick={() => changeRoute('/landparcel/create')}
  //             size={'small'}
  //             style={{ width: '100%', whiteSpace: 'nowrap' }}
  //           >
  //             {'Create Land Parcel'}
  //           </Button>
  //         )}
  //         {currentStep === 2 && (
  //           <Button
  //             variant={'contained'}
  //             color={'primary'}
  //             onClick={() => changeRoute(`/landparcel/${formDatas[1]}`)}
  //             size={'small'}
  //             style={{ width: '100%', whiteSpace: 'nowrap' }}
  //           >
  //             {'Create Field Parcel'}
  //           </Button>
  //         )}
  //         {currentStep === 3 && (
  //           <Button
  //             variant={'contained'}
  //             color={'primary'}
  //             onClick={() => changeRoute(`/landparcel/${formDatas[1]}`)}
  //             size={'small'}
  //             style={{ width: '100%', whiteSpace: 'nowrap' }}
  //           >
  //             {'Create Cropping System'}
  //           </Button>
  //         )}

  //       </div>

  //     </div>

  //     {/* Bottom navigation buttons */}
  //     <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
  //       <Button
  //         variant={'contained'}
  //         color={'primary'}
  //         onClick={handleBack}
  //         size={'small'}
  //         disabled={currentStep === 0}
  //       >
  //         {'Back'}
  //       </Button>
  //       <Button
  //         variant={'contained'}
  //         color={'primary'}
  //         onClick={handleNext}
  //         disabled={currentStep === steps.length - 1}
  //         size={'small'}
  //       >
  //         {'Next'}
  //       </Button>
  //       {/* {currentStep === steps.length - 1 && (
  //         <Button
  //           variant={'contained'}
  //           color={'primary'}
  //           onClick={handleFinish}
  //           size={'small'}
  //         >
  //           {'Finish'}
  //         </Button>
  //       )} */}
  //     </div>
  //   </div >
  // );
};

export default CropCreationWizard;
