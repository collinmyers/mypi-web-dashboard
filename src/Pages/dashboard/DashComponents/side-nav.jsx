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
import { useState, useEffect } from "react";

export const SideNav = (props) => {
  const { open, onClose } = props;
  const location = useLocation();
  const navigate = useNavigate(); // Use navigate for redirecting after logout
  const pathname = location.pathname; // Get the current pathname
  const { setIsSignedIn } = useAuth();
  const [name, setName] = useState("");
  const [permissions, setPermissions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await account
          .get()
          .then((response) => {
            setName(response.name);
            setPermissions(response.labels);
            console.log(response);
          })
          .catch((error) => {
            throw new Error(error);
          });
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []); // Empty dependency array ensures this effect runs only once

  const lgUp = useMediaQuery((theme) => theme.breakpoints.up("lg"));

  const handleLogout = async () => {
    // Logout function
    try {
      await account
        .deleteSessions("current")
        .then(() => {
          setIsSignedIn(false);
          navigate("/");
        })
        .catch((error) => {
          throw new Error(error);
        });
    } catch (error) {
      console.error(error);
    }
  };

  const filteredItems = items.filter((item) =>
    item.permissions.some((permission) => permissions.includes(permission))
  );

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
      <Box
        sx={{
          alignItems: "center",
          borderRadius: 1,
          cursor: "pointer",
          display: "flex",
          justifyContent: "space-between",
          mt: 0,
          p: "20px",
          backgroundColor: "#005588", // Lighter blue background behind the logo
        }}
      >
        <div>
          <img
            src={logo}
            alt="myPI Logo"
            style={{
              flex: 1,
              width: "100%",
              height: "100%",
              resizeMode: "contain",
              backgroundColor: "#005588",
            }}
          />
          <Typography
            color="#FFB238"
            variant="body1"
            textAlign="center"
            style={{
              fontWeight: "bold",
              borderRadius: "5px",
            }}
          >
            Admin Dashboard
          </Typography>
        </div>
      </Box>
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
          {filteredItems.map((item) => {
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
      <Typography
        textAlign="center"
        fontWeight="bold"
        color="text.tertiary"
        variant="body2"
      >
        {name}
      </Typography>
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
            textTransform: "none",
            justifyContent: "center",
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
