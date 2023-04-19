import React from "react";
import Footer from "../component/Footer";
import Navbar from "../component/Navbar";
import Sidebar from "../component/Sidebar";
import Breadcrumb from "../component/Breadcrumb";
import Home from "@mui/icons-material/Home";
import PeopleAltSharp from "@mui/icons-material/PeopleAltSharp";
import EventNote from "@mui/icons-material/EventNote";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Container from "@mui/material/Container";
import { Outlet } from "react-router-dom";

export default function (props) {
  const {
    links = [
      {
        title: "Home",
        link: "/dashboard",
        icon: <Home />,
      },
      {
        title: "User",
        link: "/dashboard/user",
        icon: <PeopleAltSharp />,
      },
      {
        title: "Note",
        link: "/dashboard/note",
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
            <Outlet />
          </Container>
        </Box>
      </Box>
      <Footer />
    </>
  );
}
