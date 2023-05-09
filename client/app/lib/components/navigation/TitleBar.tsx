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
      <Toolbar className="min-h-0 px-8 pb-6 pt-4">
        <div className="-ml-4 mr-2">{iconElementLeft}</div>

        <Typography className="line-clamp-2" color="inherit" variant="h5">
          {title}
        </Typography>

        {iconElementRight}
      </Toolbar>
    </AppBar>
  );
};

export default TitleBar;
