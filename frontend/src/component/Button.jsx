import Button from "@mui/material/Button";

function ButtonComponent(props) {
  const { title = "", onClick = () => {} } = props;

  return (
    <>
      <Button
        onClick={() => {
          onClick();
        }}
        sx={{
          marginBottom: "1rem",
        }}
      >
        {title}
      </Button>
    </>
  );
}

export default ButtonComponent;
