/*global localStorage*/
'use strict'

var Auth0Lock = require('auth0-lock')

module.exports = function (config) {
  if (!config.auth) return
  var githubToken = localStorage.getItem('githubToken')
  if (githubToken) return githubToken

  var lock = new Auth0Lock(config.auth.clientID, config.auth.domain)
  lock.show(onLogin)
}

function onLogin (err, profile, id_token) {
  if (err) {
    window.alert('There was an error')
    console.error(err)
  }

  if (profile) {
    console.log('profile', profile)
    var githubToken = profile.githubToken
    localStorage.setItem('githubToken', profile.githubToken)
    return githubToken
  }
}
