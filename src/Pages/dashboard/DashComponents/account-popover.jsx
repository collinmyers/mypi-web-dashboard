import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { Box, Divider, MenuItem, MenuList, Popover, Typography } from "@mui/material";
import { account } from "../../../utils/AppwriteConfig";
import React from "react";

export const AccountPopover = (props) => {
  const { anchorEl, onClose, open } = props;
  const [accountInfo, setAccountInfo] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await account.get();
        setAccountInfo(response);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []); // Empty dependency array ensures this effect runs only once

  const handleSignOut = async () => {
    try {
      await account.deleteSessions("current");
      navigate("/");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Popover
      anchorEl={anchorEl}
      anchorOrigin={{
        horizontal: "left",
        vertical: "bottom"
      }}
      onClose={onClose}
      open={open}
      PaperProps={{ sx: { width: 200 } }}
    >
      <Box
        sx={{
          py: 1.5,
          px: 2
        }}
      >
        <Typography variant="overline">Account</Typography>
        <Typography color="text.secondary" variant="body2">
          {accountInfo ? accountInfo.name : ""}
        </Typography>
      </Box>
      <Divider />
      <MenuList
        disablePadding
        dense
        sx={{
          p: "8px",
          "& > *": {
            borderRadius: 1
          }
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
