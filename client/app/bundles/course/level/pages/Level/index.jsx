import { Component } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { Add } from '@mui/icons-material';
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableRow,
} from '@mui/material';
import PropTypes from 'prop-types';

import { actions } from 'course/level/store';
import LevelRow from 'course/level/components/LevelRow';
import { defaultComponentTitles } from 'course/translations.intl';
import LoadingIndicator from 'lib/components/core/LoadingIndicator';
import PageHeader from 'lib/components/navigation/PageHeader';

const translations = defineMessages({
  levelHeader: {
    id: 'course.level.Level.levelHeader',
    defaultMessage: 'Levels',
  },
  thresholdHeader: {
    id: 'course.level.Level.thresholdHeader',
    defaultMessage: 'Threshold',
  },
  addNewLevel: {
    id: 'course.level.Level.addNewLevel',
    defaultMessage: 'Add New Level',
  },
  saveLevels: {
    id: 'course.level.Level.saveLevels',
    defaultMessage: 'Save Levels',
  },
  saveSuccess: {
    id: 'course.level.Level.saveSuccess',
    defaultMessage: 'Levels Saved',
  },
  saveFailure: {
    id: 'course.level.Level.saveFailure',
    defaultMessage: 'Level saving failed, please try again.',
  },
});

const styles = {
  body: {
    display: 'flex',
  },
  sidebar: {
    width: 250,
  },
  mainPanel: {
    paddingLeft: 40,
    paddingRight: 40,
    width: '100%',
  },
  duplicateButton: {
    display: 'flex',
    justifyContent: 'center',
  },
  formButton: {
    marginRight: 10,
  },
  levelHeader: {
    textAlign: 'center',
  },
  thresholdHeader: {
    textAlign: 'left',
  },
  saveLevels: {
    textAlign: 'center',
  },
  addNewLevel: {
    textAlign: 'left',
  },
};

class Level extends Component {
  static renderTableHeader() {
    return (
      <TableHead>
        <TableRow>
          <TableCell style={styles.levelHeader}>
            <FormattedMessage {...translations.levelHeader} />
          </TableCell>
          <TableCell style={styles.thresholdHeader}>
            <FormattedMessage {...translations.thresholdHeader} />
          </TableCell>
          <TableCell />
        </TableRow>
      </TableHead>
    );
  }

  componentDidMount() {
    this.props.dispatch(actions.fetchLevels());
  }

  handleCreateLevel = () => (e) => {
    e.preventDefault();
    this.props.dispatch(actions.addLevel());
  };

  handleDeleteLevel = (levelNumber) => (e) => {
    e.preventDefault();
    this.props.dispatch(actions.deleteLevel(levelNumber));
  };

  handleLevelTextBlur = () => {
    this.props.dispatch(actions.sortLevels());
  };

  handleSaveLevels = () => {
    const { dispatch, levels } = this.props;
    return (e) => {
      e.preventDefault();
      if (this.levelsHaveError() === false) {
        const successMessage = (
          <FormattedMessage {...translations.saveSuccess} />
        );
        const failureMessage = (
          <FormattedMessage {...translations.saveFailure} />
        );
        dispatch(actions.saveLevels(levels, successMessage, failureMessage));
      }
    };
  };

  handleUpdateExpThreshold = (levelNumber, newValue) => {
    this.props.dispatch(actions.updateExpThreshold(levelNumber, newValue));
  };

  // Only the first element of the levels prop should be 0 as it is the default threshold.
  // User input should not contain any zeroes for threshold.
  levelsHaveError() {
    return this.props.levels.slice(1).some((element) => element === 0);
  }

  renderBody() {
    const { canManage, levels, isSaving } = this.props;
    const rows = levels.slice(1).map((experiencePointsThreshold, index) => {
      const key = `level-row-${index}`;
      return (
        <LevelRow
          key={key}
          deleteLevel={this.handleDeleteLevel}
          disabled={isSaving}
          levelNumber={index + 1}
          sortLevels={this.handleLevelTextBlur}
          updateExpThreshold={this.handleUpdateExpThreshold}
          {...{ canManage, experiencePointsThreshold }}
        />
      );
    });

    return (
      <div style={styles.body}>
        <Table className="levels-list table">
          {Level.renderTableHeader()}
          <TableBody>{rows}</TableBody>
          {canManage && this.renderTableFooter()}
        </Table>
      </div>
    );
  }

  renderTableFooter() {
    const { isSaving } = this.props;

    return (
      <TableFooter>
        <TableRow>
          <TableCell />
          <TableCell colSpan="1" style={styles.addNewLevel}>
            <Button
              disabled={isSaving}
              id="add-level"
              onClick={this.handleCreateLevel()}
              startIcon={<Add />}
            >
              <FormattedMessage {...translations.addNewLevel} />
            </Button>
          </TableCell>
          <TableCell />
        </TableRow>
        <TableRow>
          <TableCell style={styles.saveLevels}>
            <Button
              color="primary"
              disabled={isSaving}
              id="save-levels"
              onClick={this.handleSaveLevels()}
              style={styles.formButton}
              variant="contained"
            >
              <FormattedMessage {...translations.saveLevels} />
            </Button>
          </TableCell>
          <TableCell />
          <TableCell />
        </TableRow>
      </TableFooter>
    );
  }

  render() {
    return (
      <>
        <PageHeader
          title={
            <FormattedMessage
              {...defaultComponentTitles.course_levels_component}
            />
          }
        />
        {this.props.isLoading ? <LoadingIndicator /> : this.renderBody()}
      </>
    );
  }
}

Level.propTypes = {
  canManage: PropTypes.bool.isRequired,
  isLoading: PropTypes.bool.isRequired,
  isSaving: PropTypes.bool.isRequired,
  levels: PropTypes.arrayOf(PropTypes.number).isRequired,

  dispatch: PropTypes.func.isRequired,
};

export default connect(({ levelEdit }) => ({
  canManage: levelEdit.canManage,
  isLoading: levelEdit.isLoading,
  isSaving: levelEdit.isSaving,
  levels: levelEdit.levels,
}))(Level);
