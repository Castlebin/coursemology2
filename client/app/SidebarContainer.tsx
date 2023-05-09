import {
  ComponentProps,
  forwardRef,
  useImperativeHandle,
  useLayoutEffect,
  useState,
} from 'react';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import { Typography } from '@mui/material';

import useMedia from 'lib/hooks/useMedia';

type SidebarContainerProps = ComponentProps<'div'>;

interface ControlledContainerProps extends SidebarContainerProps {
  open?: boolean;
}

interface SidebarContainerRef {
  open: () => void;
  shouldShowOpenButton: boolean;
}

interface OpenSidebarButtonProps {
  open?: boolean;
  onClick?: () => void;
}

const GUTTER_WIDTH_PX = 20 as const;

const FloatingContainer = (props: SidebarContainerProps): JSX.Element => (
  <div
    className={`transition-position absolute z-50 h-full p-2 ${
      props.className ?? ''
    }`}
    onMouseEnter={props.onMouseEnter}
    onMouseLeave={props.onMouseLeave}
  >
    {props.children}
  </div>
);

const AppearOnLeftGutter = (props: SidebarContainerProps): JSX.Element => {
  const [guttered, setGuttered] = useState(false);
  const [inside, setInside] = useState(false);

  useLayoutEffect(() => {
    const body = document.querySelector('body');
    if (!body) return undefined;

    const watchAndShowSidebar = (e: MouseEvent): void => {
      setGuttered(e.clientX <= GUTTER_WIDTH_PX);
    };

    body.addEventListener('mousemove', watchAndShowSidebar);
    body.addEventListener('mouseleave', watchAndShowSidebar);

    return () => {
      body.removeEventListener('mousemove', watchAndShowSidebar);
      body.removeEventListener('mouseleave', watchAndShowSidebar);
    };
  }, []);

  const appear = guttered || inside;

  return (
    <FloatingContainer
      className={`top-0 ${appear ? 'left-0' : '-left-full'}`}
      onMouseEnter={(): void => setInside(true)}
      onMouseLeave={(): void => setInside(false)}
    >
      <aside
        className={`rounded-xl border border-solid border-neutral-200 shadow-xl ${
          props.className ?? ''
        }`}
      >
        {props.children}
      </aside>
    </FloatingContainer>
  );
};

const Hoverable = (props: ControlledContainerProps): JSX.Element => {
  const Component = props.open ? 'aside' : AppearOnLeftGutter;

  return <Component className={props.className}>{props.children}</Component>;
};

const Collapsible = (props: ControlledContainerProps): JSX.Element => {
  const smallScreen = useMedia.MinWidth('md');

  if (smallScreen)
    return (
      <FloatingContainer
        className={`max-sm:w-screen max-sm:p-0 ${
          props.open ? 'left-0' : '-left-full'
        }`}
      >
        <aside
          className={`rounded-xl border border-solid border-neutral-200 shadow-xl max-sm:max-w-none max-sm:rounded-none max-sm:border-none ${
            props.className ?? ''
          }`}
        >
          {props.children}
        </aside>
      </FloatingContainer>
    );

  return (
    <aside className={`${props.open ? '' : 'hidden'} ${props.className}`}>
      {props.children}
    </aside>
  );
};

const OpenSidebarButton = (props: OpenSidebarButtonProps): JSX.Element => {
  return (
    <div
      className={`flex select-none items-center space-x-2 px-4 py-3 text-neutral-500 hover:bg-neutral-200 active:bg-neutral-300 ${
        props.open ? 'flex-row' : 'flex-row-reverse'
      }`}
      onClick={props.onClick}
      role="button"
      tabIndex={0}
    >
      {props.open ? <ChevronLeft /> : <ChevronRight />}

      <Typography className="leading-none" variant="caption">
        {props.open ? 'Minimise sidebar' : 'Pin sidebar'}
      </Typography>
    </div>
  );
};

const SidebarContainer = forwardRef<SidebarContainerRef, SidebarContainerProps>(
  (props, ref): JSX.Element => {
    const smallScreen = useMedia.MinWidth('md');
    const mobile = useMedia.PointerCoarse();

    const [open, setOpen] = useState<boolean>();
    const [lastState, setLastState] = useState(open);

    useImperativeHandle(
      ref,
      () => ({
        open: () => setOpen((value) => !value),
        shouldShowOpenButton: mobile,
      }),
      [mobile],
    );

    useLayoutEffect(() => {
      if (smallScreen) {
        setOpen(false);
        setLastState(open ?? true);
      } else {
        setOpen(lastState ?? true);
      }
    }, [smallScreen]);

    const Container = mobile ? Collapsible : Hoverable;

    return (
      <Container
        className={`z-50 h-full shrink-0 ${props.className ?? ''}`}
        open={open}
      >
        {props.children}

        {(mobile || !smallScreen) && (
          <section className="border-only-t-neutral-200">
            <OpenSidebarButton
              onClick={(): void => setOpen((value) => !value)}
              open={open}
            />
          </section>
        )}
      </Container>
    );
  },
);

SidebarContainer.displayName = 'SidebarContainer';

export const useShouldShowSidebarOpenButton = useMedia.PointerCoarse;

export default SidebarContainer;
