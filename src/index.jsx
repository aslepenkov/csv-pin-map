import React from 'react';
import ReactDOM from 'react-dom';

import App from './components/app.jsx';
import LoadingSpinner from './components/loadingSpinner.jsx';

ReactDOM.render(
  <div>
    <App />
    <LoadingSpinner />
  </div>,
  document.querySelector('#mount')
);
