/*global localStorage*/
'use strict'

var _ = require('lodash')
var Backbone = require('backbone')
var Auth0Lock = require('auth0-lock')

module.exports = Backbone.View.extend({
  initialize: function (options, success) {
    this.listenTo(this, 'login', this.login)
    this.listenTo(this, 'logout', this.logout)

    if (!options) {
      this.method = null
      return success()
    } else if (options === true) {
      this.method = 'prompt'
    } else if (localStorage && localStorage.getItem('githubToken')) {
      this.method = 'localStorage'
      this.token = localStorage.getItem('githubToken')
    } else if (options.clientID && options.domain && !this.token) {
      this.method = 'auth0'
      this.auth0Lock = new Auth0Lock(options.clientID, options.domain)
    }

    this.trigger('login', success)
  },

  login: function (success) {
    if (this.token) {
      if (success) return success(this.token)
    } else if (this.method === 'localStorage') {
      this.token = localStorage.getItem('githubToken')
    } else if (this.method === 'auth0' && this.auth0Lock) {
      this.onSuccess = success // save success function for later
      return this.auth0Lock.show({
        dict: window.locale._current,
        icon: 'images/login.png',
        closable: false
      }, _.bind(this.auth0Callback, this))
    } else if (this.method === 'prompt') {
      this.token = window.prompt('Please enter Github token')
      if (localStorage) localStorage.setItem('githubToken', this.token)
    }

    if (success) return success(this.token)
  },

  auth0Callback: function (err, profile, id_token) {
    if (err) console.error(err)

    if (profile) {
      var githubToken = profile.app_metadata.githubToken || profile.app_metadata
      if (githubToken) {
        try {
          if (localStorage) localStorage.setItem('githubToken', githubToken)
          this.token = githubToken
          if (this.onSuccess) return this.onSuccess(this.token)
        } catch (err) {
          console.error(err)
        }
      } else {
        console.error('no githubToken in profile.app_metadata')
      }
    }
  },

  logout: function () {
    if (this.method === 'localStorage' || this.method === 'prompt') {
      localStorage.removeItem('githubToken')
      window.location.reload()
    } else if (this.method === 'auth0' && this.auth0Lock) {
      this.auth0Lock.logout({
        returnTo: window.location.href
      })
    }
  }
})
