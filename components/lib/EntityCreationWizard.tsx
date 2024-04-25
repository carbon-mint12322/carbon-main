// EntityCreationWizard.tsx
import React, { useState } from 'react';
import { Button, Typography } from '@mui/material';

interface WizardStep {
  name: string;
  entityName: string; // Add entityName to each step for customization
  component: React.ReactNode;
  createEntity?: () => void; // Optional callback for creating the base entity for this step
}

interface EntityCreationWizardProps {
  entityType: string; // Pass entityType for customization
  steps: WizardStep[];
  onNext: () => void; // Notify the calling component about the next step
  onBack: () => void; // Notify the calling component about the previous step
}

const EntityCreationWizard: React.FC<EntityCreationWizardProps> = ({ entityType, steps, onNext, onBack }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = async () => {
    // Add any validation logic here if needed
    onNext();
    setCurrentStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    onBack();
    setCurrentStep((prevStep) => prevStep - 1);
  };



  const handleCreateEntity = () => {
    // Execute the createEntity callback for the current step if provided
    const createEntityCallback = steps[currentStep]?.createEntity;
    if (createEntityCallback) {
      createEntityCallback();
    }
  };

  const CurrentStepComponent = steps[currentStep].component;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Typography variant="h5" gutterBottom style={{ marginTop: '16px' }}>
        {entityType} Creation Wizard - Step {currentStep + 1}
      </Typography>

      <div style={{ display: 'flex', alignItems: 'center' }}>
        {/* Left side, takes 75% of the width */}

        <div style={{ flex: currentStep === (steps.length - 1) ? 4 : 3, marginRight: '16px', textAlign: 'left', maxWidth: '600px' }}>

          {CurrentStepComponent}
        </div>

        {/* Right side, takes 25% of the width */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'right', flexDirection: 'column', gap: '8px', maxWidth: currentStep !== (steps.length - 1) ? '200px' : '0px' }}>
          {steps[currentStep]?.createEntity && (
            <Button
              variant={'contained'}
              color={'primary'}
              size={'small'}
              onClick={handleCreateEntity}
              style={{ width: '100%', whiteSpace: 'nowrap' }}
            >
              {`Create ${steps[currentStep]?.entityName}`}
            </Button>
          )}
        </div>
      </div>

      {/* Bottom navigation buttons */}
      <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
        <Button
          variant={'contained'}
          color={'primary'}
          onClick={handleBack}
          size={'small'}
          disabled={currentStep === 0}
        >
          {'Back'}
        </Button>
        <Button
          variant={'contained'}
          color={'primary'}
          onClick={handleNext}
          disabled={currentStep === steps.length - 1}
          size={'small'}
        >
          {'Next'}
        </Button>

      </div>
    </div >
  );
};

export default EntityCreationWizard;
