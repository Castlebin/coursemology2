import { ComponentRef, forwardRef } from 'react';
import { CourseLayoutData } from 'types/course/courses';

import CourseItem from './CourseItem';
import CourseUserItem from './CourseUserItem';
import CourseUserProgression from './CourseUserProgress';
import SidebarAccordion from './SidebarAccordion';
import SidebarContainer from './SidebarContainer';
import SidebarItem from './SidebarItem';

interface SidebarProps {
  from: CourseLayoutData;
}

const Sidebar = forwardRef<ComponentRef<typeof SidebarContainer>, SidebarProps>(
  ({ from: data }, ref): JSX.Element => {
    return (
      <>
        <SidebarContainer
          ref={ref}
          className="border-only-r-neutral-200 flex w-full max-w-[20rem] flex-col bg-neutral-100"
        >
          <section className="border-only-b-neutral-200">
            <CourseItem in={data} />
            <CourseUserItem from={data} />
            {data.progress && <CourseUserProgression from={data.progress} />}
          </section>

          <section className="h-full space-y-4 overflow-y-scroll px-3 py-4">
            {data.sidebar && (
              <div>
                <SidebarItem
                  of={{
                    key: 'home',
                    icon: 'home',
                    label: 'Home',
                    path: data.courseUrl,
                  }}
                />

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
        </SidebarContainer>

        {/* <Paper
          className="absolute left-10 top-10 z-50 w-[15rem] space-y-5 rounded-xl p-4 shadow-lg"
          variant="outlined"
        >
          <HoverSidebar />

          <Typography className="leading-snug" variant="body2">
            <b>Tip:</b> Hover to the left of the screen to show the sidebar.
          </Typography>

          <Button fullWidth size="small" variant="outlined">
            OK
          </Button>
        </Paper> */}
      </>
    );
  },
);

Sidebar.displayName = 'Sidebar';

export { useShouldShowSidebarOpenButton } from './SidebarContainer';

export default Sidebar;
