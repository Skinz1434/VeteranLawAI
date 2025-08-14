// src/utils/gapiLoader.js

let gapiPromise = null;

export function loadGapi() {
  if (gapiPromise) {
    return gapiPromise;
  }

  gapiPromise = new Promise((resolve, reject) => {
    // Check if the script already exists
    if (window.gapi) {
      return resolve(window.gapi);
    }

    const script = document.createElement('script');
    script.src = 'https://apis.google.com/js/api.js';
    
    script.onload = () => {
      window.gapi.load('client:oauth2', () => {
        resolve(window.gapi);
      });
    };

    script.onerror = (error) => {
      console.error('Failed to load Google API script.', error);
      reject(new Error('Failed to load Google API script.'));
    };

    document.body.appendChild(script);
  });

  return gapiPromise;
}
