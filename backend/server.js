const app = require("./app");
const PORT = process.env.PORT || 4000;

require("dotenv").config({ path: "./config/.env" });

app.listen(PORT, () => {
  console.log(
    `Server started on port ${PORT} in ${process.env.NODE_ENV} mode.`
  );
});
