const User = require("../models/user");
const fs = require("fs");
const path = require("path");

module.exports.profile = function (req, res) {
  // console.log("params", req.params);
  User.findById(req.params.id, function (err, user) {
    return res.render("user_profile", {
      title: "User Profile",
      profile_user: user,
    });
  });
};

module.exports.update = async function (req, res) {
  // if (req.user.id == req.params.id) {
  //   User.findByIdAndUpdate(req.params.id, req.body, function (err, user) {
  //     return res.redirect("back");
  //   });
  // } else {
  //   req.flash("error", "Unauthorized!");
  //   return res.status(401).send("Unauthorised");
  // }

  if (req.user._id == req.params.id) {
    try {
      let user = await User.findById(req.params.id);
      console.log("Params: ", user);
      console.log("User: ", req.user);
      User.uploadedAvatar(req, res, function (err) {
        if (err) {
          console.log("****** Multer Error:", err);
        }

        console.log(req.file);
        user.name = req.body.name;
        user.email = req.body.email;
        if (req.file) {
          // if (user.avatar) {
          //   fs.unlinkSync(path.join(__dirname, "..", user.avatar));
          // }

          // this is saving the path of the uploaded file into the avatar field into the user
          user.avatar = User.avatarPath + "/" + req.file.filename;
        }
        user.save();
        return res.redirect("back");
      });
    } catch (err) {
      req.flash("error", "Error while updating");
      console.log(err);
      return res.redirect("back");
    }
  } else {
    req.flash("error", "Unauthorized!");
    return res.status(401).send("Unauthorised");
  }
};

// render the sign up page
module.exports.signUp = function (req, res) {
  if (req.isAuthenticated()) {
    return req.redirect("/users/profile");
  }

  return res.render("user_sign_up", {
    title: "Codial | Sign Up",
  });
};

// render the sign in page
module.exports.signIn = function (req, res) {
  return res.render("user_sign_in", {
    title: "Codial | Sign In",
  });
};

// get the sign up data
module.exports.create = function (req, res) {
  if (req.body.password != req.body.confirm_password) {
    return res.redirect("back");
  }

  User.findOne({ email: req.body.email }, function (err, user) {
    if (err) {
      console.log("Error in finding user in signing up");
      return;
    }

    if (!user) {
      User.create(req.body, function (err, user) {
        if (err) {
          console.log("Error in finding user in signing up");
          return;
        }
        return res.redirect("/users/sign-in");
      });
    } else {
      return res.redirect("back");
    }
  });
};

// sign in and create a session for the user
module.exports.createSession = function (req, res) {
  req.flash("success", "Logged in Successfully");
  return res.redirect("/");
};

module.exports.destroySession = function (req, res) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    req.flash("success", "You have logged out!");
    res.redirect("/");
  });
};
