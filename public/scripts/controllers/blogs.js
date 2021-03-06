app.controller('BlogsCtrl', ['$scope', '$http', '$location', '$stateParams', '$rootScope', '$localStorage', 'Authentication', 'jwtHelper',
  function($scope, $http, $location, $stateParams, $rootScope, $localStorage, Authentication, jwtHelper) {
    var token = $localStorage.token;
    if (token) {
      $scope.signedIn = true;
      $scope.userId = JSON.parse($localStorage.userId).id;
    }

    $scope.displayBlogs = function() {
      $http.get('/blogs').success(function(response) {
          $scope.blogs = response;
        })
        .error(function(errorResponse) {
          $scope.error = errorResponse.data;
        });
    };
    $scope.newBlog = function(blog, type, userRole) {
      $scope.openblogForm = false;
      var postBody = {
        token: token,
        caption: blog.caption,
        title: blog.title,
        blogContent: blog.blogContent,
        serviceType: type
      };
      $http.post('admin/' + $scope.userId + '/blogs', postBody).success(function(response) {
          var blogId = response._id;
          $location.url('/community/blogs');
        })
        .error(function(errorResponse) {
          $scope.error = errorResponse.message;

        });
    };



    $scope.singleBlog = function() {
      var blogId = $stateParams.id;
      $http.get('/blogs/' + blogId).success(function(response) {
          $scope.blog = response;
        })
        .error(function(errorResponse) {
          $scope.error = errorResponse.data;
        });
    };


    // Create new Blog
    $scope.createComment = function(blog, user) {
      // Create new Blog object
      var commentBody = {
        token: token,
        comment: {
          commentContent: this.commentContent,
          creator: user
        }
      };
      $scope.blog = blog;
      $http.post('/blogs/' + blog._id + '/comments', commentBody).success(function(response) {
        $scope.blog.comments.push(response);
        $location.url('/community/blogs/' + blog._id);
      }).error(function(errorResponse) {
        $scope.error = errorResponse.message;
      });
      // Clear form fields
      this.commentContent = '';
    };

    $scope.deleteBlog = function(blog, blogs, index) {
      $http.delete('/admin/' + $scope.userId + '/blogs/' + blog._id + '?token=' + token).success(function(response) {
        blogs.splice(index, 1);
      }).error(function(errorResponse) {
        $scope.error = errorResponse.message;
      });
    };

    $scope.updateBlog = function(blog) {
      var blogBody = {
        token: token,
        blog: blog
      };
      $http.put('/admin/' + $scope.userId + '/blogs/' + blog._id + '?token=' + token, blogBody).success(function(response) {
        $location.url('/community/blogs/' + blog._id);
      }).error(function(errorResponse) {
        $scope.error = errorResponse.message;
      });
    };

    $scope.likeBlog = function(blog) {
      var body = {
        token: token,
        blog: blog,
        userId: $scope.userId,
        like: {
          liker: $scope.userId
        }
      };
      $scope.blog = blog;
      $http.post('/blogs/' + blog._id + '/like', body).success(function(response) {
        $scope.liked = true;
        $scope.blog.likes.length = $scope.blog.likes.length + 1;
      }).error(function(errorResponse) {
        $scope.error = errorResponse.data;
      });
    };

    $scope.likeComment = function(blog, comment) {
      var postBody = {
        token: token,
        blog: blog,
        userId: $scope.userId,
        like: {
          liker: $scope.userId
        }
      };

      $http.post('/blogs/' + blog._id + '/comment/' + comment._id + '/like', postBody).success(function(response) {
        $scope.liked = true;
        $scope.blog = response;
      }).error(function(errorResponse) {
        $scope.error = errorResponse.message;
      });
    };

    $scope.deleteBlogComment = function(blog, blogs, comment) {
      $http.delete('/blogs/' + blog._id + '/comment/' + comment._id).success(function(response) {
        blogs.splice(index, 1);
      }).error(function(errorResponse) {
        $scope.error = errorResponse.message;
      });
    };

  }
]);
