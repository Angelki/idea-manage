const express = require("express");
const exphbs = require("express-handlebars");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const flash = require("connect-flash");
const session = require("express-session");
const app = express();

// load routes
const ideas = require('./routes/ideas');


// Map global promise - get rid of warning
mongoose.Promise = global.Promise;
// connect to mongoose
mongoose
  .connect("mongodb://localhost/aideas-dev", {
    useMongoClient: true
  })
  .then(() => console.log("Mongodb connected..."))
  .catch(err => console.log(err));

//handlebars middleware
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// static files
app.use("/static", express.static("static"));

// Method override middleware
app.use(methodOverride("_method"));

// express session middleware
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true
  })
);

app.use(flash());
// global variables
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  next();
});
// index route
app.get("/", (req, res) => {
  const title = "Welcome2";
  res.render("index", {
    title: title
  });
});

// about route
app.get("/about", (req, res) => {
  res.render("about");
});

// User Login Route
app.get('/users/login', (req, res) => {
  res.send('login');
});

// User register  Route
app.get('/users/register', (req, res) => {
  res.send('register');
});

// use routes
app.use('/ideas', ideas);

const port = 5000;

app.listen(port, () => {
  console.log(`Server started on port: ${port}`);
});

// mongod.exe --logpath C:\mongodb\log\mongo.log --logappend --dbpath C:\mongodb\data\db --serviceName MongoDB --journal --install
// http://gitlab.decobim.com/root/web-deco-platform.git
