import { FC, memo } from 'react';
import { defineMessages, injectIntl, WrappedComponentProps } from 'react-intl';
import { Paper, Stack, Typography } from '@mui/material';
import { grey } from '@mui/material/colors';
import equal from 'fast-deep-equal';
import { NotificationData } from 'types/course/notifications';

import NotificationCard from './NotificationCard';

interface Props extends WrappedComponentProps {
  notifications: NotificationData[];
}

const translations = defineMessages({
  latestActivityHeader: {
    id: 'course.courses.CourseNotifications.latestActivity',
    defaultMessage: 'Latest Activity',
  },
});

const CourseNotifications: FC<Props> = (props) => {
  const { intl, notifications } = props;

  if (!notifications || notifications.length === 0) {
    return null;
  }

  return (
    <>
      <Typography variant="h5">
        {intl.formatMessage(translations.latestActivityHeader)}
      </Typography>

      <Paper className="p-3" variant="outlined">
        {notifications.map((notification, index) => (
          <NotificationCard
            // OK to use index since activity cannot be directly modified by anyone
            // eslint-disable-next-line react/no-array-index-key
            key={`${index}_${notification.actableId}`}
            notification={notification}
          />
        ))}
      </Paper>
    </>
  );
};

export default memo(injectIntl(CourseNotifications), (prevProps, nextProps) => {
  return equal(prevProps.notifications, nextProps.notifications);
});
