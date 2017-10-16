import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Autosuggest from 'react-autosuggest'
import TextField from 'material-ui/TextField'
import Paper from 'material-ui/Paper'
import { MenuItem } from 'material-ui/Menu'
import IsolatedScroll from 'react-isolated-scroll'
import match from 'autosuggest-highlight/match'
import parse from 'autosuggest-highlight/parse'
import omit from 'lodash/omit'
import isEqual from 'lodash/isEqual'
import assign from 'object-assign'
import { withStyles } from 'material-ui/styles'

const ITEM_HEIGHT = 48

const styleSheet = theme => ({
  container: {
    flexGrow: 1,
    position: 'relative',
    fontSize: 14
  },
  suggestionsContainerOpen: {
    position: 'absolute',
    marginTop: theme.spacing.unit,
    marginBottom: theme.spacing.unit * 3,
    left: 0,
    right: 0,
    zIndex: 99
  },
  suggestionsContainerInner: {
    maxHeight: ITEM_HEIGHT * 6.5,
    overflowY: 'auto'
  },
  suggestion: {
    display: 'block',
    fontSize: 14
  },
  suggestionsList: {
    margin: 0,
    padding: 0,
    listStyleType: 'none'
  },
  textField: {
    width: '100%'
  }
})

function renderInput (props) {
  const {classes, home, value, inputRef, ref, style} = props
  const inputProps = assign({},
    omit(props, ['classes', 'home', 'value', 'inputRef', 'ref', 'style']),
    {classes: classes.input}
  )
  function callRef (el) {
    inputRef(el)
    ref(el)
  }
  return (
    <TextField
      style={style}
      autoFocus={home}
      className={classes.textField}
      value={value}
      inputRef={callRef}
      InputProps={inputProps}
    />
  )
}

function renderSuggestion (suggestion, { query, isHighlighted }) {
  const matches = match(suggestion, query)
  const parts = parse(suggestion, matches)

  return (
    <MenuItem dense selected={isHighlighted} component='div' style={{fontSize: 14}}>
      <div>
        {parts.map((part, index) => {
          return part.highlight
            ? <span key={index} style={{ fontWeight: 500 }}>
              {part.text}
            </span>
            : <strong key={index} style={{ fontWeight: 300 }}>
              {part.text}
            </strong>
        })}
      </div>
    </MenuItem>
  )
}

function getSuggestionValue (suggestion) {
  return suggestion
}

function shouldRenderSuggestions () {
  return true
}

function getSuggestions (value, suggestions) {
  const inputValue = value.trim().toLowerCase()
  const inputLength = inputValue.length
  let count = 0

  return inputLength === 0
    ? suggestions
    : suggestions.filter(suggestion => {
      const keep =
          count < 5 && suggestion.toLowerCase().slice(0, inputLength) === inputValue

      if (keep) {
        count += 1
      }

      return keep
    })
}

class Select extends Component {
  constructor (props) {
    super(props)
    this.state = {
      suggestions: props.suggestions
    }
    this.getSuggestions = this.getSuggestions.bind(this)
    this.resetSuggestions = this.resetSuggestions.bind(this)
    this.selectInputText = this.selectInputText.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.renderSuggestionsContainer = this.renderSuggestionsContainer.bind(this)
  }

  componentWillReceiveProps (nextProps) {
    if (!isEqual(nextProps.suggestions, this.props.suggestions)) {
      this.setState({suggestions: nextProps.suggestions})
    }
  }

  renderSuggestionsContainer ({containerProps, children}) {
    const callRef = isolatedScroll => {
      if (isolatedScroll !== null) {
        containerProps.ref(isolatedScroll.component)
      }
    }
    return (
      <Paper {...containerProps}>
        <IsolatedScroll ref={callRef} className={this.props.classes.suggestionsContainerInner}>
          {children}
        </IsolatedScroll>
      </Paper>
    )
  }

  getSuggestions ({ value }) {
    this.setState({
      suggestions: this.justFocussed ? this.props.suggestions : getSuggestions(value, this.props.suggestions)
    })
  }

  resetSuggestions () {
    this.setState({
      suggestions: this.props.suggestions
    })
  }

  selectInputText (e) {
    e.target.select()
    this.justFocussed = true
    // Naughty? But it works... *WARNING* relies on an internal method of react-autosuggest
    this.autosuggest && this.autosuggest.revealSuggestions()
  }

  handleChange (e, d) {
    this.justFocussed = false
    this.props.onChange(e, d)
  }

  render () {
    const { classes, className, value, onSuggestionSelected, onKeyDown, style } = this.props
    return (
      <Autosuggest
        ref={(el) => (this.autosuggest = el)}
        theme={{
          container: classes.container + ' ' + className,
          suggestionsContainerOpen: classes.suggestionsContainerOpen,
          suggestionsList: classes.suggestionsList,
          suggestion: classes.suggestion
        }}
        shouldRenderSuggestions={shouldRenderSuggestions}
        renderInputComponent={renderInput}
        suggestions={this.state.suggestions}
        onSuggestionsFetchRequested={this.getSuggestions}
        onSuggestionsClearRequested={this.resetSuggestions}
        onSuggestionSelected={onSuggestionSelected}
        renderSuggestionsContainer={this.renderSuggestionsContainer}
        getSuggestionValue={getSuggestionValue}
        renderSuggestion={renderSuggestion}
        inputProps={{
          inputRef: (el) => (this.input = el),
          style,
          classes,
          value,
          onChange: this.handleChange,
          onFocus: this.selectInputText,
          onClick: this.selectInputText,
          onKeyDown: onKeyDown
        }}
      />
    )
  }
}

Select.propTypes = {
  classes: PropTypes.object.isRequired,
  suggestions: PropTypes.arrayOf(PropTypes.string),
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  onSuggestionSelected: PropTypes.func,
  onKeyDown: PropTypes.func,
  style: PropTypes.object
}

Select.defaultProps = {
  onSuggestionSelected: () => null,
  onKeyDown: () => null,
  value: '',
  classes: {}
}

export default withStyles(styleSheet)(Select)
