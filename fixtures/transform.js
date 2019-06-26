const fc = require('./example_fc.json')
const omit = require('lodash/omit')
const fs = require('fs')

const observations = fc.features.map(f => ({
  id: f.id,
  lon: f.geometry && f.geometry.coordinates[0],
  lat: f.geometry && f.geometry.coordinates[0],
  created_at: f.properties.start,
  attachments: Array(randomInt(5)).fill({
    id: randomId() + '.jpg',
    type: 'image'
  }),
  tags: omit(f.properties, ['id', 'picture', 'pictures'])
}))

function randomInt(max) {
  return Math.ceil(Math.random() * max)
}

function randomId() {
  return Math.ceil(Math.random() * Math.pow(2, 32)).toString(16)
}

fs.writeFileSync(
  __dirname + '/observations.json',
  JSON.stringify(observations, null, 2)
)
