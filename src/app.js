const path = require("path");
const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const methodOverride = require("method-override");
const exphbs = require("express-handlebars");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const passport = require("passport");

// Load Config
dotenv.config({ path: "./config/config.env" });

// Connect to DB
require("./db/mongoose");

const app = express();

// Logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

//  HandleBars Helper

const {
  formatDate,
  truncate,
  stripTag,
  editeIcon,
  select,
} = require("../helper/help");

// Handelbars

app.engine(
  ".hbs",
  exphbs({
    helpers: {
      formatDate,
      truncate,
      stripTag,
      editeIcon,
      select,
    },
    extname: ".hbs",
  })
);
app.set("view engine", ".hbs");

// Static Folder

app.use(express.static(path.join(__dirname, "../public")));

//  Body Parser

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Method Override

app.use(
  methodOverride(function (req, res) {
    if (req.body && typeof req.body === "object" && "_method" in req.body) {
      var method = req.body._method;
      delete req.body._method;
      return method;
    }
  })
);

// Session

app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.DB_URI }),
    autoRemove: "interval",
    autoRemoveInterval: "3",
  })
);

// Passport Middleware

app.use(passport.initialize());
app.use(passport.session());

//  MiddleWare To Set Globale Var

app.use((req, res, next) => {
  res.locals.user = req.user || null;

  next();
});

// Passport Auth

app.use("/", require("./routes/passport"));

//Routes

app.use("/", require("./routes/index"));
app.use("/stories", require("./routes/stories"));

app.get("/*", (req, res) => {
  res.status(404).render("errors/404");
});

const PORT = process.env.PORT;

app.listen(
  PORT,
  console.log(
    `Server is running on mode ${process.env.NODE_ENV} and port ${PORT}`
  )
);
