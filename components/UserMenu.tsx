import * as React from 'react';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import { getAuth } from '../utils/initAuth';
import { onAuthStateChanged } from 'firebase/auth';
import { useUser } from '~/contexts/AuthDialogContext';
import { ListItemText } from '@mui/material';
import { useOperator } from '~/contexts/OperatorContext';

export default function AccountMenu(props: any) {
  const [user, setUser] = React.useState<any>(undefined);
  const { agentData } = useOperator();
  const authCtx = useUser();
  const logout = async () => {
    await authCtx.logout();
    setUser(undefined);
  };
  const isLoggedIn = () => (user ? true : false);
  // React.useEffect(() => onAuthStateChanged(getAuth(), setUser), []);

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const userName =
    (user && user?.displayName) ||
    agentData?.personalDetails?.firstName + ' ' + (agentData?.personalDetails?.lastName || '');

  const photo = user && user?.photoURL;
  const name = agentData?.personalDetails?.firstName + ' ' + (agentData?.personalDetails?.lastName || '');
  const initials = name
    .split(' ')
    .map((part) => part.charAt(0))
    .join('');

  return (
    <React.Fragment>
      {/* <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}> */}
      <Tooltip title='Account settings'>
        <IconButton
          onClick={handleClick}
          size='small'
          sx={{ ml: 2, borderRadius: '10px' }}
          aria-controls={open ? 'account-menu' : undefined}
          aria-haspopup='true'
          aria-expanded={open ? 'true' : undefined}
        >
          {user && user?.photoURL && (
            <Avatar
              sx={{ width: 32, height: 32, bgcolor: 'iconColor.secondary' }}
              alt={
                agentData?.personalDetails?.firstName[0] +
                ' ' +
                agentData?.personalDetails?.lastName[0]
              }
              src={photo}
            />
          )}
          {user && !user?.photoURL && (
            <Avatar sx={{ width: 34, height: 34, bgcolor: 'iconColor.secondary' }}>
              {initials}
            </Avatar>
          )}

          <Box
            sx={{
              display: 'block',
              ml: 1.25,
              textAlign: 'start',
            }}
          >
            <Typography variant='caption' color='textSecondary'>
              Agent
            </Typography>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Typography variant='button' color='textPrimary'>
                {userName}
              </Typography>
              <KeyboardArrowDownIcon />
            </Box>
          </Box>
        </IconButton>
      </Tooltip>
      {/* </Box> */}
      <Menu
        anchorEl={anchorEl}
        id='account-menu'
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
            '& .MuiAvatar-root': {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem>
          <ListItemIcon>
            <Avatar
              sx={{ width: 32, height: 32, bgcolor: 'iconColor.secondary' }}
              alt={userName}
              src={photo}
            />
          </ListItemIcon>
          <ListItemText>{userName}</ListItemText>
        </MenuItem>
        {/* 
        <MenuItem>Dashboard</MenuItem>
        <MenuItem>Reports</MenuItem>
        <Divider />
        <MenuItem>
          <ListItemIcon>
            <Settings fontSize='small' />
          </ListItemIcon>
          Settings
        </MenuItem> */}
        <MenuItem
          onClick={logout}
          sx={{
            color: 'error.main',
          }}
        >
          <ListItemIcon>
            <PowerSettingsNewIcon fontSize='small' color='error' />
          </ListItemIcon>
          <ListItemText>Logout</ListItemText>
        </MenuItem>
      </Menu>
    </React.Fragment>
  );
}
