const React = require('react')
const { PropTypes } = React
const pure = require('recompose/pure').default
const {List, ListItem} = require('material-ui/List')
const Divider = require('material-ui/Divider').default
const SettingsIcon = require('material-ui/svg-icons/action/settings').default
const {defineMessages, FormattedMessage} = require('react-intl')

const DiscreteFilter = require('./discrete_filter')
const DateFilter = require('./date_filter')
const {FILTER_TYPES} = require('../constants')

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
    paddingLeft: 48
  },
  listIcon: {
    left: 0
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
  onUpdateFilter = (x) => x
}) => (
  <div className="filter" style={style.outer}>
    <List style={style.list}>
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
      <ListItem
        innerDivStyle={style.listItemInner}
        leftIcon={<SettingsIcon style={style.listIcon} />}
        primaryText={<FormattedMessage {...messages.changeFilters} />}
      />
    </List>
  </div>
)

Filter.propTypes = {
  filters: PropTypes.object,
  fieldStats: PropTypes.object.isRequired,
  visibleFilters: PropTypes.arrayOf(PropTypes.string).isRequired,
  /* called with valid mapbox-gl filter when updated */
  onUpdateFilter: PropTypes.func
}

module.exports = pure(Filter)
