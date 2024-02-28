import React, { useCallback, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { styled } from "@mui/material/styles";
import { SideNav } from "../DashComponents/side-nav";
import { TopNav } from "../DashComponents/top-nav";

const SIDE_NAV_WIDTH = 280;

const LayoutRoot = styled("div")(({ theme }) => ({
  display: "flex",
  flex: "1 1 auto",
  maxWidth: "100%",
  [theme.breakpoints.up("lg")]: {
    paddingLeft: SIDE_NAV_WIDTH
  }
}));

const LayoutContainer = styled("div")({
  display: "flex",
  flex: "1 1 auto",
  flexDirection: "column",
  width: "100%"
});

const Layout = ({ children }) => {
  const location = useLocation();
  const [openNav, setOpenNav] = useState(false);

  const handlePathnameChange = useCallback(() => {
    if (openNav) {
      setOpenNav(false);
    }
  }, [openNav]);

  useEffect(() => {
    handlePathnameChange();
  }, [location.pathname]);

  return (
    <>
      <TopNav  onNavOpen={() => setOpenNav(true)} />
      <SideNav onClose={() => setOpenNav(false)} open={openNav} />
      <LayoutRoot>
        <LayoutContainer>{children}</LayoutContainer>
      </LayoutRoot>
    </>
  );
};

export default Layout;
