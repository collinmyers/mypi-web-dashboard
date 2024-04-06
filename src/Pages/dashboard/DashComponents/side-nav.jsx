import PropTypes from "prop-types";
import {
  Box,
  Button,
  Divider,
  Drawer,
  Stack,
  SvgIcon,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { Link, useLocation, useNavigate } from "react-router-dom"; // Include useNavigate
import { items } from "./config";
import { SideNavItem } from "./side-nav-item";
import React from "react";
import logo from "../../../assets/myPI-Icon.png";
import LogoutSharp from "@mui/icons-material/LogoutSharp";
import { useAuth } from "../../../components/AuthContext";
import { account } from "../../../utils/AppwriteConfig";



export const SideNav = (props) => {
  const { open, onClose } = props;
  const location = useLocation();
  const navigate = useNavigate(); // Use navigate for redirecting after logout
  const pathname = location.pathname; // Get the current pathname
  const { setIsSignedIn } = useAuth();


  const lgUp = useMediaQuery((theme) => theme.breakpoints.up("lg"));

  const handleLogout = async () => {  // Logout function
   try {
      await account.deleteSessions("current").then(() => {
        setIsSignedIn(false);
        navigate("/");
      }).catch((error) => { throw new Error(error); });
    } catch (error) {
      console.error(error);
    }
  };

  const content = (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        overflowY: "auto", // Updated for scrolling
        minWidth: "50%",
      }}
    >
      <Box sx={{ p: 1, ml: 1 }}>
        <Box
          sx={{
            alignItems: "center",
            borderRadius: 1,
            cursor: "pointer",
            display: "flex",
            justifyContent: "space-between",
            mt: 0,
            p: "20px",
          }}
        >
          <div>
            <Typography
              color="inherit"
              variant="subtitle1"
              fontSize={30}
              sx={{ mb: 1, mt: 0 }}
              style={{ fontWeight: "bold" }}
              textAlign="center"
            >
              MyPI
            </Typography>
            <Typography
              color="neutral.400"
              variant="body2"
              textAlign="center"
              style={{ fontWeight: "bold" }}
            >
              Admin Dashboard
            </Typography>
          </div>
        </Box>
      </Box>
      <Divider sx={{ borderColor: "neutral.700" }} />
      <Box
        component="nav"
        sx={{
          flexGrow: 1,
          px: 2,
          py: 3,
          overflowY: "auto",
        }}
      >
        <Stack
          component="ul"
          spacing={"5%"} // Adjust spacing between items
          sx={{
            listStyle: "none",
            p: 0,
            m: 0,
          }}
        >
          {items.map((item) => {
            const active = item.path ? pathname === item.path : false;

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
      <Divider sx={{ borderColor: "neutral.700", mt: "auto" }} />{" "}
      {/* Ensure divider is at the bottom */}
      {/* Logout Button */}
      <Box sx={{ p: 2 }}>
        <Button
          fullWidth
          startIcon={
            <SvgIcon>
              <LogoutSharp />
            </SvgIcon>
          }
          onClick={handleLogout}
          sx={{
            color: "#FFFFFF",
            justifyContent: "flex-start",
            textTransform: "none",
          }}
        >
          Logout
        </Button>
      </Box>
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
            width: 235,
          },
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
          backgroundColor: "#005588",
          color: "#FFFFFF",
          width: 220,
        },
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
  open: PropTypes.bool,
};
