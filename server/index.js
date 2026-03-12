const express = require("express");
const cors = require("cors");
const path = require("path");

try {
  require("dotenv-flow").config();
} catch (e) { }

const app = express();

app.use(cors());

app.use((req, res, next) => {
  res.setHeader("Content-Security-Policy", "default-src 'self' http: https: 'unsafe-inline' 'unsafe-eval'; connect-src 'self' http: https: ws: wss:;");
  next();
});

app.use(express.json());

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

const mongoose = require("mongoose");
const todoroutes = require("./routes/todoRoutes");

const source = process.env.MONGODB_ATLAS_CONNECTION;

mongoose
  .connect(source)
  .then(() => console.log("mongodb is connected"))
  .catch((error) => console.log(error));

app.use("/api", todoroutes);

const clientbuildpath = path.resolve(__dirname, "..", "client", "dist");

app.use(
  express.static(clientbuildpath, {
    setHeaders: (res, filepath) => {
      if (filepath.endsWith(".css")) {
        res.setHeader("Content-Type", "text/css");
      } else if (filepath.endsWith(".js")) {
        res.setHeader("Content-Type", "application/javascript");
      }
    },

  })
);

app.get(/^(?!\/api|\/assets).*/, (req, res) => {
  res.sendFile(path.join(clientbuildpath, "index.html"));
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(` server run ${PORT}`);
});