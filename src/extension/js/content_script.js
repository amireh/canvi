console.log('[Canvi] injecting content-script...');

window.addEventListener('message', function(event) {
  console.log('[canvi cs] got a window message:', event);

  if (event.data === 'debugger-client') {
    var port = event.ports[0];
    listenToPort(port);
  } else if (event.data.type) {
    chrome.extension.sendMessage(event.data);
  }
});

function listenToPort(port) {
  port.addEventListener('message', function(event) {
    chrome.extension.sendMessage(event.data);
  });

  chrome.extension.onMessage.addListener(function(message) {
    if (message.from === 'devtools') {
      port.postMessage(message);
    }
  });

  console.log('listening to port');
  port.start();
}

// let ember-debug know that content script has executed
document.body.dataset.canvi = 1;

console.log('[Canvi] content-script injected.');