const React = require('react')
const { PropTypes } = React
const pure = require('recompose/pure').default
const {List, ListItem} = require('material-ui/List')
const AddIcon = require('material-ui/svg-icons/content/add').default

const DiscreteFilter = require('./discrete_filter')
const ContinuousFilter = require('./continuous_filter')

const style = {
  outer: {
    width: '25%',
    height: '100%',
    minWidth: 200,
    position: 'absolute',
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

const Filter = ({
  filters = {},
  fieldStats = {},
  visibleFilterFields = [],
  onUpdateFilter = (x) => x
}) => (
  <div style={style.outer}>
    <List style={style.list}>
      {visibleFilterFields.map((f) => {
        const field = fieldStats[f]
        const filter = filters[f]
        switch (field.filterType) {
          case 'discrete':
            return <DiscreteFilter
              key={f}
              fieldName={f}
              checked={filter ? filter.in : Object.keys(field.values)}
              values={field.values}
              onUpdate={onUpdateFilter}
              />
          case 'number':
          case 'date':
            return <ContinuousFilter
              key={f}
              isDate={field.type === 'date'}
              fieldName={f}
              filter={filter}
              min={filter ? filter['>='] : field.min}
              max={filter ? filter['<='] : field.max}
              valueMin={field.min}
              valueMax={field.max}
              onUpdate={onUpdateFilter}
              />
        }
      })}
      <ListItem
        innerDivStyle={style.listItemInner}
        leftIcon={<AddIcon style={style.listIcon} />}
        primaryText='Add Filter...'
      />
    </List>
  </div>
)

Filter.propTypes = {
  filters: PropTypes.object,
  fieldStats: PropTypes.object.isRequired,
  visibleFilterFields: PropTypes.arrayOf(PropTypes.string).isRequired,
  /* called with valid mapbox-gl filter when updated */
  onUpdateFilter: PropTypes.func
}

module.exports = pure(Filter)
