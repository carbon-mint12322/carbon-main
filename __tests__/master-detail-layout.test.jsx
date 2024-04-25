import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import { AppConfigContext } from '~/contexts/AppConfigContext';
import PageLayout from '~/components/Layout/PageLayout';

import MasterDetailLayout from '~/components/Main-Drawer-Layout';
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

const leftContentText = 'left content';
const rightContentText = 'right content';
const MainContent = () => <div>{leftContentText}</div>;
const DrawerContent = () => <div>{rightContentText}</div>;

const context = { pageConfig: { ...appconfig } };
const pageProps = {
  pageConfig: context.pageConfig,
  title: 'master-detail layout test',
};

describe('master/detail layout', () => {
  it('basic rendering + drawer should be closed by default', () => {
    // FarmerMasterDetail
    const wrapper = render(
      <AppConfigContext.Provider value={context}>
        <MasterDetailLayout MainContent={MainContent} DrawerContent={DrawerContent} />
      </AppConfigContext.Provider>,
    );
    const { queryByText, container: root } = wrapper;
    expect(queryByText(leftContentText)).toBeInTheDocument();
    expect(queryByText(rightContentText)).not.toBeInTheDocument();
    const leftDivs = root.querySelectorAll('.master > div');
    // expect(divs.length).toBe(1)
    const rightDivs = root.querySelectorAll('.drawer > div');
  });

  it('instantiate in open mode', () => {
    // FarmerMasterDetail
    const wrapper = render(
      <AppConfigContext.Provider value={context}>
        <MasterDetailLayout open={true} MainContent={MainContent} DrawerContent={DrawerContent} />
      </AppConfigContext.Provider>,
    );
    const { queryByText, getByText, container: root } = wrapper;
    //fwrapper.debug()

    //console.log(getByText(rightContentText))

    expect(queryByText(leftContentText)).toBeInTheDocument();
    expect(queryByText(rightContentText)).toBeInTheDocument();
    const leftDivs = root.querySelectorAll('.master > div');
    // expect(divs.length).toBe(1)
    const rightDivs = root.querySelectorAll('.drawer > div');
  });
});
