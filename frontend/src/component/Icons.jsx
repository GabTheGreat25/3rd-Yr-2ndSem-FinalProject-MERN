import Home from "@mui/icons-material/Home";
import PeopleAltSharp from "@mui/icons-material/PeopleAltSharp";
import EventNote from "@mui/icons-material/EventNote";
import Camera from "@mui/icons-material/Camera";
import { ICONS } from "@/constants";

export default function (props) {
  const { icon } = props;

  if (ICONS.SYMBOL.HOME === icon) return <Home />;
  if (ICONS.SYMBOL.PEOPLE_ALT_SHARP === icon) return <PeopleAltSharp />;
  if (ICONS.SYMBOL.EVENT_NOTE === icon) return <EventNote />;
  if (ICONS.SYMBOL.CAMERA === icon) return <Camera />;

  return <DashboardIcon />;
}
