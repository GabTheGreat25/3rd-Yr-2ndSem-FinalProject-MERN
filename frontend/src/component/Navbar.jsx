import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AppBar from "./Appbar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import PasswordIcon from "@mui/icons-material/Password";
import InfoIcon from "@mui/icons-material/Info";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import Badge from "@mui/material/Badge";
import { useDispatch } from "react-redux";
import { logout } from "@auth";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useSelector } from "react-redux";
import { Avatar } from "@mui/material";
import CartPreview from "@transactions/CartPreview";
import Dialog from "@mui/material/Dialog";
import jsPDF from "jspdf";
import { useAddTransactionMutation } from "@api";
import { RESOURCE, USER, ERROR } from "@/constants";

export default function (props) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [addTransaction] = useAddTransactionMutation();

  const { cartItems, onRemoveFromCart, open, toggleDrawer } = props;

  const auth = useSelector((state) => state.auth);

  const [cartPreviewOpen, setCartPreviewOpen] = useState(false);

  const [anchorEl, setAnchorEl] = useState(null);

  const [selectedButton] = useState(null);

  const toggleCartPreview = () => setCartPreviewOpen(!cartPreviewOpen);

  const handleClick = (event) => setAnchorEl(event.currentTarget);

  const handleClose = () => setAnchorEl(null);

  const handleLogout = async () => {
    try {
      await dispatch(logout());
      navigate("/login");
      toast.success(RESOURCE.LOGOUT, {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: RESOURCE.NUMBER.FIVE_THOUSAND,
      });
    } catch (error) {
      toast.error(ERROR.LOGOUT_ERROR, {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: RESOURCE.NUMBER.FIVE_THOUSAND,
      });
    }
  };

  const handleUpdateUserDetails = async () =>
    navigate(`userDetails/${auth.user._id}`);

  const handleUpdatePassword = async () =>
    navigate(`updatePassword/${auth.user._id}`);

  const handleConfirmPurchase = async () => {
    const transactionDate = new Date();
    const formattedDate = transactionDate.toLocaleDateString("en-PH");

    await addTransaction({
      user: auth.user._id,
      cameras: cartItems.map((item) => item._id),
      date: transactionDate,
    });

    props.clearCart();
    handleClose();

    const doc = new jsPDF();

    const lineHeight = RESOURCE.NUMBER.TEN;
    const startX = RESOURCE.NUMBER.TEN;
    const startY = RESOURCE.NUMBER.TWENTY;
    const lineThickness = RESOURCE.NUMBER.POINT_FIVE;

    doc.setFont("Arial", "bold");
    doc.setFontSize(RESOURCE.NUMBER.TWENTY_TWO);
    doc.setTextColor(
      RESOURCE.NUMBER.FORTY,
      RESOURCE.NUMBER.FORTY,
      RESOURCE.NUMBER.FORTY
    );
    doc.text(
      "Transaction Receipt",
      doc.internal.pageSize.getWidth() / RESOURCE.NUMBER.TWO,
      startY,
      { align: "center" }
    );
    doc.setLineWidth(lineThickness);
    doc.line(
      startX,
      startY + lineHeight,
      doc.internal.pageSize.getWidth() - startX,
      startY + lineHeight
    );

    doc.setFont("Arial", "normal");
    doc.setFontSize(RESOURCE.NUMBER.FOURTEEN);
    doc.setTextColor(
      RESOURCE.NUMBER.SIXTY,
      RESOURCE.NUMBER.SIXTY,
      RESOURCE.NUMBER.SIXTY
    );
    doc.text(
      `Date: ${formattedDate}`,
      startX,
      startY + RESOURCE.NUMBER.THREE * lineHeight
    );
    doc.text("Items:", startX, startY + RESOURCE.NUMBER.FOUR * lineHeight);

    let totalCost = RESOURCE.NUMBER.ZERO;
    cartItems.forEach((item, index) => {
      doc.text(
        `${index + RESOURCE.NUMBER.ONE}. ${item.name}`,
        startX,
        startY + (RESOURCE.NUMBER.FIVE + index) * lineHeight
      );
      doc.text(
        `${item.price} ${RESOURCE.PHP}`,
        doc.internal.pageSize.getWidth() - startX - RESOURCE.NUMBER.TEN,
        startY + (RESOURCE.NUMBER.FIVE + index) * lineHeight,
        { align: "right" }
      );
      totalCost += item.price;
    });

    const separatorY =
      startY + (RESOURCE.NUMBER.FIVE + cartItems.length) * lineHeight;
    doc.setLineWidth(RESOURCE.NUMBER.POINT_TWO);
    doc.setLineDash([RESOURCE.NUMBER.THREE, RESOURCE.NUMBER.THREE]);
    doc.line(
      startX,
      separatorY,
      doc.internal.pageSize.getWidth() - startX,
      separatorY
    );

    doc.setFont("Arial", "bold");
    doc.setFontSize(RESOURCE.NUMBER.SIXTEEN);
    doc.setTextColor(
      RESOURCE.NUMBER.EIGHTY,
      RESOURCE.NUMBER.EIGHTY,
      RESOURCE.NUMBER.EIGHTY
    );
    doc.setLineWidth(lineThickness);
    doc.text(`Total Cost:`, startX, separatorY + lineHeight);
    doc.text(
      `${totalCost.toFixed(RESOURCE.NUMBER.TWO)} ${RESOURCE.PHP}`,
      doc.internal.pageSize.getWidth() - startX - RESOURCE.NUMBER.TEN,
      separatorY + lineHeight,
      { align: "right" }
    );

    doc.setFont("Arial", "italic");
    doc.setFontSize(RESOURCE.NUMBER.FOURTEEN);
    doc.setTextColor(
      RESOURCE.NUMBER.HUNDRED,
      RESOURCE.NUMBER.HUNDRED,
      RESOURCE.NUMBER.HUNDRED
    );
    doc.text(
      `Thank you for your purchase ${auth?.user?.name}!`,
      doc.internal.pageSize.getWidth() / RESOURCE.NUMBER.TWO,
      separatorY + RESOURCE.NUMBER.THREE * lineHeight,
      { align: "center" }
    );

    doc.save("transaction-receipt.pdf");

    navigate("/dashboard/comment/create");
  };

  const randomIndex =
    auth?.user?.image && auth?.user?.image.length
      ? Math.floor(Math.random() * auth?.user?.image.length)
      : null;

  return (
    <>
      <AppBar
        position="absolute"
        open={open}
        sx={{ backgroundColor: "#2c3e50" }}
      >
        <Toolbar
          sx={{
            pr: "1.5rem",
          }}
        >
          <IconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            onClick={toggleDrawer}
            sx={{
              marginRight: "3rem",
              ...(open && { display: "none" }),
              "&:hover": {
                backgroundColor: "#f1f2f6",
                color: "#2c3e50",
                transition: "transform 0.2s ease-in-out",
                transform: "scale(1.1)",
              },
            }}
          >
            <MenuIcon />
          </IconButton>
          {auth?.user?.roles?.includes(USER.ADMIN) ? (
            <Typography
              component="h1"
              variant="h6"
              color="inherit"
              noWrap
              sx={{ flexGrow: RESOURCE.NUMBER.ONE }}
            >
              Admin Dashboard
            </Typography>
          ) : auth?.user?.roles?.includes(USER.EMPLOYEE) ? (
            <Typography
              component="h1"
              variant="h6"
              color="inherit"
              noWrap
              sx={{ flexGrow: RESOURCE.NUMBER.ONE }}
            >
              Employee Dashboard
            </Typography>
          ) : (
            <Typography
              component="h1"
              variant="h6"
              color="inherit"
              noWrap
              sx={{ flexGrow: RESOURCE.NUMBER.ONE }}
            >
              Customer Dashboard
            </Typography>
          )}

          {auth?.user?.roles?.includes(USER.CUSTOMER) ? (
            <IconButton
              onClick={toggleCartPreview}
              color="inherit"
              sx={{ color: "white", marginRight: "1rem" }}
            >
              <Badge badgeContent={props.cartCount}>
                <ShoppingCartIcon />
                <Typography sx={{ marginRight: ".25rem" }}>Cart</Typography>
              </Badge>
            </IconButton>
          ) : null}

          <Dialog open={cartPreviewOpen} onClose={toggleCartPreview}>
            <CartPreview
              cartItems={cartItems}
              onRemoveFromCart={onRemoveFromCart}
              onConfirmPurchase={handleConfirmPurchase}
            />
          </Dialog>

          <Button
            aria-controls="dropdown-menu"
            aria-haspopup="true"
            onClick={handleClick}
            sx={{
              borderRadius: "0.5rem",
              backgroundColor: "#f1f2f6",
              color: "#2c3e50",
              "&:hover": {
                backgroundColor: "#f1f2f6",
                color: "#2c3e50",
              },
            }}
          >
            {selectedButton || (
              <>
                <Avatar
                  alt={auth?.user?.image?.originalname}
                  src={
                    auth?.user?.image && auth?.user?.image?.length
                      ? auth?.user?.image[randomIndex]?.url
                      : null
                  }
                  key={auth?.user?.image?.public_id}
                  sx={{
                    width: RESOURCE.NUMBER.THIRTY_TWO,
                    height: RESOURCE.NUMBER.THIRTY_TWO,
                    mr: RESOURCE.NUMBER.ONE,
                  }}
                />
                Welcome, {auth?.user?.name}
              </>
            )}
          </Button>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          ></Menu>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem onClick={handleUpdateUserDetails}>
              <IconButton
                color="inherit"
                aria-label="updateUserDetails"
                sx={{
                  borderRadius: "0.5rem",
                  "&:hover": {
                    backgroundColor: "#f1f2f6",
                    color: "#2c3e50",
                    transition: "transform 0.2s ease-in-out",
                    transform: "scale(1.1)",
                  },
                }}
              >
                <Typography
                  variant="button"
                  sx={{ marginLeft: RESOURCE.NUMBER.ONE }}
                >
                  Update Your Details
                </Typography>
                <InfoIcon sx={{ ml: RESOURCE.NUMBER.ONE }} />
              </IconButton>
            </MenuItem>
            <MenuItem onClick={handleUpdatePassword}>
              <IconButton
                color="inherit"
                aria-label="updatePassword"
                sx={{
                  borderRadius: "0.5rem",
                  "&:hover": {
                    backgroundColor: "#f1f2f6",
                    color: "#2c3e50",
                    transition: "transform 0.2s ease-in-out",
                    transform: "scale(1.1)",
                  },
                }}
              >
                <Typography
                  variant="button"
                  sx={{ marginLeft: RESOURCE.NUMBER.ONE }}
                >
                  Update Password
                </Typography>
                <PasswordIcon sx={{ ml: RESOURCE.NUMBER.ONE }} />
              </IconButton>
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              <IconButton
                color="inherit"
                aria-label="logout"
                sx={{
                  borderRadius: "0.5rem",
                  "&:hover": {
                    backgroundColor: "#f1f2f6",
                    color: "#2c3e50",
                    transition: "transform 0.2s ease-in-out",
                    transform: "scale(1.1)",
                  },
                }}
              >
                <Typography
                  variant="button"
                  sx={{ marginLeft: RESOURCE.NUMBER.ONE }}
                >
                  Logout
                </Typography>
                <ExitToAppIcon sx={{ ml: RESOURCE.NUMBER.ONE }} />
              </IconButton>
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
    </>
  );
}
