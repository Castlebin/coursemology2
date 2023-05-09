import { ReactNode } from 'react';
import { AppBar, Toolbar, Typography } from '@mui/material';

interface TitleBarProps {
  iconElementLeft: ReactNode;
  iconElementRight: ReactNode;
  title: NonNullable<ReactNode>;
}

// Hide menu icon by default. To revert once sidebar has been ported to MaterialUI.
const TitleBar = (props: TitleBarProps): JSX.Element => {
  const { iconElementLeft, iconElementRight, title, ...otherProps } = props;
  return (
    <AppBar
      {...otherProps}
      className="border-only-b-neutral-200"
      color="transparent"
      elevation={0}
      position="static"
    >
      <Toolbar className="flex items-center justify-between px-8 py-4">
        <div className="flex min-h-[4rem] w-full items-center">
          <div className="-ml-4 mr-2">{iconElementLeft}</div>

          <Typography className="line-clamp-2" color="inherit" variant="h5">
            {title}
          </Typography>
        </div>

        <div className="flex shrink-0 items-center">{iconElementRight}</div>
      </Toolbar>
    </AppBar>
  );
};

export default TitleBar;
