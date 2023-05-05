import { CircularProgress, Typography } from '@mui/material';
import { CourseUserProgressData } from 'types/course/courses';

import StackedBadges from 'bundles/course/assessment/pages/AssessmentsIndex/StackedBadges';
import { useEffect, useState } from 'react';

interface CourseUserProgressProps {
  from: CourseUserProgressData;
}

interface LevelRingProps {
  at: number;
  percentage: number;
  max?: boolean;
}

const LevelRing = (props: LevelRingProps): JSX.Element => {
  const { at: level, max } = props;

  const [percentage, setPercentage] = useState(0);

  // This effect is added so that the `CircularProgress` animates from zero
  // to the current progress percentage on load.
  useEffect(() => {
    setPercentage(props.percentage);
  }, []);

  return (
    <div className="wh-20 relative">
      <CircularProgress
        className="absolute text-neutral-300"
        size="5rem"
        thickness={6}
        value={100}
        variant="determinate"
      />

      <CircularProgress
        className="absolute"
        size="5rem"
        style={{ scale: '-1 1' }}
        thickness={6}
        value={max ? 100 : percentage}
        variant="determinate"
      />

      <div className="flex h-full w-full items-center justify-center">
        <Typography color="primary" variant="h6">
          {level}
        </Typography>
      </div>
    </div>
  );
};

const CourseUserProgression = (props: CourseUserProgressProps): JSX.Element => {
  const { from: data } = props;

  const maxLevel = data.nextLevelExpDelta === 'max';

  return (
    <section className="flex items-center space-x-4 p-4">
      {data.level && data.nextLevelPercentage && (
        <LevelRing
          at={data.level}
          max={maxLevel}
          percentage={data.nextLevelPercentage}
        />
      )}

      <div className="flex flex-col space-y-3">
        {data.nextLevelExpDelta && (
          <Typography
            className={`leading-none ${maxLevel ? 'font-bold' : ''}`}
            color={maxLevel ? 'primary' : ''}
            variant="body2"
          >
            {maxLevel ? (
              <>MAX LEVEL! 🎉</>
            ) : (
              <>
                {data.nextLevelExpDelta} <small>EXP</small> to Lv. 58
              </>
            )}
          </Typography>
        )}

        {data.recentAchievements && (
          <StackedBadges
            badges={data.recentAchievements}
            remainingCount={data.remainingAchievementsCount}
            seeRemainingTooltip="See all achievements"
            seeRemainingUrl="/courses/1/achievements"
          />
        )}
      </div>
    </section>
  );
};

export default CourseUserProgression;
