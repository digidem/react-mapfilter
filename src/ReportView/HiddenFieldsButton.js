import PropTypes from 'prop-types'
import React from 'react'
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff'
import { defineMessages, FormattedMessage } from 'react-intl'

import { ToolbarButton } from '../Toolbar'
import HiddenFieldsMenu from './HiddenFieldsMenu'
import { fieldAnalysis as fieldAnalysisPropType } from '../../util/prop_types'

const messages = defineMessages({
  // Button label for hide fields menu
  hideFieldsLabel: `{count, plural,
    =0 {Hide Fields}
    one {# Hidden Field}
    other {# Hidden Fields}
  }`,
  // Button label for print
  printLabel: 'Print'
})

class ReportToolbar extends React.Component {
  state = {
    hideFieldsOpen: false
  }

  handleHideFieldsButtonClick = event => {
    this.setState({
      hideFieldsOpen: !this.state.hideFieldsOpen,
      hideFieldsButtonEl: event.currentTarget
    })
  }

  render() {
    const {
      fieldAnalysis,
      hiddenFields,
      onToggleFieldVisibility,
      requestPrint,
      onShowAll,
      onHideAll
    } = this.props
    const fields = getFieldList(fieldAnalysis, hiddenFields)
    const hiddenCount = Object.keys(hiddenFields).filter(
      key => hiddenFields[key]
    ).length
    return (
      <React.Fragment>
        <ToolbarButton onClick={this.handleHideFieldsButtonClick}>
          <VisibilityOffIcon />
          <FormattedMessage
            {...messages.hideFieldsLabel}
            values={{ count: hiddenCount }}
          />
        </ToolbarButton>
        <HiddenFieldsMenu
          anchorEl={this.state.hideFieldsButtonEl}
          open={this.state.hideFieldsOpen}
          fields={fields}
          onShowAll={onShowAll}
          onHideAll={onHideAll}
          onToggle={onToggleFieldVisibility}
          onRequestClose={() => this.setState({ hideFieldsOpen: false })}
        />
      </React.Fragment>
    )
  }
}

ReportToolbar.defaultProps = {
  hiddenFields: {}
}

ReportToolbar.propTypes = {
  fieldAnalysis: fieldAnalysisPropType.isRequired,
  hiddenFields: PropTypes.objectOf(PropTypes.bool),
  requestPrint: PropTypes.func.isRequired
}

function getFieldList(fieldAnalysis, hiddenFields) {
  return Object.keys(fieldAnalysis.properties).map(key => ({
    key: key,
    hidden: !!hiddenFields[key]
  }))
}

export default ReportToolbar
