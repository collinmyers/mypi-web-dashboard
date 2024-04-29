import PropTypes from "prop-types";
import Bars3Icon from "@heroicons/react/24/solid/Bars3Icon";
import {
  Avatar,
  Box,
  IconButton,
  Stack,
  SvgIcon,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import React from "react";

const SIDE_NAV_WIDTH = 220;
const TOP_NAV_HEIGHT = 64;

export const TopNav = (props) => {
  const theme = useTheme();
  const { onNavOpen } = props;
  const lgUp = useMediaQuery(theme.breakpoints.up("lg"));

  return (
    <Box
      component="header"
      sx={{
        backdropFilter: "blur(4px)",
        backgroundColor: alpha(theme.palette.background.default, 0.8),
        position: "relative",
        left: { lg: `${SIDE_NAV_WIDTH}px` },
        top: 1,
        width: { lg: `calc(100% - ${SIDE_NAV_WIDTH}px)` },
        zIndex: theme.zIndex.appBar,
      }}
    >
      <Stack
        alignItems="center"
        direction="row"
        justifyContent="space-between"
        spacing={2}
        sx={{
          flex: 1, // Grow to fill available space
          ml: "auto", 
          mr: 2, 
        }}
      >
        <Stack alignItems="center" direction="row" spacing={2}>
          {!lgUp && (
            <IconButton
              onClick={onNavOpen}
              style={{ zIndex: 1500 }}
              edge="start"
              color="inherit"
              aria-label="menu"
            >
              <SvgIcon fontSize="small">
                <Bars3Icon />
              </SvgIcon>
            </IconButton>
          )}
        </Stack>
        <Stack alignItems="center" direction="row" spacing={6}>
        </Stack>
      </Stack>
    </Box>
  );
};

TopNav.propTypes = {
  onNavOpen: PropTypes.func.isRequired,
};
