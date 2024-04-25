import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import PageLayout from '~/components/Layout/PageLayout';
import { AppConfigContext } from '~/contexts/AppConfigContext';
const appconfig = require('../static/appconfig');

describe('page layout', () => {
  it('rendering', () => {
    const Content = () => <div>this is content from jest test case </div>;
    const context = { pageConfig: { ...appconfig } };
    const pageProps = {
      pageConfig: context.pageConfig,
      title: 'jest test title',
    };
    const wrapper = render(
      <AppConfigContext.Provider value={context}>
        <PageLayout Content={Content} pageProps={pageProps} />
      </AppConfigContext.Provider>,
    );
    const { container: root } = wrapper;

    const titlediv = root.querySelectorAll('#title-div');
    expect(titlediv).toHaveLength(1);
    expect(titlediv[0].innerHTML.trim()).toBe(pageProps.title);
    //wrapper.debug()
  });
});
