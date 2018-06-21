import React from 'react'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import InputLabel from '@material-ui/core/InputLabel'
import Input from '@material-ui/core/Input'
import FormControl from '@material-ui/core/FormControl'
import Select from '@material-ui/core/Select'
import {defineMessages, FormattedMessage} from 'react-intl'

const messages = defineMessages({
  title: {
    id: 'printDialog.title',
    defaultMessage: 'Print settings'
  },
  paperSize: {
    id: 'printDialog.paperSizeLabel',
    defaultMessage: 'Paper size'
  },
  cancel: {
    id: 'printDialog.cancelButtonLabel',
    defaultMessage: 'Cancel'
  },
  print: {
    id: 'printDialog.printButtonLabel',
    defaultMessage: 'Print'
  }
})

const PrintDialog = ({open, onClose, onChangePaperSize, paperSize}) => (
  <Dialog open={open} onClose={onClose} fullWidth maxWidth='xs' className='d-print-none'>
    <DialogTitle>
      <FormattedMessage {...messages.title} />
    </DialogTitle>
    <DialogContent>
      <FormControl>
        <InputLabel htmlFor='paper-size'>
          <FormattedMessage {...messages.paperSize} />
        </InputLabel>
        <Select
          native
          value={paperSize}
          onChange={e => onChangePaperSize(e.target.value)}
          input={<Input id='paper-size' />}
        >
          <option value='a4'>A4 (210mm x 297mm)</option>
          <option value='letter'>Letter (8.5" x 11")</option>
        </Select>
      </FormControl>
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose} color='primary'>
        <FormattedMessage {...messages.cancel} />
      </Button>
      <Button onClick={() => { window.print(); onClose() }} color='primary'>
        <FormattedMessage {...messages.print} />
      </Button>
    </DialogActions>
  </Dialog>
)

export default PrintDialog
