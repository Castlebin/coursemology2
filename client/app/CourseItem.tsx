import { Add } from '@mui/icons-material';
import {
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Popover,
  Typography,
} from '@mui/material';
import SearchField from 'lib/components/core/fields/SearchField';
import TextField from 'lib/components/core/fields/TextField';
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { CourseLayoutData } from 'types/course/courses';

interface CourseItemProps {
  in: CourseLayoutData;
}

const CourseItem = (props: CourseItemProps): JSX.Element => {
  const { in: data } = props;

  const [anchorElement, setAnchorElement] = useState<HTMLElement>();

  const [filterCourseKeyword, setFilterCourseKeyword] = useState('');

  const filteredCourses = useMemo(() => {
    if (!filterCourseKeyword) return data.courses;

    return data.courses?.filter((course) =>
      course.title.toLowerCase().includes(filterCourseKeyword.toLowerCase()),
    );
  }, [filterCourseKeyword]);

  return (
    <>
      <div
        className="select-none space-y-4 p-4 hover:bg-neutral-200 active:bg-neutral-300"
        onClick={(e): void => setAnchorElement(e.currentTarget)}
        role="button"
        tabIndex={0}
      >
        <Avatar
          alt={data.courseTitle}
          className="wh-40 aspect-square rounded-xl"
          src={data.courseLogoUrl}
          variant="rounded"
        />

        <Typography className="line-clamp-3 font-medium" variant="body2">
          {data.courseTitle}
        </Typography>
      </div>

      <Popover
        anchorEl={anchorElement}
        anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
        classes={{ paper: 'max-w-[50rem] rounded-xl shadow-lg' }}
        onClose={(): void => setAnchorElement(undefined)}
        open={Boolean(anchorElement)}
        PaperProps={{ variant: 'outlined' }}
      >
        {Boolean(data.courses?.length) && (
          <>
            <List
              dense
              subheader={
                <ListSubheader className="pb-1 pt-5 leading-none">
                  <Typography variant="caption">Your courses</Typography>
                </ListSubheader>
              }
            >
              <ListItem>
                <SearchField
                  autoFocus
                  noIcon
                  onChangeKeyword={setFilterCourseKeyword}
                  placeholder="Search courses"
                />
              </ListItem>
            </List>

            <List
              className="-mt-5 max-h-[30rem] w-[50rem] overflow-scroll"
              dense
            >
              {filteredCourses?.map((course) => (
                <Link
                  key={course.url}
                  className="text-inherit no-underline"
                  to={course.url}
                >
                  <ListItem disablePadding tabIndex={0}>
                    <ListItemButton>
                      <ListItemText
                        primaryTypographyProps={{
                          className: 'line-clamp-2',
                        }}
                      >
                        {course.title}
                      </ListItemText>
                    </ListItemButton>
                  </ListItem>
                </Link>
              ))}

              {!filteredCourses?.length && (
                <ListItem>
                  <ListItemText
                    primaryTypographyProps={{ color: 'text.secondary' }}
                  >
                    Oops, no courses matched '{filterCourseKeyword}'.
                  </ListItemText>
                </ListItem>
              )}
            </List>

            <Divider />
          </>
        )}

        <List dense>
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemText>See all courses</ListItemText>
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton>
              <ListItemText>Create a new course</ListItemText>
            </ListItemButton>
          </ListItem>
        </List>

        <Divider />

        <List
          dense
          subheader={
            <ListSubheader className="pb-1 pt-5 leading-none">
              <Typography variant="caption">Superuser</Typography>
            </ListSubheader>
          }
        >
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemText>Admin panel</ListItemText>
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton>
              <ListItemText>Instance admin panel</ListItemText>
            </ListItemButton>
          </ListItem>
        </List>
      </Popover>
    </>
  );
};

export default CourseItem;
