import App from './App.svelte';

const app = new App({
	target: document.body,
});

if ('serviceWorker' in navigator) {
	navigator.serviceWorker.register('/service-worker.js')
	  .then(registration => {
		console.log('Service Worker registered with scope:', registration.scope);
		return registration;
	  })
	  .then(registration => {
		// Wait until the service worker is active
		return navigator.serviceWorker.ready;
	  })
	  .then(registration => {
		// Now it's safe to show notifications
		return registration.showNotification('Sucess');
	  })
	  .catch(error => {
		console.error('Service Worker registration failed:', error);
	  });
  }
  
  
  if ('Notification' in window) {
	Notification.requestPermission().then(permission => {
	  if (permission === "granted") {
		console.log("Notification permission granted.");
		// You can now use new Notification() to show notifications
	  }
	});
  }
  

export default app;