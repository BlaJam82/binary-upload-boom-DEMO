const Comment = require("../models/Comment");

module.exports = {
  createComment: async (req, res) => {
    try {
      await Comment.create({
        comment: req.body.comment,
        likes: 0,
        post: req.params.id,
        user: req.user.id,
      });
      console.log("Comment has been added!");
      res.redirect("/post/" + req.params.id);
    } catch (err) {
      console.log(err);
    }
  },

  deleteComment: async (req, res) => {
    try {
      // Find the comment by ID
      const comment = await Comment.findById(req.params.id).lean();

      if (!comment) {
        return res.status(404).send("Comment not found");
      }

      // Check if the logged-in user owns the comment
      if (comment.user.toString() !== req.user._id.toString()) {
        return res.status(401).send("Unauthorized");
      }

      // Delete the comment
      await Comment.deleteOne({ _id: req.params.id });

      console.log("Comment deleted");
      res.redirect("/post/" + comment.post);
    } catch (err) {
      console.error(err);
      res.status(500).send("Server error");
    }
  },
};
