const express = require("express");
const app = express();
const port = 5000;
const connectDB = require("./route/config/db");
connectDB();

const session = require("express-session");
const csrf = require("csurf");
const expressEjsLayouts = require("express-ejs-layouts");
const path = require("path");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.set("layout", "layouts/main");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));
app.use(expressEjsLayouts);

app.use(session({
  secret: "carbon-secret-key",
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 
  }
}));

app.use(csrf());

app.use((req, res, next) => {
  res.locals.csrfToken = req.csrfToken();
  res.locals.username = req.session.user?.username || null;
  next();
});

app.use("/", require("./route/main"));

app.use((err, req, res, next) => {
  if (err.code === "EBADCSRFTOKEN") {
    return res.status(403).send("CSRF token invalid or missing.");
  }
  next(err);
});

app.listen(port, () => {
  console.log(`App is listening at http://localhost:${port}`);
});
