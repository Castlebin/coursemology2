import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import { PostProp, AnnotationProp } from '../propTypes';
import CommentCard from '../components/CommentCard';
import CommentField from '../components/CommentField';
import * as annotationActions from '../actions/annotations';

class VisibleAnnotations extends Component {
  render() {
    const {
      fileId, lineNumber, commentForms, posts,
      createComment, updateComment, deleteComment,
      handleCreateChange, handleUpdateChange,
    } = this.props;

    return (
      <div>
        {posts.map(post =>
          <CommentCard
            key={post.id}
            id={post.id}
            name={post.creator}
            avatar=""
            date={post.createdAt}
            content={post.text}
            editValue={commentForms.posts[post.id]}
            updateComment={value => updateComment(post.id, value)}
            deleteComment={() => deleteComment(post.id)}
            handleChange={value => handleUpdateChange(post.id, value)}
          />
        )}
        <CommentField
          value={commentForms.annotations[fileId][lineNumber]}
          createComment={createComment}
          handleChange={handleCreateChange}
        />
      </div>
    );
  }
}

VisibleAnnotations.propTypes = {
  commentForms: PropTypes.shape({
    topics: PropTypes.objectOf(PropTypes.string),
    posts: PropTypes.objectOf(PropTypes.string),
  }),
  fileId: PropTypes.number.isRequired,
  lineNumber: PropTypes.number.isRequired,
  posts: PropTypes.arrayOf(PostProp),
  /* eslint-disable react/no-unused-prop-types */
  match: PropTypes.shape({
    params: PropTypes.shape({
      courseId: PropTypes.string,
      assessmentId: PropTypes.string,
      submissionId: PropTypes.string,
    }),
  }),
  annotation: AnnotationProp,
  answerId: PropTypes.number.isRequired,
  /* eslint-enable react/no-unused-prop-types */

  handleCreateChange: PropTypes.func.isRequired,
  handleUpdateChange: PropTypes.func.isRequired,
  createComment: PropTypes.func.isRequired,
  updateComment: PropTypes.func.isRequired,
  deleteComment: PropTypes.func.isRequired,
};

function mapStateToProps(state, ownProps) {
  const { annotation } = ownProps;

  if (!annotation) {
    return {
      commentForms: state.commentForms,
      posts: [],
    };
  }
  return {
    commentForms: state.commentForms,
    posts: annotation.postIds.map(postId => state.posts[postId]),
  };
}

function mapDispatchToProps(dispatch, ownProps) {
  const { match: { params: { submissionId } }, answerId, fileId, lineNumber, annotation } = ownProps;

  if (!annotation) {
    return {
      handleCreateChange: comment => dispatch(annotationActions.onCreateChange(fileId, lineNumber, comment)),
      handleUpdateChange: (postId, comment) => dispatch(annotationActions.onUpdateChange(postId, comment)),
      createComment: comment => dispatch(annotationActions.create(submissionId, answerId, fileId, lineNumber, comment)),
      updateComment: () => {},
      deleteComment: () => {},
    };
  }
  return {
    handleCreateChange: comment => dispatch(annotationActions.onCreateChange(fileId, lineNumber, comment)),
    handleUpdateChange: (postId, comment) => dispatch(annotationActions.onUpdateChange(postId, comment)),
    createComment: comment => dispatch(annotationActions.create(submissionId, answerId, fileId, lineNumber, comment)),
    updateComment: (postId, comment) => dispatch(annotationActions.update(annotation.id, postId, comment)),
    deleteComment: postId => dispatch(annotationActions.destroy(annotation.id, postId)),
  };
}

const Annotations = withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(VisibleAnnotations));
export default Annotations;
