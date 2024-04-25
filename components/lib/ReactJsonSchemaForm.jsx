import React, { useState, useEffect, useContext } from 'react';
import Router from 'next/router';
import dynamic from 'next/dynamic';
import validator from '@rjsf/validator-ajv8';

import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';

import { MasterDetailContext } from '~/contexts/MasterDetailContext';

import fields from '../form-widgets/form-fields';
import widgets from '../form-widgets';
import templates from '../form-widgets/templates';

import { getWithRQ } from '~/frontendlib/model-lib/crudRQ';
import { saveWithRQ } from '~/frontendlib/model-lib/crudRQ';
import { camelCaseToSentenceCase } from '~/utils/index';
import If from './If';

export const ReactJsonSchemaForm = dynamic(import('@rjsf/mui'));

// Master-detail version of RJSF form
function MdRjsf(props) {
  const mdCtx = useContext(MasterDetailContext);
  const schema = props.schema;
  const modelName = props.modelName;
  const schemaId = props.schema.$id;
  const hideSubmitButton = props.hideSubmitButton;
  // setup a react-query mutation for saving form
  const saveMutation = saveWithRQ(modelName); // create if no ID,else update
  const {
    isLoading: isSaving,
    status: saveStatus,
    mutate,
    success: isSaveSuccess,
    error: saveError,
  } = saveMutation;

  const onSuccess = (data, variables, context) => {
    props.onSuccess && props.onSuccess(data, variables, context);
  };

  const onError = (error, variables, context) => {
    props.onError && props.onError(error, variables, context);
  };

  const onSettled = (data, error, variables, context) => {
    props.onSettled && props.onSettled(data, error, variables, context);
  };

  // React query get
  const getRQ = getWithRQ(modelName, mdCtx.objectId, { enabled: false });
  const { refetch, isFetching, error: loadError, data: rqdata } = getRQ;

  const [formData, setFormData] = useState(props.formData?.data || rqdata || {});

  const onSubmit = (data) => {
    if (data?.formData) {
      if (props.onSubmit) {
        props.onSubmit(data?.formData);
      } else {
        props.onSubmitAttempt && props.onSubmitAttempt(data?.formData);
        mutate(data?.formData, {
          onSuccess: onSuccess,
          onError: onError,
          onSettled: onSettled,
        });
      }
    }
  };

  useEffect(() => {
    // Master-detail context
    if (!mdCtx.objectId) {
      return;
    }

    refetch();
  }, [mdCtx?.objectId, refetch]);

  const onChange = ({ formData }) => {
    if (props.onChange) {
      props.onChange(formData);
    }
    setFormData(formData);
  };

  const onFormError = (errors) => {
    window.scrollTo(0, 0);
    if (props.onFormError) {
      props.onFormError(errors);
    }
  };

  // You can add more modelNames in future
  const ModelNames = {
    PRODUCT_BATCH: 'add_productBatch',
    ADD_USER: 'add_user',
    EDIT_USER: 'basicUserDetails',
    HARVEST_UPDATE: 'add_harvestupdate'
  };

  // Define an array of modelName values for which future dates are allowed
  const futureDateAllowedModels = [ModelNames.PRODUCT_BATCH, ModelNames.HARVEST_UPDATE];

  const pinValidationModels = [ModelNames.ADD_USER, ModelNames.EDIT_USER]

  function transformErrors(errors) {
    window.scrollTo(0, 0);
    let activityType2 = formData?.controlPoints?.filter((el) => el.activityType == 'Plantation');
    if (activityType2 && activityType2.length > 1) {
      errors.push({
        stack: "Should have only one 'Plantation' crop in POP",
        message: "Should have only one 'Plantation' crop in POP'",
        property: `controlPoints.${activityType2.length - 1}.activityType`,
      });
    }

    const durationExpenseStartDate = new Date(formData?.durationAndExpenses?.startDate);
    const durationExpenseEndDate = new Date(formData?.durationAndExpenses?.endDate);
    const soilInfoStartDate = new Date(formData?.soilInfo?.startDate);
    const soilInfoEndDate = new Date(formData?.soilInfo?.endDate);
    const StartDate = new Date(formData?.startDate);
    const EndDate = new Date(formData?.endDate);
    const currentDate = new Date();
    let newError = {
      stack: '"End Date" must not be less than "Start Date"',
    };
    let newError2 = {
      stack: '"Start Date" should be in past',
    };
    let newError3 = {
      stack: '"End Date" should be in past',
    };


    if (pinValidationModels.includes(modelName)) {
      if (formData.pin != undefined) {
        if (!/^\d{4}$/.test(formData.pin))
          errors.push({
            stack: 'Pin must be 4 digits.',
          });
      }
    }
    if (formData.plot && formData.croppingSystem) {
      errors.push({
        stack: 'Cannot select both Cropping System and Plot at the same time. Please choose only one option.',
      });
    }

    if (durationExpenseStartDate) {
      if (new Date(formData?.durationAndExpenses?.startDate) > currentDate.getTime()) {
        errors.push(newError2);
      }
      if (new Date(formData?.durationAndExpenses?.endDate) > currentDate.getTime()) {
        errors.push(newError3);
      }
    }

    if (
      new Date(formData?.soilInfo?.startDate) > currentDate.getTime() ||
      (new Date(formData?.startDate) > currentDate.getTime() && !futureDateAllowedModels.includes(modelName))
    ) {
      errors.push(newError2);
    }
    if (
      new Date(formData?.soilInfo?.endDate) > currentDate.getTime() ||
      (new Date(formData?.endDate) > currentDate.getTime() && !futureDateAllowedModels.includes(modelName))
    ) {
      errors.push(newError3);
    }

    if (durationExpenseEndDate < durationExpenseStartDate) {
      errors.push(newError);
    }
    if (soilInfoEndDate < soilInfoStartDate) {
      errors.push(newError);
    }
    if (EndDate < StartDate) {
      errors.push(newError);
    }
    if (formData?.estHarvestDate < formData?.plannedSowingDate) {
      errors.push({
        stack: '"Estimated Harvest Date" must not be less than "Planned Plantation Date"',
      });
    }

    Array.isArray(formData?.schemes) &&
      formData?.schemes?.map((el, index) => {
        let startDate = el.validityStartDate;
        let endDate = el.validityEndDate;
        if (el.conversionStatus === 'C3') {
          if (new Date(startDate) > currentDate.getTime()) {
            errors.push(newError2);
          }

          errors.push({
            name: 'required',
            stack: "Must have required property 'Certification validity start date'",
            message: "Must have required property 'Certification validity start date'",
            property: `.schemes.${index}.validityStartDate`,
          });
          console.log(errors, 'errors');
        }
        if (el.conversionStatus === 'C3') {
          if (new Date(endDate) > currentDate.getTime()) {
            errors.push(newError3);
          }

          errors.push({
            name: 'required',
            stack: "Must have required property 'Certification validity end date'",
            message: "Must have required property 'Certification validity end date'",
            property: `.schemes.${index}.validityEndDate`,
          });
        }
        if (endDate < startDate) {
          errors.push(newError);
        }
      });

    const pattern = /.*\.location\.(lng|lat)/; //Detect latitude or Longitude errors

    const hasLocationError = errors.some((error) => pattern.test(error.property));
    if (hasLocationError) {
      errors.push({
        // Add new error object
        message: "Must have required property 'Location'",
        name: 'required',
        params: {
          missingProperty: 'GeoLocation',
        },
        property: '.alliedActivities.location',
        schemaPath: '#/definitions/GeoLocation/required',
        stack: "Must have required property 'Location'",
      });

      for (let i = errors.length - 1; i >= 0; i--) {
        const error = errors[i];
        if (pattern.test(error.property)) {
          errors.splice(i, 1); // Remove existing location-related errors
        }
      }
    }
    errors = errors.filter((error) => error.stack !== '.waterSources must match "then" schema');

    let certificationBodyProperty = '';
    errors.forEach((error) => {
      const match = error?.property?.match(/\.certificationBodyId/);
      if (match && error.name === 'required') {
        const endIndex = match.index + match[0].length;
        certificationBodyProperty = error.property.substring(0, endIndex);
      }
    });

    if (certificationBodyProperty) {
      for (let i = errors.length - 1; i >= 0; i--) {
        const error = errors[i];
        if (/\.certificationBodyId/.test(error.property)) {
          errors.splice(i, 1); // Remove existing required certification body -related errors
        }
      }
      errors.push({
        name: 'required',
        property: certificationBodyProperty,
        stack: "Must have required property 'Certification Body'",
        schemaPath: '#/definitions/CertificationBodyRef/required',
        message: "Please select a 'Certification Body'",
      });
    }

    errors.map((error) => {
      error.stack = error.stack.charAt(0).toUpperCase() + error.stack.slice(1);
      if (formData?.seedSource && !formData?.seedSource.match(/[a-zA-Z][a-zA-Z0-9\\s]*$/)) {
        errors?.seedSource?.addError(
          "'Planting Material Source' field should not contain special characters",
        );
        if (
          error.stack ===
          `'Planting material source' must match pattern "^[a-zA-Z][a-zA-Z0-9\\s]*$"`
        ) {
          error.message = "Planting Material Source shouldn't contain special characters";
          error.stack = "Planting Material Source shouldn't contain special characters";
        }
      }

      if (formData?.seedVariety && !formData?.seedVariety.match(/[a-zA-Z][a-zA-Z0-9\\s]*$/)) {
        errors?.seedVariety?.addError(
          "'Planting Material Variety' field should not contain special characters",
        );
        if (
          error.stack ===
          `'Planting material variety' must match pattern "^[a-zA-Z][a-zA-Z0-9\\s]*$"`
        ) {
          error.message = "Planting material variety shouldn't contain special characters";
          error.stack = "Planting material variety shouldn't contain special characters";
        }
      }

      if (error.message === 'must match pattern "^\\+91\\d{10}$"') {
        const words = error.stack.split(' ');

        const trimmedWords = words.slice(0, -4);

        const result = trimmedWords.join(' ');

        let customError =
          result + ' must start with the country code "+91" and should be a 10-digit number."';

        error.stack = customError;
        error.message = 'Must be a format of eg: +919338754376';
      }
      if (error.message === `must match pattern "^[a-zA-Z\\s]+$"`) {
        const words = error.stack.split(' ');

        const trimmedWords = words.slice(0, -4);

        const result = trimmedWords.join(' ');
        let customError = result + ' field can contain only alphabets';
        error.stack = customError;
        error.message = result + ' field can contain only alphabets';
      }
      if (
        error.message === 'must match pattern "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$"'
      ) {
        let customError = 'Please enter a valid email address';
        error.stack = customError;
        error.message = 'Please enter a valid email address';
      }
      if (error.message === 'must match pattern "^[0-9]+$"') {
        let customError = 'Pincode must be a number.';
        error.stack = customError;
        error.message = 'Pincode must be a number.';
      }

      if (
        error.message === 'must NOT have fewer than 1 items' &&
        error.name === 'minItems' &&
        error.params.limit === 1
      ) {
        let input = error.property.split('.');
        error.stack = `${camelCaseToSentenceCase(
          input[input.length - 1],
        )} must NOT have fewer than 1 items`;
        error.message = error.stack;
      }

      if (error.message === 'must be array') {
        const tempArray = error.property.split('.');
        const newString = camelCaseToSentenceCase(tempArray[tempArray.length - 1]);
        const customError = `Must have required property '${newString}'`;
        error.stack = customError;
        error.message = customError;
      }
      if (error.message === 'must be > 0') {
        let input = error.property;
        let firstLetter = input.charAt(1);
        let restOfString = input.slice(2);

        let transformedString =
          firstLetter.toUpperCase() +
          restOfString.replace(/[A-Z]/g, (match) => ' ' + match).toLowerCase();

        error.stack = `${transformedString} must be greater than 0`;
        error.message = 'must be greater than 0';
      }
    });
    if (props.transformErrors) {
      props.transformErrors(formData, errors);
    }
    return errors;
  }

  const onCancel = () => {
    if (props.onCancelBtnClick) {
      props.onCancelBtnClick();
    } else {
      Router.back();
    }
  };

  return (
    <>
      {isFetching && <Alert severity='info'>Loading... </Alert>}
      {loadError && <Alert severity='error'>Unable to load from server: {loadError.message}</Alert>}
      {isSaving && <Alert severity='info'>Saving... </Alert>}
      {saveError && <Alert severity='error'>Save failed. {saveError.message}</Alert>}
      <ReactJsonSchemaForm
        formData={formData}
        schema={props.schema}
        uiSchema={props.uiSchema}
        onSubmit={onSubmit}
        onChange={onChange}
        fields={fields}
        widgets={widgets}
        transformErrors={transformErrors}
        onError={onFormError}
        showErrorList='top'
        formContext={props.formContext || {}}
        noHtml5Validate
        validator={validator}
        readonly={props.readonly || false}
        templates={templates}
      >
        <If value={!props.readonly && !hideSubmitButton}>
          <Button
            variant={'contained'}
            color={'primary'}
            // onClick={() => onSubmit({ formData })}
            sx={props.h100}
            type='submit'
          >
            {props.mainBtnLabel ? props.mainBtnLabel : 'Submit'}
          </Button>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <Button variant={'contained'} color={'secondary'} onClick={onCancel} sx={props.h100}>
            Cancel
          </Button>
        </If>
      </ReactJsonSchemaForm>
    </>
  );
}

export default MdRjsf;
