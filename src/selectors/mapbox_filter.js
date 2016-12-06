const { createSelector } = require('reselect')
const {FIELD_TYPES} = require('../constants')

const getFieldAnalysis = require('./field_analysis')

function isArrayLike (fieldType) {
  return [FIELD_TYPES.ARRAY, FIELD_TYPES.NUMBER_OR_ARRAY, FIELD_TYPES.STRING_OR_ARRAY].indexOf(fieldType) > -1
}

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
  getFieldAnalysis,
  (filters, fieldAnalysis) => {
    return Object.keys(filters).reduce(function (p, f) {
      const exp = filters[f]
      if (exp.in) {
        if (isArrayLike(fieldAnalysis[f].type)) {
          const subFilter = ['any', ['in', f, ...exp.in]]
          for (let i = 0; i < fieldAnalysis[f].maxArrayLength; i++) {
            subFilter.push(['in', f + '.' + i, ...exp.in])
          }
          p.push(subFilter)
        } else {
          p.push(['in', f, ...exp.in])
        }
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
