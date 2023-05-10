import { styled } from "@mui/material/styles";
import MuiAppBar from "@mui/material/AppBar";
import { RESOURCE } from "@/constants";

export default styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== RESOURCE.OPEN,
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + RESOURCE.NUMBER.ONE,
  transition: theme.transitions.create([RESOURCE.WIDTH, RESOURCE.MARGIN], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: RESOURCE.NUMBER.TWO_HUNDRED_FORTY,
    width: RESOURCE.NAVBAR_WIDTH,
    transition: theme.transitions.create([RESOURCE.WIDTH, RESOURCE.MARGIN], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));
