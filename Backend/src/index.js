const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
dotenv.config();
const routes = require("./routes");
const app = express();
const bodyParser = require("body-parser");
const port = process.env.PORT || 3000;
const slug = require("mongoose-slug-generator");
const cors = require("cors");
mongoose.plugin(slug);

app.use(
  cors({
    origin: "https://ie-213-quan-ly-chung-chi.vercel.app/info-holder", // cho phép mọi domain
    methods: ["GET", "POST", "PUT", "DELETE"], // tuỳ ý thêm nếu cần
    allowedHeaders: ["Content-Type", "Authorization"], // tuỳ ý thêm nếu cần
    credentials: true, // nếu cần gửi cookie
  })
);

app.use(bodyParser.json());

routes(app);

mongoose
  .connect(`${process.env.MONGO_DB}`)
  .then(() => {
    console.log("Connect Db Successfully!");
  })
  .catch((error) => {
    console.log("Connect db failure!!!");
  });

app.get("/", (req, res) => {
  res.send("Hello");
});

app.listen(port, () => {
  console.log("Server is running in port " + port);
});
