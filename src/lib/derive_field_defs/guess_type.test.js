import test from 'tape'

import * as valueTypes from '../../constants/value_types'
import guessType from './guess_type'

const testData = [
  ['a string', valueTypes.STRING],
  ['', valueTypes.STRING],
  [99, valueTypes.NUMBER],
  [0, valueTypes.NUMBER],
  [12.3523523, valueTypes.NUMBER],
  [undefined, valueTypes.UNDEFINED],
  [null, valueTypes.NULL],
  [true, valueTypes.BOOLEAN],
  [false, valueTypes.BOOLEAN],
  [['a', 'b'], valueTypes.ARRAY],
  [[65, 95], valueTypes.ARRAY],
  [['a', 2], valueTypes.ARRAY],
  [[true, false], valueTypes.ARRAY],
  ['http://example.com/', valueTypes.URL],
  ['https://example.com', valueTypes.URL],
  ['http://localhost', valueTypes.URL],
  ['http://localhost:8000/', valueTypes.URL],
  ['http://localhost:8000/file.doc', valueTypes.URL],
  ['http://localhost:8000/folder/', valueTypes.URL],
  ['http://127.0.0.1:8000/image.jpg', valueTypes.IMAGE_URL],
  ['http://127.0.0.1:8000/image.JPG', valueTypes.IMAGE_URL],
  ['http://127.0.0.1:8000/image.JPEG', valueTypes.IMAGE_URL],
  ['http://127.0.0.1:8000/video.mp4', valueTypes.VIDEO_URL],
  ['http://127.0.0.1:8000/audio.wav', valueTypes.AUDIO_URL],
  ['66° 30′ 360″ N 32° 3′ 45″ W', valueTypes.LOCATION],
  [[66.234, 12.5123], valueTypes.LOCATION],
  ['66W 12N', valueTypes.LOCATION],
  ['-77.23 2.24 10 200', valueTypes.LOCATION],
  ['-77.23 2.24 10', valueTypes.STRING],
  [new Date().toISOString(), valueTypes.DATETIME],
  ['2017-02-12', valueTypes.DATE]
]

test('guessType', function(t) {
  t.plan(testData.length)
  testData.forEach(function(input) {
    t.equal(
      guessType(input[0]),
      input[1],
      'INPUT: ' + JSON.stringify(input[0] + ' EXPETED: ' + input[1])
    )
  })
})
