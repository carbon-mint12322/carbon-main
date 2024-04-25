import React from 'react';

import Box from '@mui/material/Box';
import If from '~/components/lib/If';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import RemoveRedEyeOutlined from '@mui/icons-material/RemoveRedEyeOutlined';
import DeleteOutlined from '@mui/icons-material/DeleteOutlined';
import MoreVert from '@mui/icons-material/MoreVert';
import Search from '@mui/icons-material/Search';
import InputBase from '@mui/material/InputBase';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Avatar from '~/components/lib/DataDisplay/Avatar';
import { Chip, Tooltip } from '@mui/material';
import { toCamelCase } from '~/components/lib/toCamelCase';
import SplitButton from './SplitButton';


const PlainText = ({ text }) => text;


function TitleBar(props) {
  return (
    <Box component={'div'} sx={props.titleBarStyle}>
      <Box component={'div'} sx={props.titleBarStyle}>
        <If value={props.titleBarData?.isAvatarIconPresent}>
          <Avatar
            name={props.titleBarData?.avatarIcon}
            src={props.titleBarData?.url}
            sx={props.avatarIconStyle}
          />
        </If>
        <If value={props.titleBarData?.isTitleIconPresent}>
          <Box sx={props.titleBarImgBgStyle} />
        </If>
        <Box component={'div'}>
          <If value={props.titleBarData?.isTitlePresent}>
            <Box sx={props.titleBtnStyle}>
              <Typography variant={'h5'}>
                <PlainText text={props.titleBarData?.title} />
              </Typography>
              <If value={props.titleBarData?.isTitleBtnPresent}>
                <Chip
                  label={props.titleBarData?.titleBtnText}
                  color={props.titleBarData?.titleButtonColor}
                />
              </If>
            </Box>
          </If>
          <If value={props.titleBarData?.isSubTitlePresent}>
            <Typography
              id={
                props?.titleBarData?.title == !"Landparcel"
                  ? toCamelCase(props?.titleBarData?.title, 'LengthButton')
                  : null
              }
              variant={'subtitle2'}
              sx={props.subTextStyle}
            >
              <PlainText text={props.titleBarData?.subTitle} />
            </Typography>
          </If>
        </Box>
      </Box>
      <Box component={'div'} sx={props.titleBarRightStyle}>
        <If value={props.titleBarData?.isUploadBtnPresent}>
          <Button variant={'contained'} color={'grey'} sx={props.h100} component={'label'}>
            <PlainText text={'Upload from your system'} />
            <input type={'file'} hidden={true} onChange={props.handleUploadBtnClick} />
          </Button>
        </If>
        <If value={props.titleBarData?.isViewDeleteBtnsPresent}>
          {/*<IconButton variant={'contained'} color={'white'} sx={props.viewDeleteIconBtnStyle}>*/}
          {/*  <RemoveRedEyeOutlined color={'info'} />*/}
          {/*</IconButton>*/}
          <IconButton variant={'contained'} color={'white'} sx={props.viewDeleteIconBtnStyle} onClick={props.handleDeleteBtnClick}>
            <DeleteOutlined color={'error'} />
          </IconButton>
        </If>
        <If value={props.titleBarData?.isMoreIconPresent}>
          <MoreVert color={'gray'} />
        </If>
        <If value={props.titleBarData?.isSearchBarPresent}>
          <Box component={'span'} sx={props.searchFieldStyle}>
            <Search fontSize={'16px'} />
            <InputBase
              id='searchButton'
              placeholder={'Search'}
              fontSize={'16px'}
              onChange={props.handleSearchBarData}
              value={props.searchText}
              sx={props.searchBarInputBaseStyles}
            />
          </Box>
        </If>
        <If value={props.titleBarData?.isSubBtnPresent}>
          <SplitButton
            mainButtonLabel={props.titleBarData?.subBtnTitle}
            disabled={props.titleBarData?.subBtnDisabled}
            mainButtonOperation={props.handleSubBtnClick}
            color={props.titleBarData?.subBtnColor}
            id={toCamelCase(props?.titleBarData?.subBtnTitle, 'Button')}
            options={props?.titleBarData?.mainBtnOptions}
          />
        </If>
        <If value={props.titleBarData?.isMainBtnPresent}>
          <Button
            className='hover_text'
            variant={'contained'}
            onClick={props.handleMainBtnClick}
            sx={props.h100}
            id={toCamelCase(props?.titleBarData?.subBtnTitle, 'Button')}
          >
            <PlainText text={props.titleBarData?.mainBtnTitle} />
          </Button>

        </If>
        <If value={props.titleBarData?.isselectOperatorPresent}>
          <FormControl variant={'filled'}>
            <Select
              disableUnderline={true}
              displayEmpty={true}
              IconComponent={props.KeyboardArrowDownIcon}
              value={props.titleBarData?.selectedOperator}
              onChange={props.handleOporatorSelect}
              sx={props.selectOporatorStyle}
            >
              <MenuItem value={'Current Operator'}>
                <PlainText text={'Current Operator'} />
              </MenuItem>
              <MenuItem value={'All Operators'}>
                <PlainText text={'All Operators'} />
              </MenuItem>
            </Select>
          </FormControl>
        </If>
      </Box>
    </Box>
  );
}

export default TitleBar;
