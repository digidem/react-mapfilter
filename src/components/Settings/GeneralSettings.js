// import PropTypes from 'prop-types'
import React from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { withStyles } from '@material-ui/core/styles'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import ListItemText from '@material-ui/core/ListItemText'
import Input from '@material-ui/core/Input'
import FormControl from '@material-ui/core/FormControl'
import Select from '@material-ui/core/Select'

import getFieldAnalysis from '../../selectors/field_analysis'
import getFieldMapping from '../../selectors/field_mapping'
import FormattedFieldname from '../Shared/FormattedFieldname'
import { changeCoordinates, updateFieldMapping } from '../../action_creators'
import {
  FILTER_TYPE_DISCRETE,
  FIELD_TYPE_STRING,
  FIELD_TYPE_DATE,
  FORMATS_UTM,
  FORMATS_DEC_DEG,
  FORMATS_DEG_MIN_SEC
} from '../../constants'

const titleFieldTypes = {
  [FIELD_TYPE_STRING]: true,
  [FIELD_TYPE_DATE]: true
}

const styles = {
  select: {
    paddingTop: 8,
    minWidth: 200
  }
}

const SelectField = ({id, value, onChange, children, classes}) => (
  <FormControl>
    <Select
      native
      className={classes.select}
      value={value}
      onChange={onChange}
      input={<Input fullWidth id={id} />}
    >
      {children}
    </Select>
  </FormControl>
)

class GeneralSettings extends React.Component {
  handleChange = (name) => {
    return (e) => {
      if (name === 'coords') {
        this.props.onChangeCoordinates(e.target.value)
      } else {
        this.props.onChangeFieldMapping(name, e.target.value)
      }
    }
  }

  render () {
    const {coordFormat, fields, fieldAnalysis, fieldMapping, classes} = this.props
    const potentialColoredFields = fields
      .filter(field => fieldAnalysis.properties[field].filterType === FILTER_TYPE_DISCRETE)
    const potentialTitleFields = fields
      .filter(field => titleFieldTypes[fieldAnalysis.properties[field].type])
    return (
      <List>
        <ListItem>
          <ListItemText primary='Coordinate format' />
          <ListItemSecondaryAction>
            <SelectField
              id='coords'
              classes={classes}
              value={coordFormat}
              onChange={this.handleChange('coords')}>
              <option value={FORMATS_DEC_DEG}>Decimal degrees</option>
              <option value={FORMATS_DEG_MIN_SEC}>Degrees, minutes, seconds</option>
              <option value={FORMATS_UTM}>UTM</option>
            </SelectField>
          </ListItemSecondaryAction>
        </ListItem>
        <ListItem>
          <ListItemText primary='Title field' />
          <ListItemSecondaryAction>
            <SelectField
              id='title-field'
              fullWidth
              classes={classes}
              value={fieldMapping.title}
              onChange={this.handleChange('title')}>
              {potentialTitleFields.map((field, i) => (
                <FormattedFieldname key={i} fieldname={field}>
                  {msg => <option value={field}>{msg}</option>}
                </FormattedFieldname>
              ))}
            </SelectField>
          </ListItemSecondaryAction>
        </ListItem>
        <ListItem>
          <ListItemText primary='Subtitle field' />
          <ListItemSecondaryAction>
            <SelectField
              id='subtitle-field'
              value={fieldMapping.subtitle}
              classes={classes}
              onChange={this.handleChange('subtitle')}>
              {potentialTitleFields.map((field, i) => (
                <FormattedFieldname key={i} fieldname={field}>
                  {msg => <option value={field}>{msg}</option>}
                </FormattedFieldname>
              ))}
            </SelectField>
          </ListItemSecondaryAction>
        </ListItem>
        <ListItem>
          <ListItemText primary='Colored field' />
          <ListItemSecondaryAction>
            <SelectField
              id='colored-field'
              classes={classes}
              value={fieldMapping.color}
              onChange={this.handleChange('color')}>
              {potentialColoredFields.map((field, i) => (
                <FormattedFieldname key={i} fieldname={field}>
                  {msg => <option value={field}>{msg}</option>}
                </FormattedFieldname>
              ))}
            </SelectField>
          </ListItemSecondaryAction>
        </ListItem>
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
    onChangeCoordinates: (coordFormat) => {
      console.log(coordFormat)
      dispatch(changeCoordinates(coordFormat))
    },
    onChangeFieldMapping: (type, field) => dispatch(updateFieldMapping({type, field}))
  }
}

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withStyles(styles)
)(GeneralSettings)
