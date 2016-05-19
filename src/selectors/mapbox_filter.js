const { createSelector } = require('reselect')

/**
 * Builds a valid mapbox-gl filter expression our filters, which
 * are organized by key.
 * @example
 * ```
 * getMapboxFilter({foo: {in: ['bar', 'baz']}, qux: {'>=': 1, '<=': 3}})
 * // ['all', ['in', 'foo', bar', 'baz'], ['all', ['>=', 'qux', 1], ['<=', 'qux', 3]]]
 * ```
 * @param {object} filtersByField
 * @return {array} valid mapbox-gl filter
 */
const getMapboxFilter = createSelector(
  (state) => state.filters,
  (filters) => {
    return Object.keys(filters).reduce(function (p, f) {
      const exp = filters[f]
      if (exp.in) {
        p.push(['in', f, ...exp.in])
      } else if (exp['<='] || exp['>=']) {
        const compoundExp = ['all']
        if (exp['<=']) compoundExp.push(['<=', f, exp['<=']])
        if (exp['>=']) compoundExp.push(['>=', f, exp['>=']])
        p.push(compoundExp)
      }
      return p
    }, ['all'])
  }
)

module.exports = getMapboxFilter
