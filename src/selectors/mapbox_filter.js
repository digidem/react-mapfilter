import { createSelector } from 'reselect'

import {isArrayLike} from '../util/filter_helpers'
import getFieldAnalysis from './field_analysis'

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
        if (fieldAnalysis.properties[f] && isArrayLike(fieldAnalysis.properties[f].type)) {
          const subFilter = ['any', ['in', f, ...exp.in]]
          for (let i = 0; i < fieldAnalysis.properties[f].maxArrayLength; i++) {
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

export default getMapboxFilter
