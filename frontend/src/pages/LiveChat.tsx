/* eslint-disable react/no-unknown-property */
/* eslint-disable @next/next/no-sync-scripts */
// @ts-nocheck
import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';

const LiveChat: React.FC = () => {
  useEffect(() => {
    const chatScript = document.createElement('script');
    chatScript.src = '//eu.fw-cdn.com/11932573/445639.js';
    chatScript.setAttribute('chat', 'true');
    document.head.appendChild(chatScript);

    return () => {
      document.head.removeChild(chatScript);
    };
  }, []);

  return (
    <Helmet>
      <script src="//eu.fw-cdn.com/11932573/445639.js" chat="true" />
    </Helmet>
  );
};

export default LiveChat;
