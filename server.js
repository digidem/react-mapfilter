var http = require('http')
var fs = require('fs')
var files = {
  odk: '/home/substack/projects/test-data/simpleodk.json',
  geo: '/home/substack/projects/test-data/submissions/incidente.geojson'
}

var server = http.createServer(function (req, res) {
  console.log(req.method, req.url)
  if (req.url === '/odk.json') {
    res.setHeader('content-type', 'text/json')
    fs.createReadStream(files.odk).pipe(res)
  } else if (req.url === '/data.geojson') {
    res.setHeader('content-type', 'text/json')
    fs.createReadStream(files.geo).pipe(res)
  } else {
    res.statusCode = 404
    res.end('not found\n')
  }
})
server.listen(3210)
