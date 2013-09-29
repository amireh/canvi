(function() {
  'use strict';

  var port = chrome.extension.connect({
    name: 'Canvi Panel'
  });
  var appId = chrome.devtools.inspectedWindow.tabId;

  port.postMessage({ appId: appId });

  port.onMessage.addListener(function(message) {
    console.info('[canvi] panel got a message:', message);
  });
})();