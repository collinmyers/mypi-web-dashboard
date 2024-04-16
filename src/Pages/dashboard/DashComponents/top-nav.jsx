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

import React from "react";
import { useTheme } from "@mui/material/styles";


const SIDE_NAV_WIDTH = 220;
const TOP_NAV_HEIGHT = 64;


export const TopNav = (props) => {
    const { onNavOpen } = props;
    const lgUp = useMediaQuery((theme) => theme.breakpoints.up("lg"));
  
    return (
      <>
        <Box
          component="header"
          sx={{
            backdropFilter: "blur(px)",
            backgroundColor: (theme) => alpha(theme.palette.background.default, 0.8),
            position: "relative",
           
          left: {
            lg: `${SIDE_NAV_WIDTH +100}px`
          },
          top: 1,
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
           
            
            
            </Stack>
            </Stack>
        </Box>
        
        
      </>
    );
  };
  
  TopNav.propTypes = {
    onNavOpen: PropTypes.func
  };
  