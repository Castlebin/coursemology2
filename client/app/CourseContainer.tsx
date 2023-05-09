import { ComponentRef, useRef } from 'react';
import { LoaderFunction, Outlet, useLoaderData } from 'react-router-dom';
import { MenuOutlined } from '@mui/icons-material';
import { IconButton, Typography } from '@mui/material';
import { CourseLayoutData } from 'types/course/courses';

import CourseAPI from 'api/course';
import Link from 'lib/components/core/Link';

import Breadcrumb from './Breadcrumb';
import Sidebar, { useShouldShowSidebarOpenButton } from './Sidebar';

const CourseContainer = (): JSX.Element => {
  const data = useLoaderData() as CourseLayoutData;

  const sidebarRef = useRef<ComponentRef<typeof Sidebar>>(null);
  const shouldShowOpenButton = useShouldShowSidebarOpenButton();

  return (
    <main className="flex h-full min-h-0 w-full">
      <Sidebar ref={sidebarRef} from={data} />

      <aside className="h-full w-full overflow-scroll">
        {shouldShowOpenButton ? (
          <div className="flex h-[4rem] w-full items-center">
            <IconButton onClick={(): void => sidebarRef.current?.open()}>
              <MenuOutlined />
            </IconButton>

            <Breadcrumb className="h-[4rem] w-full overflow-hidden" />
          </div>
        ) : (
          <Breadcrumb className="h-[4rem]" />
        )}

        <div className="h-full min-h-[calc(100%_-_4rem)] w-full">
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

const loader: LoaderFunction = async ({ params }) => {
  const id = parseInt(params?.courseId ?? '', 10) || undefined;
  if (!id) throw new Error(`CourseContainer was loaded with ID: ${id}.`);

  const response = await CourseAPI.courses.fetchLayout(id);
  return response.data;
};

export default Object.assign(CourseContainer, { loader });
