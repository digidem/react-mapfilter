// @flow
import * as React from 'react'
import Paper from '@material-ui/core/Paper'
import { withStyles } from '@material-ui/core/styles'

const styles = {
  reportPaper: {
    cursor: 'pointer',
    margin: '20px auto',
    overflow: 'hidden',
    pageBreakAfter: 'always',
    position: 'relative',
    '@media only print': {
      minHeight: 'auto',
      boxShadow: 'none !important',
      borderRadius: '0 !important',
      margin: 0
    },
    '&:last-child': {
      pageBreakAfter: 'avoid !important'
    }
  },
  pageBreak: {
    position: 'absolute',
    left: 0,
    width: '100%',
    border: 'none',
    margin: 0,
    borderBottom: '3px dashed rgba(200,200,200, 0.75)',
    '@media only print': {
      display: 'none'
    }
  },
  reportPage: {
    margin: '0.5in',
    outline: '1px dashed #eeeeee',
    '@media only print': {
      margin: 0,
      outline: 'none'
    }
  },
  letter: {
    '& $reportPaper': {
      width: '8.5in',
      '@media only print': {
        /* for some reason we need to substract 2px for a perfect fit */
        width: 'calc(7.5in - 2px)'
      }
    },
    '& $pageBreak': {
      top: '10.5in'
    },
    '& $reportPage': {
      minHeight: '10in',
      '@media only print': {
        minHeight: 'auto'
      }
    }
  },
  a4: {
    '& $reportPaper': {
      width: '210mm',
      '@media only print': {
        /* for some reason we need to substract 2px for a perfect fit */
        width: 'calc(210mm - 1in - 2px)'
      }
    },
    '& $pageBreak': {
      top: 'calc(297mm - 0.5in)'
    },
    '& $reportPage': {
      minHeight: 'calc(297mm - 1in)',
      '@media only print': {
        minHeight: 'auto'
      }
    }
  }
}

type Props = {
  classes: { [className: $Keys<typeof styles>]: string },
  // Called when page is clicked
  onClick: (event: SyntheticMouseEvent<HTMLElement>) => void,
  paperSize: 'a4' | 'letter',
  children: React.Node
}

const ReportPage = ({ classes, onClick, paperSize, children }: Props) => (
  <Paper
    className={classes.reportPaper + ' ' + classes[paperSize]}
    onClick={onClick}
    elevation={1}>
    <div className={classes.reportPage + ' ' + classes[paperSize]}>
      {children}
    </div>
    <hr className={classes.pageBreak} />
  </Paper>
)

export default withStyles(styles)(ReportPage)
