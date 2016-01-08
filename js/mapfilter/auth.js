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
    }

    if (localStorage && localStorage.getItem('githubToken')) {
      this.method = 'localStorage'
      this.token = localStorage.getItem('githubToken')
    }

    if (options.clientID && options.domain && !this.token) {
      this.method = 'auth0'
      this.auth0Lock = new Auth0Lock(options.clientID, options.domain)
    }

    this.trigger('login', success)
  },

  login: function (success) {
    if (this.token) {
      if (success) return success(this.token)
    }

    if (this.method === 'localStorage') {
      this.token = localStorage.getItem('githubToken')
      if (success) return success(this.token)
    }

    if (this.method === 'auth0' && this.auth0Lock) {
      this.onSuccess = success // save success function for later
      return this.auth0Lock.show({
        dict: window.locale._current,
        icon: 'images/login.png',
        closable: false
      }, _.bind(this.auth0Callback, this))
    } else {
      this.token = window.prompt('Please enter Github token')
      if (success) return success(this.token)
    }
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
    if (this.method === 'localStorage') {
      localStorage.removeItem('githubToken')
      window.reload()
    }

    if (this.method === 'auth0' && this.auth0Lock) {
      this.auth0Lock.logout({
        returnTo: window.location.href
      })
    }
  }
})
