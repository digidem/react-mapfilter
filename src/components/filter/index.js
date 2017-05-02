import PropTypes from 'prop-types';
import React from 'react'
import { connect } from 'react-redux'
import {List, ListItem} from 'material-ui/List'
import Divider from 'material-ui/Divider'
import SettingsIcon from 'material-ui/svg-icons/action/settings'
import {defineMessages, FormattedMessage} from 'react-intl'

import getFilterFields from '../../selectors/filter_fields'
import getFieldAnalysis from '../../selectors/field_analysis'
import getFieldMapping from '../../selectors/field_mapping'
import getColorIndex from '../../selectors/color_index'

import { updateFilter, openSettings } from '../../action_creators'

import DiscreteFilter from './discrete_filter'
import DateFilter from './date_filter'
import {
  FILTER_TYPE_DISCRETE,
  FILTER_TYPE_RANGE,
  FILTER_TYPE_DATE,
  FILTER_TYPE_TEXT
} from '../../constants'

const style = {
  outer: {
    minWidth: 300,
    flex: 1,
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
  filterFields = [],
  coloredField,
  colorIndex,
  onUpdateFilter = x => x,
  onClickSettings = x => x
}) => (
  <div className='filter' style={style.outer}>
    <List style={style.list}>
      {/* TODO allow these to be reordered */}
      {filterFields.map((f) => {
        const field = fieldStats.properties[f] || {}
        const filter = filters[f]
        switch (field.filterType) {
          case FILTER_TYPE_DISCRETE:
            return (
              <div key={f}>
                <DiscreteFilter
                  fieldName={f}
                  checked={filter ? filter.in : field.values.map(v => v.value)}
                  values={field.values}
                  colored={coloredField === f || coloredField + '.0' === f}
                  colorIndex={colorIndex}
                  onUpdate={onUpdateFilter} />
                <Divider />
              </div>
            )
          case FILTER_TYPE_RANGE:
            return
          case FILTER_TYPE_TEXT:
            return
          case FILTER_TYPE_DATE:
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
  filterFields: PropTypes.arrayOf(PropTypes.string).isRequired,
  /* called with valid mapbox-gl filter when updated */
  onUpdateFilter: PropTypes.func,
  onClickSettings: PropTypes.func
}

function mapStateToProps (state) {
  return {
    filters: state.filters,
    filterFields: getFilterFields(state),
    fieldStats: getFieldAnalysis(state),
    coloredField: getFieldMapping(state).color,
    colorIndex: getColorIndex(state)
  }
}

function mapDispatchToProps (dispatch) {
  return {
    onUpdateFilter: filter => dispatch(updateFilter(filter)),
    onClickSettings: () => dispatch(openSettings('filters'))
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Filter)
