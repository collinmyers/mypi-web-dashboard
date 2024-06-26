import PropTypes from "prop-types";
import { Box, ButtonBase } from "@mui/material";
import { Link } from "react-router-dom";
import React from "react";
import { useTheme } from "@mui/material/styles";


export const SideNavItem = (props) => {
  const { active = false, disabled, external, icon, path, title } = props;
const theme = useTheme();
  const linkProps = path
    ? external
      ? {
        component: "a",
        href: path,
        target: "_blank"
      }
      : {
        component: Link,
        to: path
      }
    : {};

  return (
    <li>
      <ButtonBase
        sx={{
          alignItems: "center",
          borderRadius: 1,
          display: "flex",
          justifyContent: "flex-start",
          pl: "16px",
          pr: "16px",
          py: "6px",
          textAlign: "left",
          width: "100%",
          ...(active && {
            backgroundColor: "rgba(255, 255, 255, 0.04)" 
          }),
          "&:hover": {      
            backgroundColor: "rgba(255, 255, 255, 0.04)"
          }
        }}
        {...linkProps}
      >
        {icon && (
          <Box
            component="span"
            sx={{
              alignItems: "center",
              color: "common.white",
              display: "inline-flex",
              justifyContent: "center",
              mr: 2,
              ...(active && {
                color: theme.palette.secondary.main, //icon color when selected
              }),
              
            }}
          >
            {icon}
          </Box>
        )}
        <Box
          component="span"
          sx={{
            color: "common.white",
            flexGrow: 1,
            fontFamily: (theme) => theme.typography.fontFamily,
            fontSize: 14,
            fontWeight: 600,
            lineHeight: "24px",
            whiteSpace: "nowrap",
            ...(active && {
              color: theme.palette.secondary.main //side nav text color when selected
            }),
           
          
          }}
        >
          {title}
        </Box>
      </ButtonBase>
    </li>
  );
};

SideNavItem.propTypes = {
  active: PropTypes.bool,
  disabled: PropTypes.bool,
  external: PropTypes.bool,
  icon: PropTypes.node,
  path: PropTypes.string,
  title: PropTypes.string.isRequired
};
