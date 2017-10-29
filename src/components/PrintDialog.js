import React from 'react'
import Button from 'material-ui/Button'
import Dialog, {
  DialogActions,
  DialogContent,
  DialogTitle
} from 'material-ui/Dialog'
import Input, { InputLabel } from 'material-ui/Input'
import { FormControl } from 'material-ui/Form'
import Select from 'material-ui/Select'
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

const PrintDialog = ({open, onRequestClose, onChangePaperSize, paperSize}) => (
  <Dialog open={open} onRequestClose={onRequestClose} fullWidth maxWidth='xs' className='d-print-none'>
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
      <Button onClick={onRequestClose} color='primary'>
        <FormattedMessage {...messages.cancel} />
      </Button>
      <Button onClick={() => { window.print(); onRequestClose() }} color='primary'>
        <FormattedMessage {...messages.print} />
      </Button>
    </DialogActions>
  </Dialog>
)

export default PrintDialog
