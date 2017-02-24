import React from 'react'
const { PropTypes } = React
import pure from 'recompose/pure'
import {List, ListItem} from 'material-ui/List'
import Divider from 'material-ui/Divider'
import SettingsIcon from 'material-ui/svg-icons/action/settings'
import {defineMessages, FormattedMessage} from 'react-intl'

import DiscreteFilter from './discrete_filter'
import DateFilter from './date_filter'
import {FILTER_TYPES} from '../constants'

const style = {
  outer: {
    minWidth: 300,
    maxWidth: '33%',
    overflowY: 'auto',
    zIndex: 1,
    boxShadow: 'rgba(0, 0, 0, 0.117647) 0px 1px 6px, rgba(0, 0, 0, 0.117647) 0px 1px 4px'
  },
  list: {
    paddingTop: 0
  },
  listItemInner: {
    padding: 0
  },
  listIcon: {
    fill: 'rgb(117, 117, 117)',
    left: 0,
    top: 0,
    margin: '12px',
    position: 'absolute'
  },
  link: {
    color: '#000',
    display: 'block',
    padding: '16px 16px 16px 48px',
    textDecoration: 'none'
  }
}

const messages = defineMessages({
  changeFilters: {
    id: 'filter.change',
    defaultMessage: 'Change Filters…',
    description: 'Button text to change which fields are shown and filterable in the filter pane'
  }
})

const Filter = ({
  filters = {},
  fieldStats = {},
  visibleFilters = [],
  coloredField,
  colorIndex,
  onUpdateFilter = x => x,
  onClickSettings = x => x
}) => (
  <div className='filter' style={style.outer}>
    <List style={style.list}>
      {/* TODO allow these to be reordered */}
      {visibleFilters.map((f) => {
        const field = fieldStats[f]
        const filter = filters[f]
        switch (field.filterType) {
          case FILTER_TYPES.DISCRETE:
            return (
              <div key={f}>
                <DiscreteFilter
                  fieldName={f}
                  checked={filter ? filter.in : Object.keys(field.values)}
                  values={field.values}
                  colored={coloredField === f || coloredField + '.0' === f}
                  colorIndex={colorIndex}
                  onUpdate={onUpdateFilter} />
                <Divider />
              </div>
            )
          case FILTER_TYPES.RANGE:
            return
          case FILTER_TYPES.DATE:
            return (
              <div key={f}>
                <DateFilter
                  fieldName={f}
                  filter={filter}
                  min={filter ? filter['>='] : field.valueStats.min}
                  max={filter ? filter['<='] : field.valueStats.max}
                  valueMin={field.valueStats.min}
                  valueMax={field.valueStats.max}
                  onUpdate={onUpdateFilter} />
                <Divider />
              </div>
            )
        }
      })}
      <ListItem innerDivStyle={style.listItemInner}>
        <a style={style.link} onClick={onClickSettings}>
          <FormattedMessage {...messages.changeFilters} /> <SettingsIcon style={style.listIcon} />
        </a>
      </ListItem>
    </List>
  </div>
)

Filter.propTypes = {
  filters: PropTypes.object,
  fieldStats: PropTypes.object.isRequired,
  visibleFilters: PropTypes.arrayOf(PropTypes.string).isRequired,
  /* called with valid mapbox-gl filter when updated */
  onUpdateFilter: PropTypes.func,
  onClickSettings: PropTypes.func
}

export default pure(Filter)
