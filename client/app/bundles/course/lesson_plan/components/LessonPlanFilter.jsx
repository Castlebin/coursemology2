import React, { PropTypes } from 'react';
import Immutable from 'immutable';
import { injectIntl, defineMessages } from 'react-intl';
import RaisedButton from 'material-ui/RaisedButton';
import Popover from 'material-ui/Popover';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import Done from 'material-ui/svg-icons/action/done';
import KeyboardArrowUp from 'material-ui/svg-icons/hardware/keyboard-arrow-up';
import lessonPlanItemTypeKey from '../utils';

const propTypes = {
  toggleItemTypeVisibility: PropTypes.func.isRequired,
  hiddenItemTypes: PropTypes.instanceOf(Immutable.List).isRequired,
  items: PropTypes.instanceOf(Immutable.List).isRequired,
  intl: PropTypes.shape({
    formatMessage: PropTypes.func.isRequired,
  }).isRequired,
};

const translations = defineMessages({
  filter: {
    id: 'course.lessonPlan.lessonPlanFilter.filter',
    defaultMessage: 'Filter',
  },
});

class LessonPlanFilter extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false,
    };

    this.handleTouchTap = this.handleTouchTap.bind(this);
    this.handleRequestClose = this.handleRequestClose.bind(this);
  }

  handleTouchTap(event) {
    // This prevents ghost click.
    event.preventDefault();

    this.setState({
      open: true,
      anchorEl: event.currentTarget,
    });
  }

  handleRequestClose() {
    this.setState({
      open: false,
    });
  }

  render() {
    const {
      toggleItemTypeVisibility,
      hiddenItemTypes,
      items,
      intl,
    } = this.props;
    const lessonPlanItemTypes = items.map(item => item.get('lesson_plan_item_type')).toSet().toList().sort();

    return (
      <div>
        <RaisedButton
          onTouchTap={this.handleTouchTap}
          label={intl.formatMessage(translations.filter)}
          labelPosition="before"
          icon={<KeyboardArrowUp />}
        />
        <Popover
          open={this.state.open}
          anchorEl={this.state.anchorEl}
          anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
          targetOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          onRequestClose={this.handleRequestClose}
        >
          <Menu>
            {
              lessonPlanItemTypes.map((type) => {
                const itemTypeKey = lessonPlanItemTypeKey(type);
                return (
                  <MenuItem
                    key={itemTypeKey}
                    primaryText={type.join(': ')}
                    rightIcon={hiddenItemTypes.includes(itemTypeKey) ? <span /> : <Done />}
                    onTouchTap={() => toggleItemTypeVisibility(itemTypeKey)}
                  />
                );
              })
            }
          </Menu>
        </Popover>
      </div>
    );
  }
}

LessonPlanFilter.propTypes = propTypes;

export default injectIntl(LessonPlanFilter);
