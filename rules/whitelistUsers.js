// auth0 rule, runs in their sandbox on webtask.io
// combines https://github.com/auth0/rules/blob/master/rules/simple-user-whitelist-for-app.md
// and https://github.com/auth0/rules/blob/master/rules/simple-domain-whitelist.md

function(user, context, callback) {
  request.get({
    url: 'https://dl.dropboxusercontent.com/u/21665105/users.txt' // TODO, update w/ our own doc
  }, function (err, response, body) {
    var allowedUsers = body.split(/\r?\n/g); // handle either Unix or Windows line encoding
    var allowedDomains = ['digital-democracy.org', 'spacedog.xyz'];

    var userHasAccess = allowedUsers.some(checkEmail) || allowedDomains.some(checkDomain);

    if (!userHasAccess) {
      return callback(new UnauthorizedError('Access denied. ' +
                      '<a href="mailto:info@digital-democracy.org">Contact us</a> for a login.'));
    }

    callback(null, user, context);
  });

  function checkDomain(domain) {
    if (user.email) {
      var emailSplit = user.email.split('@');
      return emailSplit[emailSplit.length - 1].toLowerCase() === domain;
    }
    return false;
  }

  function checkEmail(email) {
    return email === user.email;
  }
}
