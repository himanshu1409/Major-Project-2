const Post = require("../models/post");
const Comment = require("../models/comment");

module.exports.create = async function (req, res) {
  try {
    let post = await Post.create({
      content: req.body.content,
      user: req.user._id,
    });

    if (req.xhr) {
      return res.status(200).json({
        data: {
          post: post,
        },
        message: "Post Created!",
      });
    }

    req.flash("success", "Post Created!");
    return res.redirect("back");
  } catch (err) {
    req.flash("error", err);
    return res.redirect("back");
  }
};

// const Post = require("../models/post");
// const Comment = require("../models/comment");

// //Create posts.....
// module.exports.create = async function (req, res) {
//   try {
//     let post = await Post.create({
//       content: req.body.content,
//       user: req.user._id,
//     });

//     // Check passed data is json or not.........
//     if (req.xhr) {
//       return res.status(200).json({
//         data: {
//           post: post,
//         },
//         message: "Post created!",
//       });
//     }
//     //.................................
//     req.flash("success", "Post published!");
//     return res.redirect("back");
//   } catch (err) {
//     req.flash("Error", err);
//     //console.log("Error",err);
//     return res.redirect("back");
//   }
// };

module.exports.destroy = async function (req, res) {
  // .id means converting the object id into string
  try {
    let post = await Post.findById(req.params.id);
    if (post.user == req.user.id) {
      // CHANGE :: delete the associated likes for the post and all its comments' likes too
      await Like.deleteMany({ likeable: post, onModel: "Post" });
      await Like.deleteMany({ _id: { $in: post.comments } });
      post.remove();
      await Comment.deleteMany({ post: req.params.id });
      if (req.xhr) {
        return res.status(200).json({
          data: {
            post_id: req.params.id,
          },
          message: "Post deleted",
        });
      }
      req.flash("success", "Post and associated comments deleted!");
      return res.redirect("back");
    } else {
      req.flash("error", "You cannot delete this post!");
      return res.redirect("back");
    }
  } catch (err) {
    req.flash("error", "Error while deleting the post");
    console.log(err);
    return res.redirect("back");
  }
};
