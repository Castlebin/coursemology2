import { useState } from 'react';
import {
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListSubheader,
  Popover,
  Typography,
} from '@mui/material';
import { CourseLayoutData } from 'types/course/courses';

import { COURSE_USER_ROLES } from 'lib/constants/sharedConstants';
import { Link } from 'react-router-dom';

interface CourseUserItemProps {
  from: CourseLayoutData;
}

const CourseUserItem = (props: CourseUserItemProps): JSX.Element => {
  const { from: data } = props;

  const [anchorElement, setAnchorElement] = useState<HTMLElement>();

  return (
    <>
      <div
        className="flex select-none items-center space-x-4 p-4 hover:bg-neutral-200 active:bg-neutral-300"
        onClick={(e): void => setAnchorElement(e.currentTarget)}
        role="button"
        tabIndex={0}
      >
        <Avatar alt={data.courseUserName} src={data.userAvatarUrl} />

        <div className="mt-[3px] flex min-w-0 flex-col">
          <Typography
            className="overflow-hidden text-ellipsis whitespace-nowrap"
            variant="body2"
          >
            {data.courseUserName}
          </Typography>

          <Typography
            className="overflow-hidden text-ellipsis whitespace-nowrap"
            variant="caption"
          >
            {COURSE_USER_ROLES[data.courseUserRole!]}
          </Typography>
        </div>
      </div>

      <Popover
        anchorEl={anchorElement}
        anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
        classes={{ paper: 'max-w-[22rem] rounded-xl shadow-lg' }}
        onClose={(): void => setAnchorElement(undefined)}
        open={Boolean(anchorElement)}
        PaperProps={{ variant: 'outlined' }}
      >
        {data.userName !== data.courseUserName && (
          <>
            <List className="pb-1 pt-2" dense>
              <ListItem>
                <ListItemText
                  primaryTypographyProps={{
                    className: 'leading-tight',
                    color: 'text.disabled',
                    variant: 'caption',
                  }}
                >
                  You're seeing a name different from your account name because
                  this course's manager invited you with this name.
                </ListItemText>
              </ListItem>
            </List>

            <Divider />
          </>
        )}

        <List
          dense
          subheader={
            <ListSubheader className="pb-1 pt-5 leading-none">
              <Typography variant="caption">In this course</Typography>
            </ListSubheader>
          }
        >
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemText>Your profile</ListItemText>
            </ListItemButton>
          </ListItem>

          {data.manageEmailSubscriptionUrl && (
            <ListItem disablePadding>
              <ListItemButton href={data.manageEmailSubscriptionUrl}>
                <ListItemText>Manage email subscriptions</ListItemText>
              </ListItemButton>
            </ListItem>
          )}
        </List>

        <Divider />

        <List
          dense
          subheader={
            <ListSubheader className="pb-1 pt-5 leading-none">
              <Typography variant="caption">In Coursemology</Typography>
            </ListSubheader>
          }
        >
          <ListItem disablePadding>
            <ListItemButton>
              <Link to="/user/profile/edit">
                <ListItemText>Account settings</ListItemText>
              </Link>
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton>
              <ListItemText primaryTypographyProps={{ color: 'error' }}>
                Sign out
              </ListItemText>
            </ListItemButton>
          </ListItem>
        </List>
      </Popover>
    </>
  );
};

export default CourseUserItem;
