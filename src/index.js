import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css'; // Import your styles if you have any
if ('serviceWorker' in navigator) {
     window.addEventListener("load",  ()=>{
      navigator.serviceWorker.register('/service_worker.js')
      .then((registration) => {
        console.log('ServiceWorker registration successful with scope: ', registration.scope);
      })
      .catch((error) => {
        console.error('ServiceWorker registration failed: ', error);
      });
     })
 
  }

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);