module.exports = {
  ensureAuthenticated: (req, res, next) => {
    if (req.isAuthenticated()) {
      return next();
    }
    req.flash("error_msg", "Not Authorized");
    res.redirect("/users/login");
  }
};
// isAuthenticated是passport提供的一个函数 对于任何请求，您可以检查用户是否已通过身份验证或未使用此方法。 上面是源码
