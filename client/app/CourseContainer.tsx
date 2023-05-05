import { useState } from 'react';
import { Outlet, useParams } from 'react-router-dom';
import { ChevronLeft } from '@mui/icons-material';
import { Avatar, Typography } from '@mui/material';
import { CourseLayoutData } from 'types/course/courses';

import CourseAPI from 'api/course';
import LoadingIndicator from 'lib/components/core/LoadingIndicator';
import Preload from 'lib/components/wrappers/Preload';
import { COURSE_USER_ROLES } from 'lib/constants/sharedConstants';

import SidebarAccordion from './SidebarAccordion';
import SidebarItem from './SidebarItem';
import CourseUserItem from './CourseUserItem';
import CourseUserProgression from './CourseUserProgress';
import Link from 'lib/components/core/Link';

interface StatefulCourseContainerProps {
  with: CourseLayoutData;
}

const StatefulCourseContainer = (
  props: StatefulCourseContainerProps,
): JSX.Element => {
  const [data, setData] = useState(props.with);

  return (
    <main className="flex h-screen w-full">
      <aside className="border-only-r-neutral-200 flex h-full w-80 shrink-0 flex-col bg-neutral-100">
        <section className="border-only-b-neutral-200 space-y-5 py-20">
          <div className="line-clamp-3 px-4">
            <Typography variant="body2">{data.courseName}</Typography>
          </div>

          <CourseUserItem from={data} />

          {data.progress && <CourseUserProgression from={data.progress} />}
        </section>

        <section className="h-full space-y-4 overflow-y-scroll px-3 py-4">
          {data.sidebar && (
            <div>
              {data.sidebar.map((item) => (
                <SidebarItem key={item.key} of={item} />
              ))}
            </div>
          )}

          {data.adminSidebar && (
            <SidebarAccordion
              containing={data.adminSidebar}
              title="Administration"
            />
          )}
        </section>

        <section className="border-only-t-neutral-200">
          <div
            className="flex select-none items-center space-x-2 p-4 text-neutral-500 hover:bg-neutral-200 active:bg-neutral-300"
            role="button"
          >
            <ChevronLeft />

            <Typography className="leading-none" variant="caption">
              Collapse sidebar
            </Typography>
          </div>
        </section>
      </aside>

      <aside className="h-full w-full overflow-scroll">
        <div className="h-full min-h-screen w-full">
          <Outlet />
        </div>

        <footer className="border-only-t-neutral-200 flex max-w-[1000px] flex-col space-y-5 p-5">
          <Typography variant="body2">
            Coursemology is an open-source education research project actively
            developed by the{' '}
            <Link href="https://aicet.aisingapore.org" opensInNewTab>
              AI Centre for Educational Technologies
            </Link>
            , supported by{' '}
            <Link href="https://aisingapore.org" opensInNewTab>
              AI Singapore
            </Link>{' '}
            and the{' '}
            <Link href="https://nus.edu.sg" opensInNewTab>
              National University of Singapore
            </Link>
            .
          </Typography>

          <div className="flex flex-row space-x-5">
            <Link href="#">Terms of Service</Link>
            <Link href="#">Privacy Policy</Link>
          </div>

          <Typography variant="caption">
            Copyright &copy; 2023 Coursemology. All rights reserved.
          </Typography>
        </footer>
      </aside>
    </main>
  );
};

const CourseContainer = (): JSX.Element => {
  const params = useParams();
  const id = parseInt(params?.courseId ?? '', 10) || undefined;
  if (!id) throw new Error(`CourseContainer was loaded with ID: ${id}.`);

  const fetchLayoutData = async (): Promise<CourseLayoutData> => {
    const response = await CourseAPI.courses.fetchLayout(id);
    return response.data;
  };

  return (
    <Preload render={<LoadingIndicator />} while={fetchLayoutData}>
      {(data): JSX.Element => <StatefulCourseContainer with={data} />}
    </Preload>
  );
};

export default CourseContainer;
