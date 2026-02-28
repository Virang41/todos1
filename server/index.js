const express = require("express");
const cors = require("cors");
const path = require("path");

try {
  require("dotenv-flow").config();
} catch (e) { }

const app = express();

app.use(cors());

app.use(express.json());

const mongoose = require("mongoose");
const todoroutes = require("./routes/todoroutes");

const source = process.env.MONGODB_ATLAS_CONNECTION;

mongoose
  .connect(source)
  .then(() => console.log("mongodb is connected"))
  .catch((error) => console.log(error));

app.use("/api", todoroutes);

const clientbuildpath = path.resolve(__dirname, "..", "client", "dist");

app.use(
  express.static(clientbuildpath, {
    setheaders: (res, filepath) => {
      if (filepath.endswith(".css")) {
        res.setheader("content-type", "text/css");
      } else if (filepath.endswith(".js")) {
        res.setheader("content-type", "application/javascript");
      }
    },

  })
);

app.get(/^(?!\/api|\/assets).*/, (req, res) => {
  res.sendfile(path.join(clientbuildpath, "index.html"));
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(` server run ${PORT}`);
});