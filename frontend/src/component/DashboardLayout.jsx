import React from "react";
import Footer from "./Footer";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import Breadcrumb from "./Breadcrumb";
import Home from "@mui/icons-material/Home";
import EventNote from "@mui/icons-material/EventNote";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Container from "@mui/material/Container";

export default function (props) {
  const {
    children,
    links = [
      {
        title: "Home",
        link: "/dashboard",
        icon: <Home />,
      },
      {
        title: "Test",
        link: "/dashboard/test",
        icon: <EventNote />,
      },
    ],
  } = props;
  const [isOpen, setIsOpen] = React.useState(false);
  const toggleDrawer = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <Box sx={{ display: "flex", position: "relative", zIndex: 1 }}>
        <Navbar open={isOpen} toggleDrawer={toggleDrawer} />
        <Sidebar open={isOpen} toggleDrawer={toggleDrawer} links={links} />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            height: "100vh",
            overflow: "auto",
          }}
        >
          <Toolbar />
          <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Breadcrumb />
            {children}
          </Container>
        </Box>
      </Box>
      <Footer />
    </>
  );
}
