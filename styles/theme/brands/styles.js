const styles = {
  compWidth: {
    width: 600,
  },
  userMenuStyle: {
    position: 'absolute',
    top: 80,
    right: 64,
  },
  collapedStyle: {
    opacity: 0,
  },
  expandedStyle: {
    opacity: 1,
  },
  bodyPaperLayout: {
    background: (theme) => theme.palette.white.dark,

    paddingTop: '20px',
    paddingBottom: '20px',
    paddingLeft: { xs: '28px', md: '60px' },
    paddingRight: { xs: '28px', md: '60px' },
    minHeight: '100vh',
  },

  addBtnBox: {
    display: 'flex',
    flexDirection: 'column',
    padding: 2,
  },
  appbarStyles: {
    direction: 'row',
    justifyContent: 'space-between',
  },
  logoStyles: {
    position: 'relative',
    left: '-15px',
    top: '3px',
    marginLeft: 0,
    paddingLeft: 0,
    '& img': {
      width: '120px !important',
    },
  },
  textDecorationNone: {
    textDecoration: 'none',
  },

  breadCrumb: {
    marginTop: '64px',
    fontSize: '20px',
    fontWeight: 550,
  },
  linkColor: {
    color: (theme) => theme.palette.text.secondary,
  },
  activeLinkColor: {
    color: '#000000',
  },

  dataGridLayer: {
    height: `calc(100vh - 220px)`,
    width: '100%',
  },
  datagridSx: {
    '& .disabled-row': {
      background: (theme) => `${theme.palette.action.disabledBackground}`,
      '&:hover': {
        background: (theme) => `${theme.palette.action.disabledBackground} !important`,
      },
    },

    borderRadius: '8px',
    '& .MuiDataGrid-virtualScrollerRenderZone': {
      '& .MuiDataGrid-row': {
        fontSize: 15,
        boxSizing: 'border-box',
        border: '1px solid #F2F2F2',
        '& .Mui-selected': {
          backgroundColor: (theme) => `${theme.palette.primary.main}30`,
        },
      },
      '& .MuiDataGrid-row.Mui-selected': {
        backgroundColor: (theme) => `${theme.palette.primary.main}30`,
      },
      '& .MuiDataGrid-row.Mui-selected:hover': {
        backgroundColor: (theme) => `${theme.palette.primary.main}20`,
      },
    },
    '.MuiDataGrid-columnHeader': {
      border: 'unset',
      borderBottom: '1px solid rgba(224, 224, 224, 1)',
      '&:focus': {
        outline: 'none',
      },
    },
    '& .MuiDataGrid-columnHeaders': {
      color: (theme) => theme.palette.text.secondary,
      fontSize: 14,
      maxHeight: '46px !important',
      lineHeight: 46,
      fontWeight: '600 !important',
      border: 'unset',
      borderBottom: '1px solid rgba(224, 224, 224, 1)',
      borderRadius: 0,
      '&:focus': {
        outline: 'none',
      },
      '&:focus-within': {
        outline: 'none',
      },
    },
    '& .MuiDataGrid-columnHeader:focus-within': {
      outline: 'none',
    },
    '& .MuiDataGrid-cell:focus-within': {
      outline: 'none',
    },
    '& .MuiDataGrid-checkboxInput': {
      color: (theme) => theme.palette.white.dark,
    },
    '& .MuiDataGrid-checkboxInput:hover': {
      background: 'inherit',
    },
    '& .MuiDataGrid-cell': {
      height: 90,
      borderBottom: 'none',
      '&:focus': {
        outline: 'none',
      },
      '.MuiChip-root': {
        background: (theme) => `${theme.palette.primary.main}0f`,
        color: (theme) => theme.palette.primary.main,
        padding: '8px 10px',
        borderRadius: 4,
        fontSize: 14,
        '&:hover': {
          backgroundColor: (theme) => theme.palette.common.white,
        },
      },
    },
    '& .MuiDataGrid-row:hover': {
      background: (theme) => `${theme.palette.primary.main}20`,
    },
    '& .MuiDataGrid-row': {
      cursor: 'pointer',
    },
  },
  dropdownStyles: {
    border: 0,
    minWidth: 180,
  },
  labelStyle: {
    position: 'relative',
    left: '0px',
    color: (theme) => theme.palette.text.secondary,
  },
  flex: {
    display: 'flex',
    direction: 'row',
  },
  itemCenter: {
    display: 'flex',
    justifyContent: 'center',
  },
  actionStyle: {
    color: '#999',
  },

  subHeading: {
    color: '#000 !important',
    fontWeight: 'bold',
  },
  formFields: {
    '& .MuiTypography-root': {
      fontSize: '16px',
      paddingLeft: '2px',
    },
    '& h5': {
      fontSize: '24px !important',
      color: '#000 !important',
    },
    '& .MuiInputLabel-root': {},
    '& .MuiOutlinedInput-root': {
      background: (theme) => theme.palette.common.white,
      borderRadius: 1,
      '&:hover': {
        borderColor: (theme) => theme.palette.common.white,
      },
      '& .MuiOutlinedInput-notchedOutline': {
        border: '2px solid #EEEEEE',
        '&:hover': {
          borderColor: (theme) => theme.palette.common.white,
        },
      },
    },
    '& .array-item-add': {
      backgroundColor: (theme) => theme.palette.primary.main,
      color: (theme) => theme.palette.common.white,
      '& .MuiSvgIcon-root': {
        display: 'none !important',
      },
      '&:hover': {
        backgroundColor: (theme) => theme.palette.primary.dark,
      },
    },
    '& .MuiPaper-elevation2': {
      boxShadow: 'none',
    },
  },

  filterStyles: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0px 20px 8px 40px',
  },
  searchIcon: {
    fontSize: 16,
  },
  listItemAvatar: {
    boxShadow: 'inset 0px -1px 3px #3F3F3F',
    borderRadius: '5px',
    height: 56,
    width: 56,
  },
  selectControl: {
    m: 1,
    minWidth: 120,
  },
  searchFieldStyle: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: 8,
    gap: '8px',
    padding: '0px 8px',
    borderRadius: '8px',
    height: '37px',
    maxWidth: '100px',
    marginTop: '16px',
  },
  muiSelectNativeInput: {
    top: '-4px',
    '&::before': {
      borderBottom: 0,
    },
  },
  modalTitleStyle: {
    m: 0,
    p: 2,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  oPBtn: {
    color: (theme) => theme.palette.common.black,
    '&:hover': {
      background: (theme) => theme.palette.common.white,
    },
  },

  cardView: {
    position: 'relative',
    borderRadius: 0,
    padding: 1,
    boxShadow: '1px 1px 5px rgba(0, 0, 0, 0.05)',
    border: '1px solid #efefef',
    '& .MuiCardContent-root:last-child': {
      paddingBottom: 0,
    },
    cursor: 'pointer',
  },
  audio: {
    display: 'flex',
    height: '180px',
    alignItems: 'center',
    backgroundColor: (theme) => `${theme.palette.primary.main}30`,
    padding: '0 5px',
  },
  pdf: {
    display: 'flex',
    height: '180px',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '40px !important',
    backgroundColor: '#F8F8F8',
    padding: '0 5px',
  },
  title: {
    padding: '14px 0 0 0',
    fontSize: '14px',
    color: (theme) => theme.palette.dark.light,
  },
  caption: {
    color: (theme) => theme.palette.text.secondary,
    padding: 0,
    margin: 0,
  },
  textCenter: {
    textAlign: 'center',
  },
  noFSize: {
    fontSize: 38,
  },
  noFButton: {
    width: 32,
    height: 32,
  },
  borderTopContainer: {
    borderTop: '1px solid rgba(196, 196, 196, 0.6)',
    marginTop: '24px',
  },
  dayTitle: {
    fontSize: '0.875rem',
    marginBottom: 2,
  },
  rightDrawer: (parentRef) => ({
    width: parentRef?.current?.clientWidth || '900px',
    paddingTop: '10px',
    '& .MuiDrawer-paper': {
      height: 'auto',
      border: 'none',
      maxHeight: '360px',
      top: 'calc(50% - 250px)',
      width: parentRef?.current?.clientWidth || '900px',
      borderTopLeftRadius: '8px',
      borderBottomLeftRadius: '8px',
    },
  }),
};

export default styles;
