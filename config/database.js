if (process.env.NODE_ENV === "production") {
  module.exports = {
    mongoURI: " mongodb:zzz:zzz123456@ds014388.mlab.com:14388/idea-manage-prod"
  };
} else {
  module.exports = { mongoURI: "mongodb://localhost/aideas-dev" };
}
