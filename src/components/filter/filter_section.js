import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from 'material-ui/styles'

import { ListItem, ListItemIcon, ListItemText, ListItemSecondaryAction } from 'material-ui/List'
import IconButton from 'material-ui/IconButton'
import Collapse from 'material-ui/transitions/Collapse'
import ExpandMoreIcon from 'material-ui-icons/ExpandMore'
import ExpandLessIcon from 'material-ui-icons/ExpandLess'

import ShowAllButton from './show_all_button'

const styleSheet = {
  listItemText: {
    fontSize: 14,
    padding: '0 32px 0 0'
  },
  showAll: {
    top: 6,
    fontSize: 12
  },
  collapse: {
    position: 'relative'
  }
}

const ExpandButton = ({expanded, onClick}) => (
  <IconButton onClick={onClick}>
    {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
  </IconButton>
)

class FilterSection extends React.Component {
  state = {
    expanded: true
  }

  handleExpandClick = () => {
    this.setState({
      expanded: !this.state.expanded
    })
  }

  render () {
    const {icon, title, subtitle, isFiltered, children, showAll, classes} = this.props
    const {expanded} = this.state
    return (
      <div>
        <ListItem>
          <ListItemIcon>
            {icon}
          </ListItemIcon>
          <ListItemText
            classes={{root: classes.listItemText}}
            primary={title}
            secondary={subtitle}
          />
          <ListItemSecondaryAction>
            {(expanded && isFiltered)
              ? <ShowAllButton onClick={showAll} className={classes.showAll} />
              : <ExpandButton expanded={expanded} onClick={this.handleExpandClick} />}
          </ListItemSecondaryAction>
        </ListItem>
        <Collapse in={expanded} transitionDuration='auto' className={classes.collapse}>
          {children}
        </Collapse>
      </div>
    )
  }
}

FilterSection.propTypes = {
  icon: PropTypes.element,
  title: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
  subtitle: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
  isFiltered: PropTypes.bool,
  children: PropTypes.node
}

export default withStyles(styleSheet)(FilterSection)
