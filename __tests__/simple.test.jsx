import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

describe('basic', () => {
  it('div', () => {
    const wrapper = render(
      <div id='wrapper'>
        <div id='myid'> hello world </div>
      </div>,
    );
    const { container: root } = wrapper;
    const divs = root.querySelectorAll('div');
    expect(divs).toHaveLength(2);
    const divs2 = root.querySelectorAll('div > #myid');
    expect(divs2).toHaveLength(1);
    //wrapper.debug()
  });
});
