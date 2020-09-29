var config = require("../../server/config.json")
// var path = require("path");
var path = require("path")
module.exports = function(User) {
    // Triggers after new user creation
    User.afterRemote('create', function(context, userInstance, next) {
        console.log('> user.afterRemote triggered');
    // Nodemailer configuration
        var verifyOptions = {
          type: 'email',
          to: userInstance.email,
          from: 'noreply@loopback.com',
          subject: 'Thanks for registering.',
          template: path.resolve(__dirname, '../../server/views/verify.ejs'),
          redirect: "/verified",
          user: userInstance
        };
    
        // Sends mail
        userInstance.verify(verifyOptions, function(err, response, next) {
          if (err) return next(err);
    
          console.log('> verification email sent:', response);
    
          context.res.render('response', {
            title: 'Signed up successfully',
            content: 'Please check your email and click on the verification link ' -
                'before logging in.',
            redirectTo: '',
            redirectToLinkText: ''
          });
        });
      });

      // Method to render after verification
      User.afterRemote('prototype.verify', function(context, user, next) {
        context.res.render('response', {
          title: 'A Link to reverify your identity has been sent '+
            'to your email successfully',
          content: 'Please check your email and click on the verification link '+
            'before logging in',
          redirectTo: '',
          redirectToLinkText: ''
        });
      });
};
