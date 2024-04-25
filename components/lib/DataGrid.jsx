import { path as ramdaPath } from 'ramda';
import { useState, useContext, useEffect } from 'react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import { MasterDetailContext } from '~/contexts/MasterDetailContext';

import MuiLink from '@mui/material/Link';

const defaultOptions = {
  sx: { height: 600, width: '100%' },
  //pageSize: 10,
};

const Loading = () => <div> Loading... </div>;

// Function to get a value from a nested column
// field spec (e.g. a.b.c)
const subObjValueGetter =
  (columnSpec) =>
  ({ row }) =>
    ramdaPath(columnSpec.field.split('.'))(row);

const Table = (props) => {
  const [isLoading, setIsLoading] = useState(true);
  const [DataGrid, setDataGrid] = useState(Loading);
  const router = useRouter(); // to navigate to detail page

  const { data, dataGridOptions, onRowClick, onRowDoubleClick, addNew, detailPage, ...otherProps } =
    props;

  const mdctx = useContext(MasterDetailContext);

  // default is true
  const masterDetailMode = otherProps.masterDetailMode == false ? false : true;

  // Check to see if a detail page link has been specified in
  // view props
  const hasDetailPageLinkColumn = () =>
    dataGridOptions.columns.find((coldef) => /^link.*/.test(coldef.type)) ? true : false;

  const rowClickNoop = (row, event) => {};
  const onRowClick2 = onRowClick ? onRowClick : rowClickNoop;

  const addNewNoop = () => {};
  const addNew2 = addNew ? addNew : addNewNoop;

  const defaultDoubleClick = (
    row, // GridRowParams
    event, // MuiEvent<React.MouseEvent<HTMLElement>>
    details, // GridCallbackDetails
  ) => {
    if (!detailPage) {
      return;
    }
    router.push(`${detailPage + '/' + row.id}`);
  };
  const onRowDoubleClick2 = onRowDoubleClick ? onRowDoubleClick : defaultDoubleClick;

  // Hook subscription (only available inside the scope of the grid)
  //useGridApiEventHandler('rowDoubleClick', handleEvent);

  // Component prop (available on DataGrid, DataGridPro, DataGridPremium)
  // <DataGrid
  //  onRowDoubleClick={handleEvent}
  //  {...other}
  // />

  useEffect(() => {
    import('@mui/x-data-grid').then(({ DataGrid }) => {
      setDataGrid(DataGrid);
      setIsLoading(false);
    });
  });

  if (isLoading) {
    return <Loading />;
  }

  const linkRenderer = (coldef) =>
    function LinkRenderer(params) {
      const [_, linkRoot] = coldef.type.split(':');
      if (!linkRoot) {
        console.error('Pass URL mount point for the link in column definition');
        return '' + params.value;
      }
      const href = `${linkRoot}/${params.value}`;
      return (
        <MuiLink href={href}>
          <a>Details</a>
        </MuiLink>
      );
    };

  // inject value getter for nested values
  const columns = dataGridOptions.columns.map((def) => ({
    valueGetter: subObjValueGetter(def),
    renderCell: /^link.*/.test(def.type) ? linkRenderer(def) : null,
    ...def,
  }));

  return (
    <>
      <DataGrid
        onRowClick={onRowClick2}
        onRowDoubleClick={onRowDoubleClick2}
        {...defaultOptions}
        {...dataGridOptions}
        {...otherProps}
        columns={columns}
        rows={data || []}
      />
      {/* { mdctx.open ? null :
      <FloatingAdd onClick={addNew}/>
    } */}
    </>
  );
};

const fabStyle = {
  position: 'absolute',
  bottom: 64,
  right: 64,
};
const FloatingAdd = (props) => (
  <Fab {...props} sx={fabStyle} aria-label={'New'} color='primary'>
    <AddIcon />
  </Fab>
);

export default Table;
