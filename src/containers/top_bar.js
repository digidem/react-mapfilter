import PropTypes from 'prop-types'
import React from 'react'
import { withStyles } from 'material-ui/styles'
import AppBar from 'material-ui/AppBar'
import Toolbar from 'material-ui/Toolbar'
import Typography from 'material-ui/Typography'
import Tabs, { Tab } from 'material-ui/Tabs'
import {defineMessages, FormattedMessage} from 'react-intl'
import classNames from 'classnames'

import CustomContainer from './custom_container'
import {MenuButton} from '../components/buttons'

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
    id: 'topbar.map',
    defaultMessage: 'Map',
    description: 'Map tab name'
  },
  media: {
    id: 'topbar.media',
    defaultMessage: 'Media',
    description: 'Media tab name'
  },
  report: {
    id: 'topbar.report',
    defaultMessage: 'Report',
    description: 'Report tab name'
  }
})

function TopBar ({activeView, views, onChangeTab, buttons, title, classes}) {
  title = typeof title === 'string' ? <Typography type='title' color='inherit'>{title}</Typography> : title
  return (
    <AppBar position='static' className={classes.root}>
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
              label={<FormattedMessage {...messages[view.MfViewId]} />}
              className={classes.heights}
              classes={{label: classes.tabLabels}}
              value={view.MfViewId}
            />
          ))}
        </Tabs>
        <div className={classes.buttons}>
          {buttons.concat([MenuButton]).map((button, i) => <CustomContainer key={i} component={button} />)}
        </div>
      </Toolbar>
    </AppBar>
  )
}

TopBar.defaultProps = {
  buttons: [],
  title: 'MapFilter',
  views: []
}

TopBar.propTypes = {
  buttons: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.element, PropTypes.func])),
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  views: PropTypes.arrayOf(PropTypes.func)
}

export default withStyles(styleSheet)(TopBar)
