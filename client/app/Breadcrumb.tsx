import {
  ReactNode,
  RefObject,
  UIEventHandler,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { Link, useMatches } from 'react-router-dom';
import {
  ChevronLeft,
  ChevronRight,
  HomeOutlined,
  NavigateNext,
} from '@mui/icons-material';
import { Breadcrumbs, IconButton, Slide, Typography } from '@mui/material';

interface BreadcrumbProps {
  className?: string;
}

interface CrumbProps {
  children: ReactNode;
  home?: boolean;
  to?: string | false;
}

const Crumb = (props: CrumbProps): JSX.Element => {
  const { to: pathname } = props;

  const crumb = props.home ? (
    <HomeOutlined />
  ) : (
    <Typography variant="body2">{props.children}</Typography>
  );

  if (!pathname) return crumb;

  return (
    <Link className="flex" to={pathname}>
      {crumb}
    </Link>
  );
};

interface UseSlidersHook {
  showStart: boolean;
  showEnd: boolean;
  handleScroll: UIEventHandler<Element>;
}

const useSliders = (ref: RefObject<HTMLDivElement>): UseSlidersHook => {
  const [showSliders, setShowSliders] = useState([false, false]);

  const resetShowSliders = (element: Element): void => {
    const start = element.scrollLeft;
    const end = element.clientWidth + start;

    const isStartOfScroll = start === 0;
    const isEndOfScroll = end === element.scrollWidth;

    setShowSliders([!isStartOfScroll, !isEndOfScroll]);
  };

  useLayoutEffect(() => {
    if (!ref.current) return undefined;

    const observer = new ResizeObserver((entries) => {
      if (!entries.length) return;

      resetShowSliders(entries[0].target);
    });

    observer.observe(ref.current);

    return () => observer.disconnect();
  }, []);

  return {
    showStart: showSliders[0],
    showEnd: showSliders[1],
    handleScroll: (e) => resetShowSliders(e.currentTarget),
  };
};

const Breadcrumb = (props: BreadcrumbProps): JSX.Element => {
  const matches = useMatches();

  const ref = useRef<HTMLDivElement>(null);

  const { showStart, showEnd, handleScroll } = useSliders(ref);

  useEffect(() => {
    ref.current?.scrollTo({
      left: ref.current.scrollWidth,
      behavior: 'smooth',
    });
  }, []);

  return (
    <div className={`relative flex items-center ${props.className}`}>
      <Slide direction="right" in={showStart}>
        <div className="bg-fade-to-r-white absolute left-0 top-0 flex h-full items-center pl-2 pr-5">
          <IconButton
            onClick={(): void =>
              ref.current?.scrollBy({
                left: -((ref.current?.scrollWidth || 100) / 2),
                behavior: 'smooth',
              })
            }
            size="small"
          >
            <ChevronLeft />
          </IconButton>
        </div>
      </Slide>

      <Slide direction="left" in={showEnd}>
        <div className="bg-fade-to-l-white absolute right-0 top-0 flex h-full items-center pl-5 pr-2">
          <IconButton
            onClick={(): void =>
              ref.current?.scrollBy({
                left: (ref.current?.scrollWidth || 100) / 2,
                behavior: 'smooth',
              })
            }
            size="small"
          >
            <ChevronRight />
          </IconButton>
        </div>
      </Slide>

      <nav
        ref={ref}
        className="scrollbar-hidden overflow-x-scroll pl-5 pr-20"
        onScroll={handleScroll}
      >
        <Breadcrumbs
          classes={{ separator: 'mx-2', ol: 'flex-nowrap' }}
          className="w-fit"
          component="div"
          maxItems={1000}
          separator={<NavigateNext fontSize="small" />}
        >
          {matches.map((match, index) => (
            <Crumb
              key={match.id}
              home={!index}
              to={index < matches.length - 1 && match.pathname}
            >
              {match.handle as string}
            </Crumb>
          ))}
        </Breadcrumbs>
      </nav>
    </div>
  );
};

export default Breadcrumb;
