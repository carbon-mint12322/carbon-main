import React from 'react';
import { DatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import { Stack, Typography } from '@mui/material';

export default function CustomDateRangePicker({
  start,
  end,
  onChange,
  isDatesValid,
}: {
  start: Date | null;
  end: Date | null;
  onChange: ({ start, end }: { start: Date | null; end: Date | null }) => void;
  isDatesValid: boolean;
}) {
  const handleStartDateChange = (date: Date | null) => {
    if (end && dayjs(date!)?.isBefore(end)) {
      onChange({ start: date, end: null });
      return;
    }

    onChange({ start: date, end: null });
  };

  const handleEndDateChange = (date: Date | null) => {
    if (start && dayjs(date!)?.isAfter(start)) {
      onChange({ start: start, end: date });
      return;
    }
    onChange({ start: null, end: date });
  };

  return (
    <Stack direction='row' spacing={3}>
      <DatePicker
        label='Start Date'
        value={start}
        onChange={handleStartDateChange}
        slotProps={{
          textField: {
            error: !isDatesValid,
            helperText: !isDatesValid && 'Please add date',
          },
        }}
      />

      <DatePicker
        label='End Date'
        value={end}
        onChange={handleEndDateChange}
        slotProps={{
          textField: {
            error: !isDatesValid,
            helperText: !isDatesValid && 'Please add date',
          },
        }}
      />
    </Stack>
  );
}
