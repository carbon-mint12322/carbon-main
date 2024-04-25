import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import {useAlert} from "~/contexts/AlertContext";

export default function MutationWrapper({ mutation, type = 'create', children }: any) {
  const { openToast } = useAlert();
  const {
    isLoading: isSubmitting,
    isError,
    isSuccess: isSubmitSuccess,
    error: submitError,
  } = mutation;
  let submittingMessage = 'Submitting...';
  let successMessage = 'Submitted successfully!';
  switch(type){
    case 'update':
      submittingMessage = 'Updating...';
      successMessage = 'Updated successfully!';
      break;
    case 'delete':
      submittingMessage = 'Deleting...';
      successMessage = 'Deleted successfully!';
      break;
    default:
      break;
  }

  // TODO: Styling
  return (
    <Stack>
      {isSubmitting && openToast('info', submittingMessage)}
      {/* TODO: add close buttons to alerts */}
      {isError && openToast('error', submitError?.message || submitError)}
      {isSubmitSuccess && openToast('success', successMessage)}
      {children}
    </Stack>
  );
}
