// @flow
import * as React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import clsx from 'clsx'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import IconButton from '@material-ui/core/IconButton'
import Collapse from '@material-ui/core/Collapse'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'

import ShowAllButton from './ShowAllButton'

type Props = {
  icon: React.Node,
  title: React.Node,
  subtitle?: React.Node,
  isFiltered: boolean,
  children: React.Node,
  onShowAllClick: () => void
}

const useToggle = (initialState?: boolean) => {
  const [state, setState] = React.useState(!!initialState)
  const toggle = React.useCallback(() => setState(state => !state), [])
  return [state, toggle]
}
const FilterSection = ({
  icon,
  title,
  subtitle,
  isFiltered,
  children,
  onShowAllClick
}: Props) => {
  const cx = useStyles()
  const [expanded, toggleExpanded] = useToggle()

  const handleShowAllClick = e => {
    e.stopPropagation()
    onShowAllClick()
  }
  return (
    <div className={cx.root}>
      <ListItem dense button={!isFiltered} onClick={toggleExpanded}>
        <ListItemIcon className={cx.listIcon}>{icon}</ListItemIcon>
        <ListItemText
          classes={{ root: cx.listItemText }}
          primary={title}
          secondary={subtitle}
        />

        {isFiltered ? (
          <ShowAllButton onClick={handleShowAllClick} className={cx.showAll} />
        ) : (
          <ExpandMoreIcon
            className={clsx(cx.expandIcon, {
              [cx.expanded]: expanded
            })}
          />
        )}
      </ListItem>
      <Collapse
        in={expanded || isFiltered}
        classes={{ wrapperInner: cx.collapse }}
        unmountOnExit>
        {children}
      </Collapse>
    </div>
  )
}

export default FilterSection

const useStyles = makeStyles(theme => ({
  root: {
    borderBottom: `1px solid ${theme.palette.divider}`,
    backgroundClip: 'padding-box'
  },
  listIcon: {
    minWidth: 40
  },
  listItemText: {
    fontSize: 14,
    padding: 0
  },
  showAll: {
    fontSize: 12,
    lineHeight: '16px',
    minWidth: 'auto'
  },
  collapse: {
    position: 'relative'
  },
  expanded: {},
  expandIcon: {
    transform: 'rotate(0deg)',
    transition: theme.transitions.create(
      'transform',
      theme.transitions.duration.shortest
    ),
    '&$expanded': {
      transform: 'rotate(180deg)'
    }
  }
}))
