// @flow
import * as React from 'react'
import Paper from '@material-ui/core/Paper'
import { withStyles } from '@material-ui/core/styles'

const styles = {
  root: {
    padding: 20,
    pageBreakAfter: 'always',
    position: 'relative',
    '@media only print': {
      padding: 0
    },
    '&:last-child': {
      pageBreakAfter: 'avoid !important'
    }
  },
  reportPaper: {
    position: 'relative',
    overflow: 'hidden',
    '@media only print': {
      boxShadow: 'none !important',
      borderRadius: '0 !important',
      margin: 0,
      overflow: 'auto',
      '&:after': {
        display: 'none'
      }
    },
    '&:after': {
      // Hides the page-break <hr> if it appears within the bottom-margin
      content: "''",
      position: 'absolute',
      backgroundColor: 'white',
      width: '100%',
      height: '0.5in',
      bottom: 0
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
    position: 'relative',
    margin: '0.5in',
    outline: '1px dashed #eeeeee',
    '@media only print': {
      margin: 0,
      outline: 'none'
    }
  },
  letter: {
    '&$reportPaper': {
      minWidth: '8.5in',
      maxWidth: '8.5in',
      '@media only print': {
        /* for some reason we need to substract 2px for a perfect fit */
        width: 'calc(8.5in - 1in - 2px)',
        minWidth: 'calc(8.5in - 1in - 2px)',
        maxWidth: 'calc(8.5in - 1in - 2px)'
      }
    },
    '& $pageBreak': {
      top: '10.5in'
    },
    '&$reportPage': {
      minHeight: '10in',
      '@media only print': {
        minHeight: 'auto',
        '&.fixed-height': {
          height: 'calc(10in - 2px)'
        }
      }
    }
  },
  a4: {
    '&$reportPaper': {
      minWidth: '210mm',
      maxWidth: '210mm',
      '@media only print': {
        /* for some reason we need to substract 2px for a perfect fit */
        width: 'calc(210mm - 1in - 2px)',
        minWidth: 'calc(210mm - 1in - 2px)',
        maxWidth: 'calc(210mm - 1in - 2px)'
      }
    },
    '& $pageBreak': {
      top: 'calc(297mm - 0.5in)'
    },
    '&$reportPage': {
      minHeight: 'calc(297mm - 1in)',
      '@media only print': {
        minHeight: 'auto',
        '&.fixed-height': {
          height: 'calc(297mm - 1in - 2px)'
        }
      }
    }
  }
}

type Props = {
  classes: { [className: $Keys<typeof styles>]: string },
  // Called when page is clicked
  onClick?: (event: SyntheticMouseEvent<HTMLElement>) => void,
  paperSize: 'a4' | 'letter',
  fixedHeight?: boolean,
  children: React.Node,
  style: Object
}

const ReportPage = ({
  classes,
  onClick,
  paperSize,
  fixedHeight = false,
  children,
  style
}: Props) => (
  <div className={classes.root} style={style}>
    <Paper
      className={classes.reportPaper + ' ' + classes[paperSize]}
      style={onClick ? { cursor: 'pointer' } : null}
      onClick={onClick}
      elevation={1}>
      <div
        className={
          classes.reportPage +
          ' ' +
          classes[paperSize] +
          (fixedHeight ? ' fixed-height' : '')
        }>
        {children}
      </div>
      <hr className={classes.pageBreak} />
    </Paper>
  </div>
)

export default withStyles(styles)(ReportPage)
