import { styled } from "@mui/material/styles";
import MuiDrawer from "@mui/material/Drawer";
import { RESOURCE } from "@/constants";

export default styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== RESOURCE.OPEN,
})(({ theme, open }) => ({
  "& .MuiDrawer-paper": {
    position: "relative",
    whiteSpace: "nowrap",
    width: RESOURCE.NUMBER.TWO_HUNDRED_FORTY,
    transition: theme.transitions.create(RESOURCE.WIDTH, {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    boxSizing: "border-box",
    ...(!open && {
      overflowX: "hidden",
      transition: theme.transitions.create(RESOURCE.WIDTH, {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      width: theme.spacing(RESOURCE.NUMBER.SEVEN),
      [theme.breakpoints.up("sm")]: {
        width: theme.spacing(RESOURCE.NUMBER.NINE),
      },
    }),
    zIndex: RESOURCE.NUMBER.ONE,
    backgroundColor: "#f1f2f6",
  },
}));
