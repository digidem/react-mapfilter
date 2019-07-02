import test from 'tape'
import { flatObjectEntries } from './flat_object_entries'

test('flatObjectEntries', t => {
  t.deepEqual(
    flatObjectEntries({
      empty: {},
      emptyArr: [],
      foo: { bar: 'qux' },
      hello: 'world',
      arr: ['biz', 'baz'],
      other: [{ foo: 'bar' }, { qux: 'quz' }]
    }),
    [
      [['foo', 'bar'], 'qux'],
      [['hello'], 'world'],
      [['arr'], ['biz', 'baz']],
      [['other', 0, 'foo'], 'bar'],
      [['other', 1, 'qux'], 'quz']
    ]
  )
  t.end()
})
