// @flow
const test = require('tape')
const { guessValueType } = require('./field_types')
const valueTypes = require('../constants/value_types')

test('guessValueType()', function(t) {
  t.equal(guessValueType(['foo', 'bar']), valueTypes.ARRAY)
  t.equal(guessValueType(true), valueTypes.BOOLEAN)
  t.equal(guessValueType(42), valueTypes.NUMBER)
  t.equal(guessValueType('2018-01-01'), valueTypes.DATE)
  t.equal(guessValueType('2018-07-31T23:04:22.355Z'), valueTypes.DATE)
  t.equal(
    guessValueType('2018-07:04:22.355Z'),
    valueTypes.STRING,
    'Invalid date format'
  )
  t.equal(guessValueType(), valueTypes.UNDEFINED)
  t.equal(guessValueType(undefined), valueTypes.UNDEFINED)
  t.equal(guessValueType(null), valueTypes.NULL)
  t.equal(guessValueType('foo'), valueTypes.STRING)
  t.equal(guessValueType('http://www.example.com/'), valueTypes.URL)
  t.equal(
    guessValueType('http://www.example.com/image.jpg'),
    valueTypes.IMAGE_URL
  )
  t.equal(
    guessValueType('http://www.example.com/video.mp4'),
    valueTypes.VIDEO_URL
  )
  t.equal(
    guessValueType('http://www.example.com/video.mp3'),
    valueTypes.AUDIO_URL
  )
  t.end()
})
