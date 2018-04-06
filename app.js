const express = require("express");
const exphbs = require("express-handlebars");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const app = express();

// Map global promise - get rid of warning
mongoose.Promise = global.Promise;
// connect to mongoose
mongoose
  .connect("mongodb://localhost/aideasDev", {
    useMongoClient: true
  })
  .then(() => console.log("Mongodb connected..."))
  .catch(err => console.log(err));

// load Idea model
require("./models/Idea");
const Idea = mongoose.model("ideas");

//handlebars middleware
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

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

// add idea
app.get("/ideas/add", (req, res) => {
  res.render("ideas/add");
});

// process form
app.post("/ideas", (req, res) => {
  let errors = [];
  if (!req.body.title) {
    errors.push({ text: "Please add a title" });
  }
  if (!req.body.details) {
    errors.push({ text: "Please add some details" });
  }
  if (errors.length > 0) {
    res.render("ideas/add", {
      errors: errors,
      title: req.body.title,
      details: req.body.details
    });
  } else {
    res.send(`passed`);
  }
});

const port = 5000;

app.listen(port, () => {
  console.log(`Server started on port: ${port}`);
});

// mongod.exe --logpath C:\mongodb\log\mongo.log --logappend --dbpath C:\mongodb\data\db --serviceName MongoDB --journal --install
