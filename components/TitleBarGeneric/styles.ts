import { Theme } from '@mui/material';


// TitleBar Styles
export const titleBarRightStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '14px',
    height: '40px',
};

export const titleBarStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '14px',
    padding: '8px 0px',
};

export const titleBtnStyle = ({ isTitleBtnPresent }: { isTitleBtnPresent: boolean }) => {
    return {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '16px',
        paddingBottom: isTitleBtnPresent ? '9px' : 'unset',
    }
};

export const subTextStyle = { color: 'text.disabled' };

export const searchFieldStyle = {
    ...titleBarStyle,
    gap: '8px',
    border: (theme: Theme) => `2px solid ${theme.palette.grey[300]}`,
    padding: '0px 8px',
    borderRadius: '8px',
    height: '100%',
    maxWidth: '185px',
};

export const searchBarInputBaseStyles = {
    paddingTop: '5px',
};
export const h100 = {
    height: '100%',
};
export const titleBarImgBgStyle = ({ titleIcon }: { titleIcon: string }) => {
    return {
        width: '48px',
        height: '48px',
        backgroundImage: `url(${titleIcon})`,
    }
};

export const viewDeleteIconBtnStyle = {
    height: '100%',
    borderRadius: '21%',
    bgcolor: 'common.white',
};

export const selectOporatorStyle = {
    boxShadow: '0px 2px 2px rgba(0, 0, 0, 0.15)',
    borderRadius: '18px',
    border: '1px solid red',
    bgcolor: 'common.white',
    '& .MuiSelect-select': {
        pt: '12px',
    },
    '& :focus': {
        bgcolor: 'common.white',
        borderRadius: '18px',
    },
};

export const avatarIconStyle = {
    width: '3rem',
    height: '3rem',
    fontSize: '1.25rem',
    lineHeight: 1.5,
};
