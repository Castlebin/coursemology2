import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import './initializers';

import RoutedApp from './RoutedApp';
import 'theme/index.css';

$(() => {
  const root = createRoot(document.getElementById('app-root') as HTMLElement);

  root.render(
    <StrictMode>
      <RoutedApp />
    </StrictMode>,
  );
});
