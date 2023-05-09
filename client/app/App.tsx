import { ReactNode } from 'react';

import Providers from 'lib/components/wrappers/Providers';

import { store } from './store';

// eslint-disable-next-line @typescript-eslint/naming-convention
interface TEMPORARY_AppProps {
  children: NonNullable<ReactNode>;
}

const App = (props: TEMPORARY_AppProps): JSX.Element => (
  <Providers store={store}>{props.children}</Providers>
);

export default App;
