import React from 'react'
import { connect } from 'react-redux'
import { findDOMNode } from 'react-dom'
const PropTypes = React.PropTypes

import { Card, CardText, CardHeader } from 'material-ui/Card'
import IconButton from 'material-ui/IconButton'
import CloseIcon from 'material-ui/svg-icons/navigation/close'
import CircularProgress from 'material-ui/CircularProgress'
import CheckCircleIcon from 'material-ui/svg-icons/action/check-circle'
import RaisedButton from 'material-ui/RaisedButton'
import Snackbar from 'material-ui/Snackbar'
import WarningIcon from 'material-ui/svg-icons/alert/warning'
import { List, ListItem } from 'material-ui/List'
import Subheader from 'material-ui/Subheader'
import colors from 'material-ui/styles/colors'
import { defineMessages, FormattedMessage } from 'react-intl'
import dragDrop from 'drag-drop'
import Uploader from 'xform-uploader'

require('../../css/uploader.css')

const noop = () => null

const styles = {
  card: {
    maxHeight: '100%',
    width: '100%',
    flex: 1,
    display: 'flex',
    flexDirection: 'column'
  },
  cardContainerStyle: {
    flex: 1,
    flexDirection: 'column',
    display: 'flex'
  },
  cardText: {
    overflow: 'auto'
  },
  header: {
    lineHeight: '22px',
    boxSizing: 'content-box',
    borderBottom: '1px solid #cccccc'
  },
  uploadBox: {
    backgroundColor: '#eee',
    border: '2px dashed #aaa',
    color: '#ccc',
    fontWeight: 'bold',
    fontSize: '46px',
    padding: '25px',
    textAlign: 'center'
  }
}

const messages = defineMessages({
  dragHere: {
    id: 'upload.dragHere',
    defaultMessage: 'DRAG HERE',
    description: 'Drag target when uploading forms'
  },
  pendingForms: {
    id: 'upload.pendingForms',
    defaultMessage: 'Forms',
    description: 'Subheader text when listing forms available to upload'
  },
  missingAttachments: {
    id: 'upload.missingAttachments',
    defaultMessage: 'Missing Attachments',
    description: 'Subheader text when listing attachments that are missing from pending forms'
  },
  upload: {
    id: 'upload.upload',
    defaultMessage: 'Upload',
    description: 'Button text when uploading forms'
  },
  uploadFormData: {
    id: 'upload.uploadFormData',
    defaultMessage: 'Add Form Data',
    description: 'Dialog title text when allowing users to upload form data'
  }
})

class UploadFormDataModal extends React.Component {
  static propTypes = {
    mediaUrl: PropTypes.string.isRequired,
    observationsUrl: PropTypes.string.isRequired,
    onCloseClick: PropTypes.func.isRequired
  }

  state = {
    forms: [],
    missingAttachments: [],
    orphanAttachments: [],
    showSnackbar: false,
    snackbarMessage: 'Forms uploaded.',
    uploading: false
  }

  uploadForms = () => {
    const { mediaUrl, observationsUrl } = this.props

    // trigger progress spinner
    this.setState({
      uploading: true
    })

    this.uploader.upload({
      mediaUrl,
      observationsUrl
    }, err => {
      this.setState({
        uploading: false
      })

      // cancel progress spinner
      if (err) {
        return console.warn(err.stack)
      }

      this.setState({
        showSnackbar: true
      })

      this.resetUploader()
    })
  }

  resetUploader () {
    this.uploader = new Uploader()

    this.uploader.on('change', () => {
      this.setState(this.uploader.state())
    })

    this.setState(this.uploader.state())
  }

  componentDidMount () {
    this.resetUploader()

    this.removeDragDrop = dragDrop(findDOMNode(this.uploadContainer), files => {
      this.uploader.add(files, err => {
        if (err) {
          console.warn(err.stack)
        }
      })
    })
  }

  componentWillUnmount () {
    this.removeDragDrop()
  }

  render () {
    const { onCloseClick } = this.props
    const { forms, showSnackbar, snackbarMessage, uploading } = this.state

    return (
      <Card
        style={styles.card}
        containerStyle={styles.cardContainerStyle}
        zDepth={2}>
        <CardHeader
          style={styles.header}
          title={<h3 style={styles.title}><FormattedMessage {...messages.uploadFormData} /></h3>}>
          <IconButton style={{float: 'right'}} onTouchTap={onCloseClick}>
            <CloseIcon />
          </IconButton>
        </CardHeader>
        <CardText ref={el => (this.uploadContainer = el)} style={styles.cardText}>
          <div className='upload' style={styles.uploadBox}>
            <FormattedMessage {...messages.dragHere} />
          </div>
          {
            forms.length > 0 &&
            (
              <div>
                <List>
                  <Subheader><FormattedMessage {...messages.pendingForms} /></Subheader>
                  {
                    forms.map((form, idx) => (
                      <ListItem
                        key={idx}
                        primaryText={<code>{form.name}</code>}
                        leftIcon={form.missingAttachments.length ? <WarningIcon color={colors.orange500} /> : <CheckCircleIcon color={colors.green500} />}
                        nestedItems={form.missingAttachments.map((a, jdx) => (
                          <ListItem
                            key={jdx}
                            primaryText={<span>Missing <code>{a}</code></span>}
                          />
                        ))}
                      />
                    ))
                  }
                </List>
                <RaisedButton
                  icon={uploading ? <CircularProgress size={20} thickness={2.5} /> : null}
                  label={<FormattedMessage {...messages.upload} />}
                  onTouchTap={uploading ? noop : this.uploadForms}
                  primary />
              </div>
            )
          }
        </CardText>
        <Snackbar
          open={showSnackbar}
          message={snackbarMessage}
          autoHideDuration={4000}
        />
      </Card>
    )
  }
}

const mapStateToProps = state => {
  return {
    mediaUrl: state.xformUploader.mediaUrl,
    observationsUrl: state.xformUploader.observationsUrl
  }
}

export default connect(
  mapStateToProps
)(UploadFormDataModal)
