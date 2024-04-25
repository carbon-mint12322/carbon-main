import { stringDateFormatter } from '~/utils/dateFormatter';

const render = (reFetch: any) => (data: any) =>
    data?.row?.recentEvent?.createdAt ? stringDateFormatter(data?.row?.recentEvent?.createdAt) : '';

export default render;

