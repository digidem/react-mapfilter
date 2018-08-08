// @flow
import * as React from 'react'
import { withStyles } from '@material-ui/core/styles'

const styles = {
  reportWrapper: {
    padding: '0 20px',
    '@media only print': {
      padding: 0,
      minWidth: 'auto'
    }
  },
  letter: {
    '&$reportWrapper': {
      minWidth: '8.5in'
    }
  },
  a4: {
    '&$reportWrapper': {
      minWidth: '210mm'
    }
  }
}

type WrapperProps = {
  classes: { [className: $Keys<typeof styles>]: string },
  paperSize: 'a4' | 'letter',
  children: React.Node
}

const ReportWrapper = ({ classes, paperSize, children }: WrapperProps) => (
  <div className={classes.reportWrapper + ' ' + classes[paperSize]}>
    {children}
  </div>
)

export default withStyles(styles)(ReportWrapper)
