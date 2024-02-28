import PropTypes from "prop-types";
import { Box, Button, Divider, Drawer, Stack, SvgIcon, Typography, useMediaQuery } from "@mui/material";
import { Link, useLocation } from "react-router-dom"; // Updated import
import { items } from "./config";
import { SideNavItem } from "./side-nav-item";
import React from "react";
import ChevronUpDownIcon from "@mui/icons-material/ChevronRight";

export const SideNav = (props) => {
  const { open, onClose } = props;
  const location = useLocation();
  const pathname = location.pathname; // Get the current pathname

  const lgUp = useMediaQuery((theme) => theme.breakpoints.up("lg"));

  const content = (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100vh", // Set height to full viewport height
        overflowY: "hidden", // Hide vertical scrollbar
      }}
    >
      <Box sx={{ p: 3 }}>
        <Box
          component={Link} // Updated component
          to="/" // Updated prop
          sx={{
            display: "inline-flex",
            height: 32,
            width: 32
          }}
        >
        </Box>
        <Box
          sx={{
            alignItems: "center",
            backgroundColor: "gray",
            borderRadius: 1,
            cursor: "pointer",
            display: "flex",
            justifyContent: "space-between",
            mt: 2,
            p: "12px"
          }}
        >
          <div>
            <Typography
              color="inherit"
              variant="subtitle1"
            >
              MyPI
            </Typography>
            <Typography
              color="neutral.400"
              variant="body2"
            >
              Admin Dashboard
            </Typography>
          </div>
          <SvgIcon
            fontSize="small"
            sx={{ color: "neutral.500" }}
          >
            <ChevronUpDownIcon />
          </SvgIcon>
        </Box>
      </Box>
      <Divider sx={{ borderColor: "neutral.700" }} />
      <Box
        component="nav"
        sx={{
          flexGrow: 1,
          px: 2,
          py: 3,
          overflowY: "auto", // Allow content to scroll if it exceeds container height
        }}
      >
        <Stack
          component="ul"
          spacing={0.5}
          sx={{
            listStyle: "none",
            p: 0,
            m: 0
          }}
        >
          {items.map((item) => {
            const active = item.path ? (pathname === item.path) : false;

            return (
              <SideNavItem
                active={active}
                disabled={item.disabled}
                external={item.external}
                icon={item.icon}
                key={item.title}
                path={item.path}
                title={item.title}
              />
            );
          })}
        </Stack>
      </Box>
      <Divider sx={{ borderColor: "neutral.700" }} />
    </Box>
  );

  if (lgUp) {
    return (
      <Drawer
        anchor="left"
        open
        PaperProps={{
          sx: {
            backgroundColor: "#005588",
            color: "#FFFFFF",
            width: 280
          }
        }}
        variant="permanent"
      >
        {content}
      </Drawer>
    );
  }

  return (
    <Drawer
      anchor="left"
      onClose={onClose}
      open={open}
      PaperProps={{
        sx: {
          backgroundColor: "#005588 ",
          color: "#FFFFFF",
          width: 280
        }
      }}
      sx={{ zIndex: (theme) => theme.zIndex.appBar + 100 }}
      variant="temporary"
    >
      {content}
    </Drawer>
  );
};

SideNav.propTypes = {
  onClose: PropTypes.func,
  open: PropTypes.bool
};