var fs = require('fs')
var path = require('path')
var template = require('lodash').template
var dir = path.resolve(__dirname, '../../templates')

module.exports = function (name) {
  var src = fs.readFileSync(path.join(dir, name))
  return template(src)
}
