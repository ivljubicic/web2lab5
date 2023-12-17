import App from './App.svelte';

const app = new App({
	target: document.body,
});

if ('serviceWorker' in navigator) {
	window.addEventListener('load', () => {
	  navigator.serviceWorker.register('/service-worker.js')
		.then((registration) => {
		  console.log('Service Worker registered with scope:', registration.scope);
		}, (err) => {
		  console.log('Service Worker registration failed:', err);
		});
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