import React from 'react'
import { connect } from 'react-redux'
import { withStyles } from 'material-ui/styles'
import { bindActionCreators } from 'redux'
import find from 'lodash/find'
import assign from 'object-assign'

import CustomContainer from './custom_container'
import TopBar from './top_bar'
import * as actionCreators from '../action_creators'

import Dialog from 'material-ui/Dialog'
import FilterPane from '../components/filter'
import FeatureDetail from '../components/feature_detail'
import Settings from '../components/settings'
import MapView from '../components/map'
import ReportView from '../components/report'
import MediaView from '../components/media'
import {createElement} from '../util/general_helpers'
import PrintDialog from '../components/PrintDialog'

const styles = theme => ({
  outer: {
    position: 'fixed',
    top: 0,
    bottom: 0,
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    '@media print': {
      display: 'block',
      position: 'static',
      bottom: 'auto'
    }
  },
  inner: {
    display: 'flex',
    flex: 1,
    '@media print': {
      display: 'block'
    }
  },
  modalRoot: {
    display: 'block',
    overflow: 'scroll'
  },
  modalPaper: {
    [theme.breakpoints.down('sm')]: {
      padding: 0
    },
    backgroundColor: 'initial',
    maxHeight: 'initial',
    minHeight: '100%',
    position: 'relative',
    margin: '0 auto',
    padding: 32,
    boxShadow: 'none',
    boxSizing: 'border-box',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    pointerEvents: 'none'
  },
  modalPaperMd: {
    maxWidth: 800
  },
  modalInner: {
    pointerEvents: 'auto'
  },
  view: {
    flex: 3,
    position: 'relative'
  },
  actionButton: {
    position: 'absolute',
    bottom: 36,
    right: 36,
    zIndex: 2,
    '@media only print': {
      display: 'none'
    }
  },
  '@global': {
    '@page': {
      margin: '0.5in'
    },
    '@media only print': {
      'body, html': {
        overflow: 'visible'
      },
      '.d-print-none': {
        display: 'none'
      },
      /* Override display: flex which breaks page-break-after */
      // Fix for page-break-after not working in Chrome see http://stackoverflow.com/questions/4884380/css-page-break-not-working-in-all-browsers/5314590
      div: {
        float: 'none !important'
      },
      /* TODO include some form of MapFilter header */
      /* TODO rotate the filter display and show state vs. allow interaction */
      '.mapboxgl-control-container': {
        display: 'none'
      }
    }
  }
})

class IndexRoute extends React.Component {
  componentWillMount () {
    this.redirectIfNecessary(this.props)
  }

  componentWillReceiveProps (nextProps) {
    this.redirectIfNecessary(nextProps)
  }

  redirectIfNecessary ({activeModal, activeView, views, redirectView}) {
    if (!find(views, {MfViewId: activeView})) return redirectView(views[0].MfViewId)
    // if (activeModal && !getModalComponent(activeModal)) redirectView(activeView)
  }

  render () {
    const {activeView, activeModal, actionButton, classes, views, switchView,
      settingsTab, toolbarButtons, toolbarTitle, print, paperSize, cancelPrint, changePaperSize} = this.props
    const ViewComponent = getViewComponent(activeView, views)

    return (
      <div className={classes.outer}>
        <TopBar views={views} activeView={activeView} onChangeTab={switchView} buttons={toolbarButtons} title={toolbarTitle} />
        <div className={classes.inner}>
          <FilterPane />
          <div className={classes.view}>
            <CustomContainer component={ViewComponent} />
          </div>
          {actionButton && <div className={classes.actionButton}>{createElement(actionButton)}</div>}
        </div>
        <Dialog
          onRequestClose={this.props.closeModal}
          open={activeModal === 'feature'}
          fullWidth
          maxWidth='md'
          classes={{root: classes.modalRoot, paper: classes.modalPaper, paperWidthMd: classes.modalPaperMd}}>
          <FeatureDetail onCloseClick={this.props.closeModal} className={classes.modalInner} />}
        </Dialog>
        <Dialog
          onRequestClose={this.props.closeModal}
          open={activeModal === 'settings'}
          fullWidth
          classes={{root: classes.modalRoot, paper: classes.modalPaper}}>
          <Settings activeTabId={settingsTab} onCloseClick={this.props.closeModal} className={classes.modalInner} />}
        </Dialog>
        <PrintDialog open={print} onRequestClose={cancelPrint} onChangePaperSize={changePaperSize} paperSize={paperSize} />
      </div>
    )
  }
}

IndexRoute.defaultProps = {
  views: [MapView, MediaView, ReportView],
  activeView: 'map'
}

function getViewComponent (activeView, views) {
  var view = find(views, {MfViewId: activeView})
  if (!view) return () => <div />
  return view
}

export default connect(
  (state) => assign({}, state.ui || {}, state.print),
  (dispatch) => bindActionCreators(actionCreators, dispatch)
)(withStyles(styles)(IndexRoute))
