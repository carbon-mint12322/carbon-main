import { render, screen } from '@testing-library/react';
import { AppConfigContext } from '~/contexts/AppConfigContext';
import PageLayout from '~/components/Layout/PageLayout';
import FarmerDataGrid from '~/gen/data-views/FarmerDataGrid.rtml';

import '@testing-library/jest-dom';

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

describe('Farmer data grid', () => {
  it('basic rendering', () => {
    const context = {};
    const pageProps = {};
    const wrapper = render(<FarmerDataGrid data={mockData} />);

    const { container: root } = wrapper;
    const divs = root.querySelectorAll('.MuiDataGrid-cell .MuiDataGrid-cellContent');
    expect(divs).toHaveLength(6);
    expect(divs[0].innerHTML).toBe(mockData[0].firstName);
    expect(divs[1].innerHTML).toBe(mockData[0].lastName);
    expect(divs[2].innerHTML).toBe(mockData[0].phone);

    expect(divs[3].innerHTML).toBe(mockData[1].firstName);
    expect(divs[4].innerHTML).toBe(mockData[1].lastName);
    expect(divs[5].innerHTML).toBe(mockData[1].phone);
    //wrapper.debug()
  });
});
