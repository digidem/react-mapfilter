const fc = require('./example_fc.json')
const omit = require('lodash/omit')
const fs = require('fs')
const path = require('path')
const LoremIpsum = require('lorem-ipsum').LoremIpsum

const lorem = new LoremIpsum({
  sentencesPerParagraph: {
    max: 3,
    min: 1
  },
  wordsPerSentence: {
    max: 9,
    min: 4
  }
})

const observations = fc.features.map(f => ({
  id: f.id,
  lon: f.geometry && f.geometry.coordinates[0],
  lat: f.geometry && f.geometry.coordinates[1],
  created_at: f.properties.start,
  attachments: Array(randomInt(5))
    .fill()
    .map(() => ({
      id: randomId() + '.jpg',
      type: 'image/jpg'
    })),
  tags: {
    ...omit(f.properties, ['id', 'picture', 'pictures']),
    notes: lorem.generateParagraphs(1)
  }
}))

function randomInt(max) {
  return Math.ceil(Math.random() * max)
}

function randomId() {
  return Math.ceil(Math.random() * Math.pow(2, 32)).toString(16)
}

fs.writeFileSync(
  path.join(__dirname, '/observations.json'),
  JSON.stringify(observations, null, 2)
)
