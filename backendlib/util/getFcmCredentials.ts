import { ServiceAccount } from 'firebase-admin';
import { getFirebaseCredentials } from '../middleware/verify-token';

export function getFcmCredentials(): Required<ServiceAccount> {
  const { project_id, private_key, client_email } = getFirebaseCredentials();

  return {
    projectId: project_id as string,
    privateKey: private_key as string,
    clientEmail: client_email as string,
  };
}
