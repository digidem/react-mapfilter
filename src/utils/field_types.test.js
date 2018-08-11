// @flow
const test = require('tape')
const { guessType } = require('./field_types')
const fieldTypes = require('../constants/field_types')
const { UNDEFINED, NULL } = require('../constants/field_values')

test('guessType()', function(t) {
  t.equal(guessType(['foo', 'bar']), fieldTypes.ARRAY)
  t.equal(guessType(true), fieldTypes.BOOLEAN)
  t.equal(guessType(42), fieldTypes.NUMBER)
  t.equal(guessType('2018-01-01'), fieldTypes.DATE)
  t.equal(guessType('2018-07-31T23:04:22.355Z'), fieldTypes.DATE)
  t.equal(
    guessType('2018-07:04:22.355Z'),
    fieldTypes.STRING,
    'Invalid date format'
  )
  t.equal(guessType(), UNDEFINED)
  t.equal(guessType(undefined), UNDEFINED)
  t.equal(guessType(null), NULL)
  t.equal(guessType('foo'), fieldTypes.STRING)
  t.equal(guessType('http://www.example.com/'), fieldTypes.URL)
  t.equal(guessType('http://www.example.com/image.jpg'), fieldTypes.IMAGE_URL)
  t.equal(guessType('http://www.example.com/video.mp4'), fieldTypes.VIDEO_URL)
  t.equal(guessType('http://www.example.com/video.mp3'), fieldTypes.AUDIO_URL)
  t.end()
})
