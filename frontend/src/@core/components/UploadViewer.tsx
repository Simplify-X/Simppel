
// @ts-nocheck
import React from 'react';
import { Dashboard } from '@uppy/react';
import '@uppy/core/dist/style.css';
import '@uppy/dashboard/dist/style.css';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles({
  dashboard: {
    '& .uppy-Dashboard-inner, & .uppy-Dashboard-innerWrap': {
      backgroundColor: '#333',
      color: '#fff',
    },
    '& .uppy-DashboardItem': {
      backgroundColor: '#444',
    },
    '& .uppy-DashboardItem-name': {
      color: '#fff',
    },
  },
});


const UploadViewer = ({uppy}) => {
  const classes = useStyles();

  if (!uppy) {
    return null;
  }

  return (
    <div className={classes.dashboard}>
      <Dashboard
        uppy={uppy}
        height={470}
        proudlyDisplayPoweredByUppy={false}
        showProgressDetails={true}
        hideUploadButton={true}
      />
    </div>
  );
};

export default UploadViewer;

