// auth0 rule, runs in their sandbox on webtask.io
// from https://github.com/auth0/rules/blob/master/rules/decrypt-sensitive-data.md

function(user, context, callback) {
  user.app_metadata = user.app_metadata || { };

  var private_data = decrypt(user.app_metadata.private_data);
  if (private_data.githubToken) {
    user.githubToken = private_data.githubToken;
  } else {
    return callback(new UnauthorizedError('Unable to decrypt Github token.'));
  }

  return callback(null, user, context);

  function decrypt(data) {
    if (!data) {
      return { };  
    }
    var iv = new Buffer(configuration.ENCRYPT_IV);
    var encodeKey = crypto.createHash('sha256')
    .update(configuration.ENCRYPT_PASSWORD, 'utf-8').digest();
    var cipher = crypto.createDecipheriv('aes-256-cbc', encodeKey, iv);
    var decrypted = cipher.update(data, 'base64', 'utf8') + cipher.final('utf8');
    return JSON.parse(decrypted);
  }
}
