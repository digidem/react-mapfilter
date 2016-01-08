/*global localStorage*/
'use strict'

var Auth0Lock = require('auth0-lock')

module.exports = function (config) {
  if (!config.auth) return
  var githubToken = localStorage.getItem('githubToken')
  if (githubToken) return githubToken

  if (config.auth.clientID && config.auth.domain) {
    var lock = new Auth0Lock(config.auth.clientID, config.auth.domain)
    lock.show({
      icon: 'images/login.png',
      closable: false
    }, onLogin)
  } else {
    return window.prompt('Please enter Github token')
  }
}

function onLogin (err, profile, id_token) {
  if (err) console.error(err)

  if (profile) {
    console.log('profile', profile)
    var githubToken = profile.app_metadata.githubToken
    if (githubToken) {
      console.log('got token')
      localStorage.setItem('githubToken', githubToken)
      return githubToken
    } else {
      console.error('no githubToken in profile.app_metadata')
    }
  }
}
