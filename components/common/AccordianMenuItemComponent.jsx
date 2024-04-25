import Loop from '~/components/lib/Loop';
import List from '@mui/material/List';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import { Typography, useTheme } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FenceOutlinedIcon from '@mui/icons-material/FenceOutlined';
import LayersOutlinedIcon from '@mui/icons-material/LayersOutlined';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import AdminPanelSettingsOutlinedIcon from '@mui/icons-material/AdminPanelSettingsOutlined';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import { Tooltip } from '@mui/material';
import { useOperator } from '~/contexts/OperatorContext';

function AccordianMenuItemComponent(props) {
  const { changeRoute } = useOperator();
  const theme = useTheme();

  const customStyle = {
    padding: props.open ? '8px 16px 8px 24px' : '8px 16px 8px 9px'
  }

  return (
    <Accordion className="accordionMenuItem" sx={{ padding: props.open ? '8px 0': '0', margin: '0 !important', justifyContent: 'flex-start',boxShadow: 'none',borderRadius:'0 !important',borderCollapse:'collapse !important' }}>
      <Tooltip title={props.open ? '' : props.title} placement='right'>
        <AccordionSummary
          sx={{
            backgroundColor: props.open ? 'inherit' : theme.palette.primary.main,
            paddingRight: '0',
            justifyContent: 'flex-start',
            padding: props.open ? '': '10px 0 10px 18px',
            margin: props.open ? '0 0 0 1rem' : '0'
          }}
          expandIcon={
            <ExpandMoreIcon
              sx={{
                background: 'rgba(0,0,0,0.1)',
                borderRadius : '50%',
                fontSize: '15px',
                transform: 'scale(1.5)',
                margin: props.open ? '0 6px' :'0 3px 0 0'
              }}
              color={props.open ? 'inherit' : 'white'}
            />
          }
          aria-controls='panel1a-content'
          id='panel1a-header'
          box-shadow='unset'
        >
          <props.Icon
            color={props.open ? 'inherit' : 'white'}
            sx={{ alignSelf: 'flex-start' }}
            onClick={() => changeRoute(props.href)}
          />
          {props.open && (
            <Typography
              sx={{ color: '#454545', paddingLeft: '20px', alignSelf: 'flex-end', margin: '0 0.75rem 0 0' }}
              onClick={() => changeRoute(props.href)}
            >
              {props.title}
            </Typography>
          )}
        </AccordionSummary>
      </Tooltip>
      <AccordionDetails
        sx={{
          padding: '0',
          margin: 0,
          backgroundColor: props.open ? 'inherit' : theme.palette.primary.main,
        }}
      >
        <List sx={customStyle}>
          <Loop mappable={props.menuItems} Component={props.MenuItemComponent} />
        </List>
      </AccordionDetails>
    </Accordion>
  );
}

export default AccordianMenuItemComponent;
