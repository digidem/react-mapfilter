// auth0 rule, runs in their sandbox on webtask.io
// pulls github token from configuration, puts in user.app_metadata

function(user, context, callback) {
  user.app_metadata = user.app_metadata || { };
  if (typeof(user.app_metadata !== "object")) {
    // clear non-object metadata
    user.app_metadata = { };
  }

  if (configuration.githubToken) {
    user.app_metadata.githubToken = configuration.githubToken;
    callback(null, user, context);
  } else {
    return callback(new UnauthorizedError('Unable to read Github token.'));
  }
}
