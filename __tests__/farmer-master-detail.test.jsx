import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import FarmerMasterDetail from '~/gen/data-views/FarmerMasterDetail.rtml';
import { AppConfigContext } from '~/contexts/AppConfigContext';
const appconfig = require('../static/appconfig');

const mockData = [
  {
    id: 1,
    firstName: 'me',
    lastName: 'my lastname',
    phone: '1234567890',
  },
  {
    id: 2,
    firstName: 'her',
    lastName: 'her lastname',
    phone: '1234567891',
  },
];

describe('farmers page', () => {
  it('master-detail rendering', () => {
    const context = { pageConfig: { ...appconfig } };
    const pageProps = {
      pageConfig: context.pageConfig,
      title: 'jest farmers page title',
    };
    const wrapper = render(
      <AppConfigContext.Provider value={context}>
        <FarmerMasterDetail data={data} />
      </AppConfigContext.Provider>,
    );
    const { container: root } = wrapper;

    wrapper.debug();
  });
});
