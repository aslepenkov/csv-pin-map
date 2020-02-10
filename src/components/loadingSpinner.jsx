import React from 'react';
import { usePromiseTracker } from 'react-promise-tracker';

const LoadingSpinner = props => {
  const { promiseInProgress } = usePromiseTracker();

  return (
    promiseInProgress && (
      <div>
        <h1>
          <i className="fa fa-spinner fa-spin" /> Loading...
        </h1>
      </div>
    )
  );
};

export default LoadingSpinner;
