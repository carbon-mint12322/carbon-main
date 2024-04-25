import {
  createContext,
  useEffect,
  useState,
  useContext,
  useMemo,
  ReactNode,
  useCallback,
} from 'react';
import { useRouter } from 'next/router';
import CircularLoader from '~/components/common/CircularLoader';
import useLazyFetch from 'hooks/useLazyFetch';
import { UserInfo } from 'firebase/auth';
import { useUser } from './AuthDialogContext';
import { getMenuItems } from '~/static/app-config';

export interface IRoleObj {
  [key: string]: string[];
}
export interface AgentData {
  _id: string;
  personalDetails: PersonalDetails;
  agentId: string;
  collectives: Collective[];
  id: string;
  roles: IRoleObj;
  userId: string;
}

export interface Collective {
  _id: string;
  name: string;
  category?: string;
  address?: Address;
  slug: string;
  id: string;
}

export interface Address {
  village: string;
}

export interface PersonalDetails {
  firstName: string;
  lastName: string;
  email: string;
  primaryPhone: string;
}

interface OperatorContextProps {
  agentData?: AgentData;
  operator?: Collective;
  setOperator: (_data: Collective) => void;
  loading: boolean;
  changeRoute: (url: string) => void;
  getAPIPrefix: () => string | null;
  baseURl: string;
  getApiUrl: (url: string) => string;
}

const operatorContextDefaultValues: OperatorContextProps = {
  agentData: undefined,
  operator: undefined,
  setOperator: () => null,
  loading: true,
  changeRoute: () => null,
  getAPIPrefix: () => null,
  baseURl: `/private/farmbook/:org`,
  getApiUrl: () => '',
};

const OperatorContext = createContext<OperatorContextProps>(operatorContextDefaultValues);

export interface ProviderProps {
  children: ReactNode | JSX.Element;
  loading?: boolean;
  data?: AgentData;
  user?: UserInfo[] | null;
}

const Provider = ({ children }: ProviderProps) => {
  const [pageLoading, setPageLoading] = useState<boolean>(false);
  const [operator, setOperator] = useState<Collective>();
  const [agentData, setAgentData] = useState<AgentData>();
  const { user } = useUser();

  const router = useRouter();
  const { isLoading: loading, data, fetch } = useLazyFetch<AgentData>('/api/farmbook/agent/get');

  const baseURl: string = useMemo(() => `/private/farmbook/${operator?.slug}`, [operator]);

  const handleUpdateOperator = (_data: Collective) => {
    setOperator(_data);
    // Temporary fix to redirect user to dashboard on operator change
    // TODO: need some debuging
    router.push(`/private/farmbook/${_data?.slug}${getMenuItems().home.href}`);
  };

  useEffect(() => {
    if (user && !agentData) {
      fetch();
    }
  }, [user]);

  useEffect(() => {
    if (data && !agentData) {
      setAgentData(data);
    }
  }, [data, agentData]);

  useEffect(() => {
    if (data && !operator) {
      const selectedOperator = data?.collectives?.filter(
        (item: Collective) => item?.slug === router?.query?.org,
      );
      if (!router?.query?.org) {
        handleInitialPage(selectedOperator[0] || data?.collectives?.[0]);
      }
      setOperator(selectedOperator[0] || data?.collectives?.[0]);
    }
  }, [data]);

  useEffect(() => {
    if (!router?.query?.org) {
      setPageLoading(true);
      const selectedOperator = data?.collectives?.filter(
        (item: Collective) => item?.slug === router?.query?.org,
      );
      if (selectedOperator?.[0] || data?.collectives?.[0]) {
        handleInitialPage(selectedOperator?.[0] || data?.collectives?.[0]);
      }
      setPageLoading(false);
    }
  }, [router]);

  const changeRoute = useCallback(
    (_route: string) => {
      router.push(`${baseURl}${_route}`);
    },
    [baseURl],
  );

  const getAPIPrefix = useCallback(() => {
    return `/api/farmbook/${operator?.slug}`;
  }, [operator?.slug]);

  const getApiUrl = useCallback(
    (_route: string) => {
      return `/api/farmbook/${operator?.slug}${_route}`;
    },
    [operator?.slug],
  );

  const handleInitialPage = async (_data?: Collective) => {
    if (!router?.query?.org && _data) {
      const regex = /^\/private\/farmbook(.*)$/i;
      const path = router.asPath;
      const matches = path.match(regex);
      if (matches) {
        router.replace(`/private/farmbook/${_data?.slug}${matches?.[1] || getMenuItems().home.href}`);
        setPageLoading(false);
      }
      setPageLoading(false);
    }
  };

  const exposed: OperatorContextProps = {
    agentData: agentData,
    operator: operator,
    setOperator: handleUpdateOperator,
    loading: loading,
    changeRoute: changeRoute,
    getAPIPrefix: getAPIPrefix,
    baseURl: baseURl,
    getApiUrl: getApiUrl,
  };

  return (
    <CircularLoader value={loading || !operator || pageLoading || !user}>
      <OperatorContext.Provider value={exposed}>{children}</OperatorContext.Provider>
    </CircularLoader>
  );
};

export const useOperator = () => useContext(OperatorContext);

export default Provider;