import PropTypes from 'prop-types'
import React from 'react'
import { withStyles } from 'material-ui/styles'
import MuiAppBar from 'material-ui/AppBar'
import Toolbar from 'material-ui/Toolbar'
import Typography from 'material-ui/Typography'
import Tabs, { Tab } from 'material-ui/Tabs'
import {defineMessages, FormattedMessage} from 'react-intl'
import classNames from 'classnames'

import CustomContainer from '../containers/ViewContainer'
import ConnectMenuButton from '../containers/ConnectMenuButton'

const styleSheet = theme => ({
  root: {
    '@media print': {
      display: 'none'
    }
  },
  toolbar: {
    justifyContent: 'space-between',
    '-webkit-font-smoothing': 'antialiased'
  },
  buttons: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  heights: {
    minHeight: 48,
    [theme.breakpoints.up('md')]: {
      minHeight: 56
    },
    [theme.breakpoints.up('lg')]: {
      minHeight: 64
    }
  },
  tabLabels: {
    [theme.breakpoints.up('md')]: {
      fontSize: theme.typography.fontSize
    },
    [theme.breakpoints.up('lg')]: {
      fontSize: theme.typography.fontSize + 1
    }
  }
})

const messages = defineMessages({
  map: {
    id: 'view.map.name',
    defaultMessage: 'Map',
    description: 'Map tab name'
  },
  media: {
    id: 'view.media.name',
    defaultMessage: 'Media',
    description: 'Media tab name'
  },
  report: {
    id: 'view.report.name',
    defaultMessage: 'Report',
    description: 'Report tab name'
  }
})

const getViewMessage = (viewId) => ({
  id: 'view.' + viewId + '.name',
  defaultMessage: viewId
})

function AppBar ({activeView, views, onChangeTab, buttons, title, menuItems, classes}) {
  title = typeof title === 'string' ? <Typography type='title' color='inherit'>{title}</Typography> : title
  return (
    <MuiAppBar position='static' className={classes.root}>
      <Toolbar className={classNames(classes.toolbar, classes.heights)}>
        <div>{title}</div>
        <Tabs
          value={activeView}
          onChange={(e, value) => onChangeTab(value)}
          centered
        >
          {views.map((view) => (
            <Tab
              key={view.MfViewId}
              label={<FormattedMessage {...(messages[view.MfViewId] || getViewMessage(view.MfViewId))} />}
              className={classes.heights}
              classes={{label: classes.tabLabels}}
              value={view.MfViewId}
            />
          ))}
        </Tabs>
        <div className={classes.buttons}>
          {buttons.map((button, i) => <CustomContainer key={i} component={button} />)}
          <ConnectMenuButton menuItems={menuItems} />
        </div>
      </Toolbar>
    </MuiAppBar>
  )
}

AppBar.defaultProps = {
  buttons: [],
  title: 'MapFilter',
  views: []
}

AppBar.propTypes = {
  buttons: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.element, PropTypes.func])),
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  views: PropTypes.arrayOf(PropTypes.func)
}

export default withStyles(styleSheet)(AppBar)
