import React, { useCallback, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { styled } from "@mui/material/styles";
import PropTypes from "prop-types";
import { SideNav } from "../DashComponents/side-nav";
import { TopNav } from "../DashComponents/top-nav";

const SIDE_NAV_WIDTH = 250;

const LayoutRoot = styled("div")(({ theme }) => ({
  display: "flex",
  flex: "1 1 auto",
  maxWidth: "100%",
  [theme.breakpoints.up("lg")]: {
    paddingLeft: SIDE_NAV_WIDTH,
  },
}));

const LayoutContainer = styled("div")({
  display: "flex",
  flex: "1 1 auto",
  flexDirection: "column",
  width: "100%",
});

const Layout = ({ children }) => {
  const location = useLocation();
  const [openNav, setOpenNav] = useState(false);

  useEffect(() => {
    // Function is simple enough that we can inline it inside useEffect,
    // unless it's used elsewhere that justifies useCallback.
    if (openNav) {
      setOpenNav(false);
    }
  }, [location.pathname, openNav]); // Ensure dependencies are correct

  return (
    <>
      <TopNav onNavOpen={() => setOpenNav(true)} />
      <SideNav onClose={() => setOpenNav(false)} open={openNav} />
      <LayoutRoot>
        <LayoutContainer>{children}</LayoutContainer>
      </LayoutRoot>
    </>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired, // This covers any renderable content
};

export default Layout;
