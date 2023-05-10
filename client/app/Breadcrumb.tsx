import {
  ReactNode,
  RefObject,
  Suspense,
  UIEventHandler,
  forwardRef,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import {
  Await,
  Link,
  Params,
  defer,
  useMatches,
  useNavigation,
} from 'react-router-dom';
import {
  ChevronLeft,
  ChevronRight,
  HomeOutlined,
  NavigateNext,
} from '@mui/icons-material';
import {
  Breadcrumbs,
  Grow,
  IconButton,
  Skeleton,
  Slide,
  Typography,
} from '@mui/material';

import useTranslation, {
  Descriptor,
  translatable,
} from 'lib/hooks/useTranslation';
import {
  DeferredHandler,
  DeferredLoaderData,
  extractDeferredData,
  isDeferredData,
  isPromise,
} from 'lib/hooks/router/defer';
import {
  StaticHandler,
  DataHandler,
  isStaticHandler,
  isDataHandler,
} from 'lib/hooks/router/loaders';
import Preload from 'lib/components/wrappers/Preload';

interface BreadcrumbProps {
  className?: string;
}

interface CrumbProps {
  children: ReactNode;
  home?: boolean;
  to?: string | false;
}

interface CrumbData {
  id: string;
  pathname: string;
  title: string | Descriptor | undefined;
}

const Crumb = forwardRef<HTMLAnchorElement, CrumbProps>(
  (props, ref): JSX.Element => {
    const { to: pathname } = props;

    const crumb = props.home ? (
      <HomeOutlined />
    ) : (
      <Typography ref={ref} variant="body2">
        {props.children}
      </Typography>
    );

    if (!pathname) return crumb;

    return (
      <Link ref={ref} className="flex" to={pathname}>
        {crumb}
      </Link>
    );
  },
);

Crumb.displayName = 'Crumb';

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

interface ActualBreadcrumbProps {
  in: (CrumbData | Promise<CrumbData>)[];
}

const ActualBreadcrumb = (props: ActualBreadcrumbProps): JSX.Element => {
  const { in: crumbs } = props;

  const { t } = useTranslation();

  const ref = useRef<HTMLDivElement>(null);

  const { showStart, showEnd, handleScroll } = useSliders(ref);

  useEffect(() => {
    ref.current?.scrollTo({
      left: ref.current.scrollWidth,
      behavior: 'smooth',
    });
  }, []);

  return (
    <>
      <Slide direction="right" in={showStart}>
        <div className="absolute left-0 top-0 flex h-full items-center pl-2 pr-5 bg-fade-to-r-white">
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
        <div className="absolute right-0 top-0 flex h-full items-center pl-5 pr-2 bg-fade-to-l-white">
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
          classes={{
            separator: 'mx-2',
            ol: 'flex-nowrap',
            li: 'flex items-center',
          }}
          className="w-fit"
          component="div"
          maxItems={1000}
          separator={<NavigateNext fontSize="small" />}
        >
          {crumbs.map((crumb, index) =>
            isPromise(crumb) ? (
              <Grow key={index} in>
                <Skeleton width="10rem" />
              </Grow>
            ) : (
              <Grow key={crumb.id} in>
                <Crumb
                  home={!index}
                  to={index < crumbs.length - 1 && crumb.pathname}
                >
                  {translatable(crumb.title) ? t(crumb.title) : crumb.title}
                </Crumb>
              </Grow>
            ),
          )}
        </Breadcrumbs>
      </nav>
    </>
  );
};

interface Match<D> {
  id: string;
  pathname: string;
  params: Params;
  data: D | DeferredLoaderData<D>;
  handle: StaticHandler | DataHandler<D> | DeferredHandler<D>;
}

const createCrumbData = <D,>(match: Match<D>, data?: D): CrumbData => {
  let title: string | Descriptor | undefined;

  if (isStaticHandler(match.handle)) {
    title = match.handle(match.params);
  } else if (isDataHandler(match.handle)) {
    title = match.handle(match.params, data);
  } else {
    throw new Error(`Invalid handler type in ${match.toString()}`);
  }

  return { id: match.id, pathname: match.pathname, title };
};

const Breadcrumb = (props: BreadcrumbProps): JSX.Element => {
  const matches = useMatches() as Match<unknown>[];
  const crumbs = matches.reduce<(CrumbData | Promise<CrumbData>)[]>(
    (validCrumbs, match) => {
      const handle = match.handle;
      if (typeof handle !== 'function') return validCrumbs;

      const data = match.data;
      if (isDataHandler(handle) && isDeferredData(data)) {
        validCrumbs.push(
          extractDeferredData(data).then((resolved) =>
            createCrumbData(match, resolved),
          ),
        );
      } else {
        validCrumbs.push(createCrumbData(match, data));
      }

      return validCrumbs;
    },
    [],
  );

  return (
    <div className={`relative flex items-center ${props.className}`}>
      <Preload
        render={<ActualBreadcrumb in={crumbs} />}
        syncsWith={[matches]}
        while={(): Promise<CrumbData[]> => Promise.all(crumbs)}
      >
        {(crums, refreshable): JSX.Element => {
          return refreshable(<ActualBreadcrumb in={crums.filter(Boolean)} />);
        }}
      </Preload>
    </div>
  );
};

export default Breadcrumb;
