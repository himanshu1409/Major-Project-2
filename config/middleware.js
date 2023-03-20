module.exports.setFlash = function (req, res, next) {
  // console.log("Inside middleware", req.flash("success"), req.flash("error"));
  res.locals.flash = {
    success: req.flash("success"),
    error: req.flash("error"),
  };
  next();
};
