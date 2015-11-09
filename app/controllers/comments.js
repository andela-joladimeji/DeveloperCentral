// // 'use strict';

// /**
//  * Module dependencies.
//  */
// User = require('../models/user'),

var mongoose = require('mongoose'),
  Discussion = require('../models/discussion'),
  _ = require('lodash');
var discussions = require('../../app/controllers/discussion');

// /**
//  * Add a comment
//  */
module.exports.addComment = function(req, res) {
  var discussionId = req.params.discussionId;
  var comment = req.body.comment;
  Discussion.find({
    _id: discussionId
  }, function(err, blog) {
    if (err) {
      return res.status(400).send({
        data: err
      });
    } else {
      blog[0].comments.unshift(comment);

      blog[0].save(function(err) {
        if (err) {
          console.log(err);
          return res.status(400).send({
            message: 'comment was not saved'
          });
        } else {
          res.jsonp(comment);
        }
      });
    }
  });
};


// /**
//  * Delete a comment
//  */
// module.exports.deleteComment = function(req, res) {
//     if (req.user.role === 'admin') {

//         var blog = req.blog;

//         blog.comments.id(req.params.commentId).remove();
//         // blog.comments.id(id).remove();

//         blog.save(function(err) {
//             if (err) {
//                 return res.status(400).send({
//                     message: 'comment delete failed'
//                 });
//             } else {
//                 res.jsonp(blog);
//             }
//         });
//     } else {
//         return res.status(401).send({
//             message: 'User is not authorized'
//         });
//     }
// };


module.exports.likeComment = function(req, res) {
  var index = 0;

  var discussionId = req.params.discussionId;
  Discussion.find({
    _id: discussionId
  }).populate('user').exec(function(err, blog) {

    if (err) {
      return res.status(400).send({
        data: err
      });
    } else {

      // var blog = req.body.blog;
      var like = req.body.like;

      like.liker = req.body.userId;


      var hasLikedComment = false;

      if (req.body.userId === blog[0].comments.id(req.params.commentId).creator) {
        return res.send(400, {
          message: 'You cannot like your own comment'
        });
      } else {

        for (var i = 0; i < blog[0].comments.id(req.params.commentId).commentLikes.length; i++) {
          if (req.body.userId === blog[0].comments.id(req.params.commentId).commentLikes[i].liker.toString()) {
            hasLikedComment = true;
            break;
          }
        }
        if (!hasLikedComment) {
          blog[0].comments.id(req.params.commentId).commentLikes.push(like);

          blog[0].save(function(err) {
            if (err) {
              return res.send(400, {
                data: err
              });
            } else {
              res.jsonp(blog[0]);
            }
          });
        } else {
          return res.send(400, {
            message: 'you have already liked this post before'
          });
        }
      }

    }
  });

};