const test = require('tape')
const { flatten, unflatten } = require('./flat')

var primitives = {
  String: 'good morning',
  Number: 1234.99,
  Boolean: true,
  Date: new Date(),
  null: null,
  undefined: undefined
}

test('Flatten Primitives', function(t) {
  Object.keys(primitives).forEach(function(key) {
    var value = primitives[key]
    t.deepEqual(
      flatten({
        hello: {
          world: value
        }
      }),
      {
        'hello.world': value
      },
      key
    )
  })
  t.end()
})

test('Unflatten Primitives', function(t) {
  Object.keys(primitives).forEach(function(key) {
    var value = primitives[key]

    t.deepEqual(
      unflatten({
        'hello.world': value
      }),
      {
        hello: {
          world: value
        }
      },
      key
    )
  })
  t.end()
})

test('Flatten', function(t) {
  t.deepEqual(
    flatten({
      hello: {
        world: 'good morning'
      }
    }),
    {
      'hello.world': 'good morning'
    },
    'Nested once'
  )

  t.deepEqual(
    flatten({
      hello: {
        world: {
          again: 'good morning'
        }
      }
    }),
    {
      'hello.world.again': 'good morning'
    },
    'Nested twice'
  )

  t.deepEqual(
    flatten({
      hello: {
        lorem: {
          ipsum: 'again',
          dolor: 'sit'
        }
      },
      world: {
        lorem: {
          ipsum: 'again',
          dolor: 'sit'
        }
      }
    }),
    {
      'hello.lorem.ipsum': 'again',
      'hello.lorem.dolor': 'sit',
      'world.lorem.ipsum': 'again',
      'world.lorem.dolor': 'sit'
    },
    'Multiple Keys'
  )

  t.deepEqual(
    flatten(
      {
        hello: {
          world: {
            again: 'good morning'
          }
        }
      },
      {
        delimiter: ':'
      }
    ),
    {
      'hello:world:again': 'good morning'
    },
    'Custom Delimiter'
  )

  t.deepEqual(
    flatten({
      hello: {
        empty: {
          nested: {}
        }
      }
    }),
    {
      'hello.empty.nested': {}
    },
    'Empty Objects'
  )

  if (typeof Buffer !== 'undefined') {
    t.deepEqual(
      flatten({
        hello: {
          empty: {
            nested: Buffer.from('test')
          }
        }
      }),
      {
        'hello.empty.nested': Buffer.from('test')
      },
      'Buffer'
    )
  }

  if (typeof Uint8Array !== 'undefined') {
    t.deepEqual(
      flatten({
        hello: {
          empty: {
            nested: new Uint8Array([1, 2, 3, 4])
          }
        }
      }),
      {
        'hello.empty.nested': new Uint8Array([1, 2, 3, 4])
      },
      'typed arrays'
    )
  }

  t.deepEqual(
    flatten(
      {
        hello: {
          world: {
            again: 'good morning'
          }
        },
        lorem: {
          ipsum: {
            dolor: 'good evening'
          }
        }
      },
      {
        maxDepth: 2
      }
    ),
    {
      'hello.world': {
        again: 'good morning'
      },
      'lorem.ipsum': {
        dolor: 'good evening'
      }
    },
    'Custom Depth'
  )

  t.deepEqual(
    flatten({
      hello: {
        '0200': 'world',
        '0500': 'darkness my old friend'
      }
    }),
    {
      'hello.0200': 'world',
      'hello.0500': 'darkness my old friend'
    },
    'Should keep number in the left when object'
  )
  t.end()
})

test('Unflatten', function(t) {
  t.deepEqual(
    {
      hello: {
        world: 'good morning'
      }
    },
    unflatten({
      'hello.world': 'good morning'
    }),
    'Nested once'
  )

  t.deepEqual(
    {
      hello: {
        world: {
          again: 'good morning'
        }
      }
    },
    unflatten({
      'hello.world.again': 'good morning'
    }),
    'Nested twice'
  )

  t.deepEqual(
    {
      hello: {
        lorem: {
          ipsum: 'again',
          dolor: 'sit'
        }
      },
      world: {
        greet: 'hello',
        lorem: {
          ipsum: 'again',
          dolor: 'sit'
        }
      }
    },
    unflatten({
      'hello.lorem.ipsum': 'again',
      'hello.lorem.dolor': 'sit',
      'world.lorem.ipsum': 'again',
      'world.lorem.dolor': 'sit',
      world: { greet: 'hello' }
    }),
    'Multiple Keys'
  )

  var x = {}
  x['foo.bar'] = { t: 123 }
  x['foo'] = { p: 333 }
  t.deepEqual(
    unflatten(x),
    {
      foo: {
        bar: {
          t: 123
        },
        p: 333
      }
    },
    'nested objects do not clobber each other when a.b inserted before a'
  )

  t.deepEqual(
    {
      hello: {
        world: {
          again: 'good morning'
        }
      }
    },
    unflatten(
      {
        'hello world again': 'good morning'
      },
      {
        delimiter: ' '
      }
    ),
    'Custom Delimiter'
  )

  t.deepEqual(
    {
      travis: {
        build: {
          dir: '/home/travis/build/kvz/environmental'
        }
      }
    },
    unflatten(
      {
        travis: 'true',
        travis_build_dir: '/home/travis/build/kvz/environmental'
      },
      {
        delimiter: '_',
        overwrite: true
      }
    ),
    'Overwrite'
  )

  t.deepEqual(
    {
      hello: { world: 'again' },
      lorem: { ipsum: 'another' },
      good: {
        morning: {
          hash: {
            key: {
              nested: {
                deep: {
                  and: {
                    even: {
                      deeper: { still: 'hello' }
                    }
                  }
                }
              }
            }
          },
          again: { testing: { this: 'out' } }
        }
      }
    },
    unflatten({
      'hello.world': 'again',
      'lorem.ipsum': 'another',
      'good.morning': {
        'hash.key': {
          'nested.deep': {
            'and.even.deeper.still': 'hello'
          }
        }
      },
      'good.morning.again': {
        'testing.this': 'out'
      }
    }),
    'Messy'
  )

  test('non-object keys + overwrite should be overwritten', function(t) {
    t.deepEqual(unflatten({ a: null, 'a.b': 'c' }, { overwrite: true }), {
      a: { b: 'c' }
    })
    t.deepEqual(unflatten({ a: 0, 'a.b': 'c' }, { overwrite: true }), {
      a: { b: 'c' }
    })
    t.deepEqual(unflatten({ a: 1, 'a.b': 'c' }, { overwrite: true }), {
      a: { b: 'c' }
    })
    t.deepEqual(unflatten({ a: '', 'a.b': 'c' }, { overwrite: true }), {
      a: { b: 'c' }
    })
    t.end()
  })

  test('overwrite value should not affect undefined keys', function(t) {
    t.deepEqual(unflatten({ a: undefined, 'a.b': 'c' }, { overwrite: true }), {
      a: { b: 'c' }
    })
    t.deepEqual(unflatten({ a: undefined, 'a.b': 'c' }, { overwrite: false }), {
      a: { b: 'c' }
    })
    t.end()
  })

  test('if no overwrite, should ignore nested values under non-object key', function(t) {
    t.deepEqual(unflatten({ a: null, 'a.b': 'c' }), { a: null })
    t.deepEqual(unflatten({ a: 0, 'a.b': 'c' }), { a: 0 })
    t.deepEqual(unflatten({ a: 1, 'a.b': 'c' }), { a: 1 })
    t.deepEqual(unflatten({ a: '', 'a.b': 'c' }), { a: '' })
    t.end()
  })

  t.deepEqual(
    flatten({
      hello: [{ world: { again: 'foo' } }, { lorem: 'ipsum' }]
    }),
    {
      'hello.0.world.again': 'foo',
      'hello.1.lorem': 'ipsum'
    },
    'Should not protect arrays'
  )

  var unflattened = unflatten({
    'hello.you.0': 'ipsum',
    'hello.you.1': 'lorem',
    'hello.other.world': 'foo'
  })
  t.deepEqual(
    {
      hello: {
        you: ['ipsum', 'lorem'],
        other: { world: 'foo' }
      }
    },
    unflattened,
    'Should not create object when false'
  )
  t.ok(Array.isArray(unflattened.hello.you))

  if (typeof Buffer !== 'undefined') {
    t.deepEqual(
      unflatten({
        'hello.empty.nested': Buffer.from('test')
      }),
      {
        hello: {
          empty: {
            nested: Buffer.from('test')
          }
        }
      },
      'Buffer'
    )
  }

  if (typeof Uint8Array !== 'undefined') {
    t.deepEqual(
      unflatten({
        'hello.empty.nested': new Uint8Array([1, 2, 3, 4])
      }),
      {
        hello: {
          empty: {
            nested: new Uint8Array([1, 2, 3, 4])
          }
        }
      },
      'typed arrays'
    )
  }
  t.end()
})

test('Arrays', function(t) {
  t.deepEqual(
    flatten({
      a: ['foo', 'bar']
    }),
    {
      a: ['foo', 'bar']
    },
    'Array of strings is not flattened'
  )

  t.deepEqual(
    unflatten({
      'a.0': 'foo',
      'a.1': 'bar'
    }),
    {
      a: ['foo', 'bar']
    },

    'Should be able to revert and reverse array serialization via unflatten'
  )

  t.equal(
    Object.prototype.toString.call(['foo', 'bar']),
    Object.prototype.toString.call(
      unflatten({
        'a.0': 'foo',
        'a.1': 'bar'
      }).a
    ),
    'Array typed objects should be restored by unflatten'
  )

  t.deepEqual(
    unflatten({
      '1key.2_key': 'ok'
    }),
    {
      '1key': {
        '2_key': 'ok'
      }
    },
    'Do not include keys with numbers inside them'
  )
  t.end()
})
