import { State } from '~/backendlib/workflow/types';

export function historyStateLabel(state: State) {
  if (!state) {
    return 'Not submitted';
  }
  switch (state.name) {
    case 'validated':
      return 'Validated';
    case 'validateFailed':
      return 'Validation Failed';
    case 'reviewFailed':
      return 'Review Failed';
    case 'waitingForReview':
      return 'Submitted for Review';
    case 'waitingForValidation':
      return 'Review completed, Submitted for Validation';
    case 'editable':
      return 'Created/Updated on';
    default:
      return state.name;
  }
}
