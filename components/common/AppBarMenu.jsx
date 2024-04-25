import React from 'react';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';
import OperatorModal from '~/components/ui/OperatorModal';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import CircleNotifications from '@mui/icons-material/CircleNotifications';
import UserMenu from '~/components/UserMenu';
import { AppConfigContext } from '~/contexts/AppConfigContext';
import { Tooltip } from '@mui/material';
const PlainText = ({ text }) => text;

function AppBarMenu(props) {
  const pageCtx = React.useContext(AppConfigContext);

  return (
    <Toolbar sx={props.appbarStyles}>
      <Box sx={props.logoStyles}>
        <img src={props.src} alt={'logo'} />
      </Box>
      <Box className='left_side_bar' sx={props.flex}>
        <Box component={'p'} sx={props.labelStyle}>
          <PlainText text={'Operator'} />
        </Box>
        <OperatorModal
          headerTitle={'Change Operator'}
          handleClickOpen={props.handleClickOpen}
          label={props.label}
          operatorItems={props.operatorItems}
          openModal={props.openModal}
          closeModal={props.handleOnCloseModal}
          handleChangeOperator={props.handleChangeOperator}
          isLocation={true}
          isFilter={true}
          isSearch={true}
          styles={props.styles}
        />
      </Box>
      <Box>
        <IconButton
          size={'large'}
          aria-label={'show 17 new notifications'}
          color={'inherit'}
          sx={props.styles.noFButton}
          onClick={props.toggleNotification}
        >
          <Badge
            color={'primary'}
            badgeContent={0}
            overlap={'circular'}
            variant={'dot'}
            showZero={true}
          >
            <Tooltip title='Notification'>
              <CircleNotifications color={'primary'} sx={props.styles.noFSize} />
            </Tooltip>
          </Badge>
        </IconButton>
        <UserMenu />
      </Box>
    </Toolbar>
  );
}

export default AppBarMenu;
