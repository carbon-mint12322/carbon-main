import * as React from 'react';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Grow from '@mui/material/Grow';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';


export interface SplitButtonOptionI {
    label: string,
    operation: Function,
    props?: any,
}

interface SplitbuttonProps {
    mainButtonLabel: string,
    mainButtonOperation: Function,
    options?: SplitButtonOptionI[],
    color?: any
    disabled?: boolean
}

export default function SplitButton(
    {
        mainButtonLabel,
        mainButtonOperation,
        options,
        color,
        disabled
    }: SplitbuttonProps) {

    const [open, setOpen] = React.useState(false);
    const anchorRef = React.useRef<HTMLDivElement>(null);
    const handleButtonClick = () => {
        if (mainButtonOperation) {
            mainButtonOperation()
        }
    };

    const handleMenuItemClick = (
        event: React.MouseEvent<HTMLLIElement, MouseEvent>,
        option: SplitButtonOptionI
    ) => {

        try {

            option?.operation(option?.props || null)
            setOpen(false);

        } catch (err) {
            console.log('Operation for the bulk action not defined')
        }

    };
    const handleToggle = () => setOpen((prevOpen) => !prevOpen);
    const handleClose = (event: Event) => {
        if (anchorRef.current && anchorRef.current.contains(event.target as HTMLElement)) {
            return;
        }
        setOpen(false);
    };

    return (
        <React.Fragment>
            <ButtonGroup
                variant="contained"
                ref={anchorRef}
                disabled={disabled}
                color={color}
            >
                <Button onClick={handleButtonClick}>{mainButtonLabel}</Button>
                {options?.length ?
                    <Button
                        size="small"
                        aria-controls={open ? 'split-button-menu' : undefined}
                        aria-expanded={open ? 'true' : undefined}
                        aria-label="select merge strategy"
                        aria-haspopup="menu"
                        onClick={handleToggle}
                    >
                        <ArrowDropDownIcon />
                    </Button>
                    : <></>}
            </ButtonGroup>
            <Popper
                open={open}
                anchorEl={anchorRef.current}
                role={undefined}
                transition
                disablePortal
                sx={{ zIndex: 1 }}
            >
                {({ TransitionProps }) => (
                    <Grow {...TransitionProps}>
                        <Paper>
                            <ClickAwayListener onClickAway={handleClose}>
                                <MenuList id="split-button-menu" autoFocusItem>
                                    {options?.map((option, index) => (
                                        <MenuItem
                                            key={option.label + index}
                                            onClick={(event) => handleMenuItemClick(event, option)}
                                        >
                                            {option?.label}
                                        </MenuItem>
                                    ))}
                                </MenuList>
                            </ClickAwayListener>
                        </Paper>
                    </Grow>
                )}
            </Popper>
        </React.Fragment>
    );
}
