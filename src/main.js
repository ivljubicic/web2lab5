import App from './App.svelte';

const app = new App({
  target: document.body,
});

// First, request permission for notifications
if ('Notification' in window) {
  Notification.requestPermission().then(permission => {
    if (permission === "granted") {
      // Once permission is granted, register the service worker
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/service-worker.js')
          .then(registration => {
            console.log('Service Worker registered with scope:', registration.scope);
            // Show the notification through the service worker
            registration.showNotification("Notifications enabled!");
          })
          .catch(error => {
            console.error('Service Worker registration failed:', error);
          });
      }
    } else {
      console.error('Notification permission not granted:', permission);
    }
  });
}

export default app;
