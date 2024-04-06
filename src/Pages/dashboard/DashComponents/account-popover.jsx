import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { Box, Divider, MenuItem, MenuList, Popover, Typography } from "@mui/material";
import { account } from "../../../utils/AppwriteConfig";
import React from "react";
import { useAuth } from "../../../components/AuthContext";

export const AccountPopover = (props) => {
  const { anchorEl, onClose, open } = props;
  const [name, setName] = useState("");
  const { setIsSignedIn } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        await account.get().then((response) => {
          setName(response.name);
        }).catch((error) => { throw new Error(error); });
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []); // Empty dependency array ensures this effect runs only once

  const handleSignOut = async () => {
    try {
      await account.deleteSessions("current").then(() => {
        setIsSignedIn(false);
        navigate("/");
      }).catch((error) => { throw new Error(error); });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Popover
      anchorEl={anchorEl}
      anchorOrigin={{
        horizontal: "right", // Changed to 'right'
        vertical: "bottom", // Changed to 'top'
      }}
      transformOrigin={{
        horizontal: "right", // Align the transform origin to the right
        vertical: "top", // And the top, so it grows downwards and to the left
      }}
      onClose={onClose}
      open={open}
      PaperProps={{ sx: { width: 200 } }}
    >
      <Box
        sx={{
          py: 1.5,
          px: 2,
        }}
      >
        <Typography variant="overline">Account</Typography>
        <Typography color="text.secondary" variant="body2">
          {name}
        </Typography>
      </Box>
      <Divider />
      <MenuList
        disablePadding
        dense
        sx={{
          p: "8px",
          "& > *": {
            borderRadius: 1,
          },
        }}
      >
        <MenuItem onClick={handleSignOut}>Sign out</MenuItem>
      </MenuList>
    </Popover>
  );
};

AccountPopover.propTypes = {
  anchorEl: PropTypes.any,
  onClose: PropTypes.func,
  open: PropTypes.bool.isRequired
};
