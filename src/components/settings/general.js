// import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'
import { List, ListItem } from 'material-ui/List'
import SelectField from 'material-ui/SelectField'
import MenuItem from 'material-ui/MenuItem'

import getFieldAnalysis from '../../selectors/field_analysis'
import getFieldMapping from '../../selectors/field_mapping'
import FormattedFieldname from '../shared/formatted_fieldname'
import { changeCoordinates, updateFieldMapping } from '../../action_creators'
import { FILTER_TYPE_DISCRETE, FIELD_TYPE_STRING } from '../../constants'

const styles = {
  select: {
    width: 150
  }
}

class GeneralSettings extends React.Component {
  render () {
    const {onChangeCoordinates, onChangeFieldMapping, coordFormat, fields, fieldAnalysis, fieldMapping} = this.props
    const potentialColoredFields = fields
      .filter(field => fieldAnalysis.properties[field].filterType === FILTER_TYPE_DISCRETE)
    const potentialTitleFields = fields
      .filter(field => fieldAnalysis.properties[field].type === FIELD_TYPE_STRING)
    return (
      <List>
        <ListItem
          primaryText='Coordinate format'
          disabled
          rightIconButton={
            <SelectField
              value={coordFormat}
              onChange={onChangeCoordinates}
              style={styles.select}
            >
              <MenuItem value='lonlat' primaryText='Lon / Lat' />
              <MenuItem value='utm' primaryText='UTM' />
            </SelectField>}
        />
        <ListItem
          primaryText='Title field'
          disabled
          rightIconButton={
            <SelectField
              value={fieldMapping.title}
              onChange={onChangeFieldMapping.bind(null, 'title')}
              style={styles.select}
              maxHeight={400}
            >
              {potentialTitleFields.map((field, i) => (
                <MenuItem key={i} value={field} primaryText={<FormattedFieldname fieldname={field} />} />
              ))}
            </SelectField>}
        />
        <ListItem
          key={3}
          primaryText='Subtitle field'
          disabled
          rightIconButton={
            <SelectField
              value={fieldMapping.subtitle}
              onChange={onChangeFieldMapping.bind(null, 'subtitle')}
              style={styles.select}
              maxHeight={400}
            >
              {potentialTitleFields.map((field, i) => (
                <MenuItem key={i} value={field} primaryText={<FormattedFieldname fieldname={field} />} />
              ))}
            </SelectField>}
        />
        <ListItem
          key={4}
          primaryText='Colored field'
          disabled
          rightIconButton={
            <SelectField
              value={fieldMapping.color}
              onChange={onChangeFieldMapping.bind(null, 'color')}
              style={styles.select}
              maxHeight={400}
            >
              {potentialColoredFields.map((field, i) => (
                <MenuItem key={i} value={field} primaryText={<FormattedFieldname fieldname={field} />} />
              ))}
            </SelectField>}
        />
      </List>
    )
  }
}

function mapStateToProps (state) {
  return {
    coordFormat: state.settings.coordFormat,
    fields: Object.keys(getFieldAnalysis(state).properties),
    fieldAnalysis: getFieldAnalysis(state),
    fieldMapping: getFieldMapping(state)
  }
}

function mapDispatchToProps (dispatch) {
  return {
    onChangeCoordinates: (e, i, coordFormat) => dispatch(changeCoordinates(coordFormat)),
    onChangeFieldMapping: (type, e, i, field) => dispatch(updateFieldMapping({type, field}))
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GeneralSettings)
