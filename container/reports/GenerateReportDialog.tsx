import {
  SelectChangeEvent,
  FormControl,
  InputLabel,
  MenuItem,
  Button,
  Select,
  Stack,
  Checkbox,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  FormLabel,
  Switch,
  Radio,
  RadioGroup,
  TextField,
} from '@mui/material';
import Dialog from '~/components/lib/Feedback/Dialog';
import React, { useEffect, useMemo, useState } from 'react';
import If from '~/components/lib/If';
import dayjs from 'dayjs';
import farmerSchema from '~/gen/jsonschemas/farmerReport.json';
import cropSchema from '~/gen/jsonschemas/cropReport.json';
import landParcelSchema from '~/gen/jsonschemas/landparcelReport.json';
import solarDryerLoadEventReportSchema from '~/gen/jsonschemas/solarDryerLoadEventReport.json';

import CustomDateRangePicker from './DateRange';
import { flattenSchemaProperties, parseJSONSchema } from '~/backendlib/util/updateKeyWithTitle';
import axios from 'axios';
import { useOperator } from '~/contexts/OperatorContext';
import { useAlert } from '~/contexts/AlertContext';
import useFetch from 'hooks/useFetch';

export enum DateRangeTypeEnum {
  ALL_TIME = 'all_time',
  TODAY = 'today',
  YESTERDAY = 'yesterday',
  THIS_WEEK = 'this_week',
  LAST_WEEK = 'last_week',
  THIS_MONTH = 'this_month',
  LAST_MONTH = 'last_month',
  SIX_MONTH = 'six_month',
  ONE_YEAR = 'one_year',
  CUSTOM = 'custom',
}

export enum ReportTypeEnum {
  FARMERS = 'farmers',
  LAND_PARCELS = 'landparcels',
  CROPS = 'crops',
  LAND_PREP_SIMPLIFIED_EVENT = 'landPrepSimplifiedEvent',
  SOLAR_DRYER_LOAD_EVENT = 'solarDryerLoadEvent',
}

export enum DocumentStatusTypeEnum {
  ACTIVE = 'active',
  DEACTIVE = 'deactive',
  BOTH = 'both',
}

export const reportTypeList = [
  { label: 'Farmers', value: ReportTypeEnum.FARMERS },
  { label: 'Land Parcels', value: ReportTypeEnum.LAND_PARCELS },
  { label: 'Crops', value: ReportTypeEnum.CROPS },
  {
    label: 'Impact Reports from SolarDryer Load Events',
    value: ReportTypeEnum.SOLAR_DRYER_LOAD_EVENT,
  },
];

export const dateRangeTypeList = [
  { label: 'All Time', value: DateRangeTypeEnum.ALL_TIME },
  {
    label: `Today (${dayjs().format('DD MMM YYYY')})`,
    value: DateRangeTypeEnum.TODAY,
  },
  {
    label: `Yesterday (${dayjs().add(-1, 'day').format('DD MMM YYYY')})`,
    value: DateRangeTypeEnum.YESTERDAY,
  },
  {
    label: `This Week (${dayjs().startOf('week').format('DD MMM YYYY')}-${dayjs()
      .endOf('week')
      .format('DD MMM YYYY')})`,
    value: DateRangeTypeEnum.THIS_WEEK,
  },
  {
    label: `Last Week (${dayjs().add(-1, 'week').startOf('week').format('DD MMM YYYY')}-${dayjs()
      .add(-1, 'week')
      .endOf('week')
      .format('DD MMM YYYY')})`,
    value: DateRangeTypeEnum.LAST_WEEK,
  },
  {
    label: `This Month (${dayjs().startOf('month').format('DD MMM YYYY')}-${dayjs()
      .endOf('month')
      .format('DD MMM YYYY')})`,
    value: DateRangeTypeEnum.THIS_MONTH,
  },
  {
    label: `Last Month (${dayjs().add(-1, 'month').startOf('month').format('DD MMM YYYY')}-${dayjs()
      .add(-1, 'month')
      .endOf('month')
      .format('DD MMM YYYY')})`,
    value: DateRangeTypeEnum.LAST_MONTH,
  },
  {
    label: `Last 6 Month (${dayjs()
      .add(-6, 'month')
      .startOf('month')
      .format('DD MMM YYYY')}-${dayjs().add(-1, 'month').endOf('month').format('DD MMM YYYY')})`,
    value: DateRangeTypeEnum.SIX_MONTH,
  },
  {
    label: `Last 1 Year (${dayjs().add(-1, 'year').startOf('year').format('DD MMM YYYY')}-${dayjs()
      .add(-1, 'year')
      .endOf('year')
      .format('DD MMM YYYY')})`,
    value: DateRangeTypeEnum.ONE_YEAR,
  },
  { label: 'Custom', value: DateRangeTypeEnum.CUSTOM },
];

export const documentStatusList = [
  { label: 'Active', value: DocumentStatusTypeEnum.ACTIVE },
  { label: 'Deactive', value: DocumentStatusTypeEnum.DEACTIVE },
  { label: 'Both', value: DocumentStatusTypeEnum.BOTH },
];

export interface DateRange {
  start: Date | null;
  end: Date | null;
}

const schemas: {
  [key: string]: any;
} = {
  crops: cropSchema,
  landparcels: landParcelSchema,
  farmers: farmerSchema,
  solarDryerLoadEvent: solarDryerLoadEventReportSchema,
};

export interface GenerateReportDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (
    reportName: string,
    reportType: ReportTypeEnum,
    documentStatus: DocumentStatusTypeEnum,
    customFields: string[],
    dateRange?: DateRange,
    collective?: string,
  ) => void;
}

function GenerateReportDialog({ open, onClose, onSubmit }: GenerateReportDialogProps) {
  const [reportType, setReportType] = useState<ReportTypeEnum>(ReportTypeEnum.LAND_PARCELS);
  const [dateRangeType, setDateRangeType] = useState<DateRangeTypeEnum>(DateRangeTypeEnum.ALL_TIME);
  const [documentStatus, setDocumentStatus] = useState<DocumentStatusTypeEnum>(
    DocumentStatusTypeEnum.ACTIVE,
  );
  const { getApiUrl, getAPIPrefix } = useOperator();
  const { openToast } = useAlert();
  const API_URL = getAPIPrefix() + '/collective';
  const { isLoading: loading, data = [] } = useFetch<any>(API_URL);

  const [dateRange, setDateRange] = React.useState<DateRange>({
    start: null,
    end: null,
  });
  const [isDatesValid, setIsDatesValid] = useState<boolean>(true);
  const [isCustomField, setIsCustomField] = useState<boolean>(false);
  const [customFields, setCustomFields] = useState<string[]>([]);
  const [reportName, setReportName] = useState<string>('');
  const [collective, setCollective] = useState<string>('all');

  const [customFieldError, setCustomFieldError] = useState<boolean>(false);
  const [fileNameExistError, setFileNameExistError] = useState<boolean>(false);
  const [validatingFileName, setValidatingFileName] = useState<boolean>(false);

  const handleCollectiveChange = (event: SelectChangeEvent<string>) => {
    setCollective(event.target.value);
  };

  const handleReportTypeChange = (event: SelectChangeEvent<ReportTypeEnum>) => {
    setReportType(event.target.value as ReportTypeEnum);
  };

  const handleDateRangeTypeChange = (event: SelectChangeEvent<DateRangeTypeEnum>) => {
    setDateRangeType(event.target.value as DateRangeTypeEnum);
    if ((event.target.value as DateRangeTypeEnum) !== DateRangeTypeEnum.CUSTOM && !isDatesValid) {
      setIsDatesValid(true);
    }
  };

  const handleSubmit = async () => {
    const dateRangeData = calculateDateRange();

    if (
      !reportName ||
      (isCustomField && customFields.length < 2) ||
      dateRangeData === 'Invalid dates'
    ) {
      setCustomFieldError(true);
      return;
    } else {
      onSubmit(
        reportName,
        reportType,
        documentStatus,
        customFields,
        dateRangeData,
        collective === 'all' ? undefined : collective,
      );
    }
  };

  const handleToggleCustomFields = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsCustomField(event.target.checked);
  };

  const handleDocumentStatusChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDocumentStatus(event.target.value as DocumentStatusTypeEnum);
  };

  const handleCustomFieldSelection = (field: string) => {
    const index = customFields.indexOf(field);

    if (index > -1) {
      const newCustomField = [...customFields];
      newCustomField.splice(index, 1);
      setCustomFields(newCustomField);
    } else {
      const newCustomField = [...customFields, field];
      setCustomFields(newCustomField);
      if (customFieldError && newCustomField?.length > 1) {
        setCustomFieldError(false);
      }
    }
  };

  const calculateDateRange = (): undefined | { start: Date; end: Date } | 'Invalid dates' => {
    switch (dateRangeType) {
      case DateRangeTypeEnum.TODAY:
        return {
          start: dayjs().startOf('day').toDate(),
          end: dayjs().endOf('day').toDate(),
        };

      case DateRangeTypeEnum.YESTERDAY:
        return {
          start: dayjs().add(-1, 'day').startOf('day').toDate(),
          end: dayjs().add(-1, 'day').endOf('day').toDate(),
        };

      case DateRangeTypeEnum.THIS_WEEK:
        return {
          start: dayjs().startOf('week').startOf('day').toDate(),
          end: dayjs().endOf('week').endOf('day').toDate(),
        };

      case DateRangeTypeEnum.LAST_WEEK:
        return {
          start: dayjs().add(-1, 'week').startOf('week').startOf('day').toDate(),
          end: dayjs().add(-1, 'week').endOf('week').endOf('day').toDate(),
        };

      case DateRangeTypeEnum.THIS_MONTH: {
        return {
          start: dayjs().startOf('month').startOf('day').toDate(),
          end: dayjs().endOf('month').endOf('day').toDate(),
        };
      }

      case DateRangeTypeEnum.LAST_MONTH: {
        return {
          start: dayjs().add(-1, 'month').startOf('month').startOf('day').toDate(),
          end: dayjs().add(-1, 'month').endOf('month').endOf('day').toDate(),
        };
      }

      case DateRangeTypeEnum.SIX_MONTH: {
        return {
          start: dayjs().add(-6, 'month').startOf('month').startOf('day').toDate(),
          end: dayjs().add(-1, 'month').endOf('month').endOf('day').toDate(),
        };
      }

      case DateRangeTypeEnum.ONE_YEAR: {
        return {
          start: dayjs().add(-1, 'year').startOf('year').startOf('day').toDate(),
          end: dayjs().add(-1, 'year').endOf('year').endOf('day').toDate(),
        };
      }

      case DateRangeTypeEnum.CUSTOM: {
        if (dateRange.start && dateRange.end) {
          return {
            start: dayjs(dateRange.start).startOf('day').toDate(),
            end: dayjs(dateRange.end).endOf('day').toDate(),
          };
        } else {
          setIsDatesValid(false);
          return 'Invalid dates';
        }
      }

      case DateRangeTypeEnum.ALL_TIME:
      default: {
        return undefined;
      }
    }
  };

  const fileFields = useMemo(() => {
    if (isCustomField) {
      const schemaObj = parseJSONSchema(schemas[reportType as string]);

      return flattenSchemaProperties(schemaObj);
    }
    return {};
  }, [reportType, isCustomField]);

  const isDisabled = useMemo(
    () =>
      !isDatesValid ||
      customFieldError ||
      !reportName ||
      fileNameExistError ||
      validatingFileName ||
      loading,
    [isDatesValid, reportName, customFieldError, fileNameExistError, validatingFileName, loading],
  );

  const debounce = (fn: (args: string) => void, delay: number) => {
    let timerId: any;
    return (args: string) => {
      clearTimeout(timerId);
      timerId = setTimeout(() => {
        fn(args);
      }, delay);
    };
  };

  const handleBlur = async () => {
    const apiUrl = `/reports/checkFileName`;

    if (reportName?.length) {
      try {
        setValidatingFileName(true);
        const response = await axios.get(getApiUrl(`${apiUrl}?reportName=${reportName}`));

        if (response.data) {
          if (response.data.present) {
            setFileNameExistError(true);
          } else {
            setFileNameExistError(false);
          }
        }
      } catch (error) {
        openToast('error', 'Error occurred while making the API request');
      } finally {
        setValidatingFileName(false);
      }
    }
  };

  const debouncedBlur = () => debounce(handleBlur, 500);

  return (
    <Dialog
      fullWidth
      maxWidth={'md'}
      open={Boolean(open)}
      onClose={onClose}
      title={'Generate Report'}
    >
      <Stack
        spacing={3}
        sx={{
          pt: 1,
        }}
      >
        <TextField
          fullWidth
          value={reportName}
          onChange={(event) => setReportName(event.target.value)}
          label={'Report Name'}
          onBlur={handleBlur}
          error={fileNameExistError}
          helperText={fileNameExistError && 'FileName already exist'}
        />

        <FormControl fullWidth>
          <InputLabel>{'Report Type'}</InputLabel>
          <Select<ReportTypeEnum>
            value={reportType}
            label={'Report Type'}
            onChange={handleReportTypeChange}
          >
            {reportTypeList?.map((item, index) => (
              <MenuItem value={item.value} key={index}>
                {item.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth>
          <InputLabel>{'Operator'}</InputLabel>
          <Select<string> value={collective} label={'Operator'} onChange={handleCollectiveChange}>
            {[{ id: 'all', name: 'All' }, ...data]?.map((item, index) => (
              <MenuItem value={item.id} key={index}>
                {item.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth>
          <InputLabel>{'Dates'}</InputLabel>
          <Select<DateRangeTypeEnum>
            value={dateRangeType}
            label={'Dates'}
            onChange={handleDateRangeTypeChange}
          >
            {dateRangeTypeList?.map((item, index) => (
              <MenuItem value={item.value} key={index}>
                {item.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <If value={dateRangeType === DateRangeTypeEnum.CUSTOM}>
          <CustomDateRangePicker
            onChange={setDateRange}
            start={dateRange.start}
            end={dateRange.end}
            isDatesValid={isDatesValid}
          />
        </If>

        <FormControl>
          <FormLabel>Status</FormLabel>
          <RadioGroup value={documentStatus} onChange={handleDocumentStatusChange}>
            {documentStatusList.map((item) => (
              <FormControlLabel
                value={item.value}
                control={<Radio />}
                label={item.label}
                key={item.value}
              />
            ))}
          </RadioGroup>
        </FormControl>

        <FormGroup>
          <FormControlLabel
            control={<Switch checked={isCustomField} onChange={handleToggleCustomFields} />}
            label='Custom Columns'
          />
        </FormGroup>
        <If value={isCustomField}>
          <FormControl
            required
            error={customFieldError}
            component='fieldset'
            sx={{ m: 3 }}
            variant='standard'
          >
            <FormLabel component='legend'>Pick at least two</FormLabel>

            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={Object.entries(fileFields).length === customFields.length}
                    onChange={() => {
                      if (Object.entries(fileFields).length === customFields.length) {
                        setCustomFields([]);
                        return;
                      }
                      setCustomFields(Object.keys(fileFields));
                    }}
                    name={'All'}
                  />
                }
                label={'All'}
                key={'all'}
              />
              {Object.entries(fileFields).map(([key, title]) => (
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={customFields.includes(key)}
                      onChange={() => handleCustomFieldSelection(key)}
                      name={title}
                    />
                  }
                  label={title}
                  key={key}
                />
              ))}
            </FormGroup>
            <If value={customFieldError}>
              <FormHelperText>Pick at least two</FormHelperText>
            </If>
          </FormControl>
        </If>

        <Stack direction='row' spacing={2} justifyContent='flex-start'>
          <Button variant='contained' onClick={handleSubmit} disabled={isDisabled}>
            Submit
          </Button>
          <Button onClick={onClose} variant='contained' color='secondary'>
            Cancel
          </Button>
        </Stack>
      </Stack>
    </Dialog>
  );
}

export default GenerateReportDialog;
