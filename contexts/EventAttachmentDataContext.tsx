import { ReactNode, createContext, useContext } from 'react';

import useFetch from 'hooks/useFetch';
import { useOperator } from './OperatorContext';

interface EventAttachmentDataContextProps<T = any> {
  eventAttachmentData: T[];
  loading?: boolean;
}

interface EventAttachmentDataContextProviderProps<T> {
  children: ReactNode;
  url: string;
  attachmentData?: T[];
}

const EventAttachmentDataDefaultValues: EventAttachmentDataContextProps = {
  eventAttachmentData: [],
  loading: false,
};

const EventAttachmentDataContext = createContext<EventAttachmentDataContextProps>(
  EventAttachmentDataDefaultValues,
);

function Provider<T = any>({ children, url, attachmentData }: EventAttachmentDataContextProviderProps<T>) {
  const { getAPIPrefix } = useOperator();

  const { isLoading: loading, data } = useFetch<T[]>(`${getAPIPrefix()}${url}`);

  const exposed: EventAttachmentDataContextProps = {
    eventAttachmentData: attachmentData || data || [],
    loading: loading,
  };

  return (
    <EventAttachmentDataContext.Provider value={exposed}>
      {children}
    </EventAttachmentDataContext.Provider>
  );
}

export const useEventAttachmentData = () => useContext(EventAttachmentDataContext);

export default Provider;
