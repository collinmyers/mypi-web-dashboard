import PropTypes from "prop-types";
import Bars3Icon from "@heroicons/react/24/solid/Bars3Icon";
import {
  Avatar,
  Box,
  IconButton,
  Stack,
  SvgIcon,
  useMediaQuery
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { usePopover } from "../../../hooks/use-popover";
import { AccountPopover } from "./account-popover";
import React from "react";


const SIDE_NAV_WIDTH = 280;
const TOP_NAV_HEIGHT = 64;

export const TopNav = (props) => {
    const { onNavOpen } = props;
    const lgUp = useMediaQuery((theme) => theme.breakpoints.up("lg"));
    const accountPopover = usePopover();
  
    return (
      <>
        <Box
          component="header"
          sx={{
            backdropFilter: "blur(6px)",
            backgroundColor: (theme) => alpha(theme.palette.background.default, 0.8),
            position: "sticky",
            right: 0, // Align to the right
            top: 0,
            width: {
              lg: `calc(100% - ${SIDE_NAV_WIDTH}px)`
            },
            zIndex: (theme) => theme.zIndex.appBar
          }}
        >
          <Stack
             alignItems="right"
            direction="row"
            justifyContent="space-between"
            spacing={2}
            sx={{
              minHeight: TOP_NAV_HEIGHT,
              px: 2,
              alignItems: "center" // Align items vertically
            }}
          >
            <Stack
              direction="row"
              spacing={9}
              alignItems= "center"
            >
              {!lgUp && (
                  <IconButton onClick={onNavOpen}>
                  <SvgIcon fontSize="small">
                    <Bars3Icon />
                  </SvgIcon>
                </IconButton>
              )}
            </Stack>
            <Avatar
              onClick={accountPopover.handleOpen}
              ref={accountPopover.anchorRef}
              sx={{
                cursor: 'pointer',
                height: 40,
                width: 40
              }}
            />
          </Stack>
        </Box>
        <AccountPopover 
          anchorEl={accountPopover.anchorRef.current}
          open={accountPopover.open}
          onClose={accountPopover.handleClose}
        />
      </>
    );
  };
  
  TopNav.propTypes = {
    onNavOpen: PropTypes.func
  };
  