import { ReactNode } from 'react';
import { Avatar, Tooltip, Typography } from '@mui/material';
import { AchievementBadgeData } from 'types/course/assessment/assessments';

import Link from 'lib/components/core/Link';

interface StackableBadgeProps {
  title: string;
  src?: string;
  children?: ReactNode;
}

interface StackedBadgesProps {
  badges?: AchievementBadgeData[];
  remainingCount?: number;
  seeRemainingUrl?: string;
  seeRemainingTooltip?: string;
}

const StackableBadge = (props: StackableBadgeProps): JSX.Element => (
  <Tooltip disableInteractive title={props.title}>
    <Avatar
      alt={props.title}
      className="outline-slot-1 wh-11 hoverable:group-hover/badges:ml-1 hoverable:group-hover/badges:shadow-lg hoverable:group-hover/badges:!outline-none group-hover?:outline-slot-2 outline outline-2 transition-all"
      src={props.src}
    >
      {props.children}
    </Avatar>
  </Tooltip>
);

const StackedBadges = (props: StackedBadgesProps): JSX.Element => (
  <div className="group/badges relative h-[2.75rem] min-w-[5rem]">
    <div className="hoverable:group-hover/badges:space-x-0 absolute flex h-full items-center -space-x-4">
      {props.badges?.map((badge) => (
        <Link
          key={badge.url}
          className="transition-margin hoverable:group-hover/badges:-ml-1"
          href={badge.url}
          opensInNewTab
          underline="hover"
        >
          <StackableBadge src={badge.badgeUrl} title={badge.title} />
        </Link>
      ))}

      {props.remainingCount && (
        <Link href={props.seeRemainingUrl} opensInNewTab underline="hover">
          <Tooltip disableInteractive title={props.seeRemainingTooltip}>
            <Typography
              className="hoverable:group-hover/badges:ml-3 ml-6"
              color="text.secondary"
              variant="body2"
            >
              +{props.remainingCount}
            </Typography>
          </Tooltip>
        </Link>
      )}
    </div>
  </div>
);

export default StackedBadges;
