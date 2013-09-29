(function() {
  'use strict';

  // var port = chrome.runtime.connect();

  console.log('[Canvi] injecting content-script...');

  window.addEventListener('message', function(message) {
    console.debug('[canvi cs] got a window message:', message);

    if (message.data === 'register-canvi') {
      var port = message.ports[0];
      listenToPort(port);
    }
    else if (message.data.from === 'canvi') {
      console.debug('[canvi cs]: dispatching to extension:', message);
      chrome.extension.sendMessage(message.data);
    }
  });

  function listenToPort(port) {
    port.addEventListener('message', function(event) {
      chrome.extension.sendMessage(event.data);
    });

    chrome.extension.onMessage.addListener(function(message) {
      console.debug('got a message from panel:', message);

      if (message.from === 'panel') {
        console.debug('[cs]\tforwarding to port');
        port.postMessage(message);
      }
    });

    console.log('listening to port messages');
    port.start();
  };

  console.log('[Canvi] content-script injected.');
})();