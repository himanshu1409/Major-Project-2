const Post = require("../../../models/post");
const Comment = require("../../../models/comment");

module.exports.index = async function (req, res) {
  let posts = await Post.find({})
    // .sort("-createdAt")
    .populate("user")
    .populate({
      path: "comments",
      populate: {
        path: "user",
      },
    });

  return res.json(200, {
    message: "List of Posts",
    posts: posts,
  });
};

module.exports.destroy = async function (req, res) {
  // .id means converting the object id into string
  try {
    let post = await Post.findById(req.params.id);
    if (post.user == req.user.id) {
      post.remove();
      await Comment.deleteMany({ post: req.params.id });
      // if (req.xhr) {
      //   return res.status(200).json({
      //     data: {
      //       post_id: req.params.id,
      //     },
      //     message: "Post deleted",
      //   });
      // }
      // req.flash("success", "Post and associated comments deleted!");
      // return res.redirect("back");
    } else {
      return res.json(401, {
        message: "You cannot delete this Post!",
      });
    }

    return res.json(200, {
      message: "Post and associated comments deleted!",
    });
  } catch (err) {
    //req.flash("error", "Error while deleting the post");
    console.log("*****", err);
    return res.json(500, {
      message: "Internal Server Error",
    });
  }
};
