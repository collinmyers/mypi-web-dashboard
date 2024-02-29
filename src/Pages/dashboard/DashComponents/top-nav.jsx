import PropTypes from "prop-types";
import Bars3Icon from "@heroicons/react/24/solid/Bars3Icon";
import {
  Avatar,
  Box,
  IconButton,
  Stack,
  SvgIcon,
  useMediaQuery,
  Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { usePopover } from "../../../hooks/use-popover";
import { AccountPopover } from "./account-popover";
import React from "react";
import { useTheme } from "@mui/material/styles";


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
            mr:-2,
            mb: 1,
          left: {
            lg: `${SIDE_NAV_WIDTH +50}px`
          },
          top: 0,
          width: {
            lg: `calc(100% - ${SIDE_NAV_WIDTH}px)`
          },
            zIndex: (theme) => theme.zIndex.appBar
          }}
        >
          <Stack
             alignItems="center"
            direction="row"
            justifyContent="space-between"
            spacing={2}
            sx={{
                flex: 1, // Grow to fill available space
                ml: "auto", // Move to the right
                mr: 2,   // Add margin to the right
              }}
          >
         
            <Stack
            alignItems="center"
            direction="row"
            spacing={2}
            >
              {!lgUp && (
                  <IconButton onClick={onNavOpen}>
                  <SvgIcon fontSize="small">
                    <Bars3Icon />
                  </SvgIcon>
                </IconButton>
              )}
            </Stack>
            <Stack
            alignItems="center"
            direction="row"
            spacing={6}
            >
           
            <Avatar
              onClick={accountPopover.handleOpen}
              ref={accountPopover.anchorRef}
              sx={{
                cursor: "pointer",
                height: 40,
                width: 40,
               mr:100,
                
              }}
            />
            </Stack>
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
  