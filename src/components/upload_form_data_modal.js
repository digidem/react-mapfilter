const React = require('react')
const { findDOMNode } = require('react-dom')
const PropTypes = React.PropTypes

const { Card, CardText, CardHeader } = require('material-ui/Card')
const IconButton = require('material-ui/IconButton').default
const CloseIcon = require('material-ui/svg-icons/navigation/close').default
const CheckCircleIcon = require('material-ui/svg-icons/action/check-circle').default
const RaisedButton = require('material-ui/RaisedButton').default
const WarningIcon = require('material-ui/svg-icons/alert/warning').default
const { List, ListItem } = require('material-ui/List')
const Subheader = require('material-ui/Subheader').default
const colors = require('material-ui/styles/colors')
const { defineMessages, FormattedMessage } = require('react-intl')
const dragDrop = require('drag-drop')
const Uploader = require('xform-uploader')

require('../../css/uploader.css')

const styles = {
  card: {
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
    onCloseClick: PropTypes.func.isRequired
  }

  state = {
    forms: [],
    missingAttachments: [],
    orphanAttachments: []
  }

  uploadForms = () => {
    console.log('uploading forms...')

    this.uploader.upload({
      observationsUrl: `http://localhost:3210/obs/create`,
      mediaUrl: `http://localhost:3210/media/jpg`
    }, err => {
      if (err) {
        return console.warn(err.stack)
      }

      console.log('done.')
    })
  }

  componentDidMount () {
    this.uploader = new Uploader()

    this.uploader.on('change', () => {
      // TODO push state into Redux
      const forms = this.uploader.state().forms.map(form => {
        form.missingAttachments = Object.values(this.uploader.forms.forms.missingAttachments)
          .filter(a => a.form.data.id === form.data.id)
          .map(a => a.name)

        return form
      })

      this.setState({
        forms,
        orphanAttachments: this.uploader.state().orphanAttachments
      })
    })

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
    const { forms } = this.state

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
        <CardText ref={el => (this.uploadContainer = el)}>
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
                        primaryText={form.data.id}
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
                  label={<FormattedMessage {...messages.upload} />}
                  onTouchTap={this.uploadForms}
                  primary />
              </div>
            )
          }
        </CardText>
      </Card>
    )
  }
}

module.exports = UploadFormDataModal
