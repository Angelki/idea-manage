const express = require("express");
const exphbs = require("express-handlebars");
const mongoose = require("mongoose");

const app = express();

// Map global promise - get rid of warning
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

const port = 5000;

app.listen(port, () => {
  console.log(`Server started on port: ${port}`);
});
