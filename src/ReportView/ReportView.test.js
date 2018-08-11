// @flow
import test from 'tape'

import { getFieldState } from './ReportView'

test('getFieldState: Empty arguments', function(t) {
  const fieldkeys = []
  const hiddenFields = []
  t.deepEqual(getFieldState(fieldkeys, hiddenFields), {})
  t.end()
})

test('getFieldState: No hidden fields', function(t) {
  const fieldkeys = ['foo', 'bar', 'qux']
  const hiddenFields = []
  t.deepEqual(getFieldState(fieldkeys, hiddenFields), {
    foo: 'visible',
    bar: 'visible',
    qux: 'visible'
  })
  t.end()
})

test('getFieldState: Some hidden fields', function(t) {
  const fieldkeys = ['foo', 'bar', 'qux']
  const hiddenFields = ['bar', 'qux']
  t.deepEqual(getFieldState(fieldkeys, hiddenFields), {
    foo: 'visible',
    bar: 'hidden',
    qux: 'hidden'
  })
  t.end()
})
