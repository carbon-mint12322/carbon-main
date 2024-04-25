/**
 * A selector widget to be used with ReactJsonSchemaForm for selecting
 * "foreign" objects.  For example, selection of a farmer to add to a
 * land parcel. Or a photo to an event.
 */
import { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import Select from '@mui/material/Select';

import { foreignSchemaRQ } from '~/frontendlib/model-lib/crudRQ';
import MenuItem from '@mui/material/MenuItem';

function SelectorDropdownWidget(props) {
  const [index, setIndex] = useState(0);
  const { foreignSchemaId, loadingWidget, queryFilter, queryOptions, render, select } = props;

  const { isLoading, isError, isFetching, data } = foreignSchemaRQ(
    foreignSchemaId,
    queryFilter,
    queryOptions,
  );

  if (isFetching) {
    return <span> Loading... </span>;
  }
  if (isError) {
    return <span> Error fetching data </span>;
  }
  const objects = data;

  if (objects.length === 0) {
    return <span>No data to select</span>;
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const handleChange = useCallback(
    (evt) => {
      const index = evt.target.value;
      setIndex(index);
      select(objects[index]);
    },
    [objects],
  );

  // TODO - how do we call select on the first object (i.e. index 0)

  const menuItems = objects.map((obj, i) => (
    <MenuItem key={i} value={i}>
      {render(obj)}
    </MenuItem>
  ));

  return (
    <Select value={index} label={`Selector`} onChange={handleChange}>
      {menuItems}
    </Select>
  );
}

SelectorDropdownWidget.propTypes = {
  // schema ID that we'll be selecting from
  foreignSchemaId: PropTypes.string,
  // a filtering function to be passed to DB query
  getFilter: PropTypes.func,
  // function that creates a user-readable rendering of an object
  render: PropTypes.func,
  // callback to tell the parent about object selection
  select: PropTypes.func,
};

const nameRender = (object) => <span> {object.name} </span>;

export default SelectorDropdownWidget;
