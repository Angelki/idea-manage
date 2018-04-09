const express = require("express");
const exphbs = require("express-handlebars");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");

const app = express();

// Map global promise - get rid of warning
mongoose.Promise = global.Promise;
// connect to mongoose
mongoose
  .connect("mongodb://localhost/aideas-dev", {
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

// static files
app.use("/static", express.static("static"));

// Method override middleware
app.use(methodOverride("_method"));

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

// ideas index page
app.get("/ideas", (req, res) => {
  Idea.find({})
    .sort({ date: "desc" })
    .then(ideas => {
      res.render("ideas/index", {
        ideas: ideas
      });
    });
});

// add idea
app.get("/ideas/add", (req, res) => {
  res.render("ideas/add");
});

// edit idea
app.get("/ideas/edit/:id", (req, res) => {
  Idea.findOne({
    _id: req.params.id
  }).then(idea => {
    res.render("ideas/edit", {
      idea: idea
    });
  });
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
    const newUser = {
      title: req.body.title,
      details: req.body.details
    };
    new Idea(newUser).save().then(idea => {
      res.redirect("./ideas");
    });
  }
});

// edit form process
app.put("/ideas/:id", (req, res) => {
  Idea.findOne({
    _id: req.params.id
  }).then(idea => {
    (idea.title = req.body.title), (idea.details = req.body.details);
    idea.save().then(idea => {
      res.redirect("/ideas");
    });
  });
});

const port = 5000;

app.listen(port, () => {
  console.log(`Server started on port: ${port}`);
});

// mongod.exe --logpath C:\mongodb\log\mongo.log --logappend --dbpath C:\mongodb\data\db --serviceName MongoDB --journal --install
// http://gitlab.decobim.com/root/web-deco-platform.git
