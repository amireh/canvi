/*global chrome*/
chrome.extension.onMessage.addListener(function(request, sender) {
  var port = ports[sender.tab.id];

  console.log('[canvi.bs]: chrome extension got a message:', arguments);

  if (port) {
    console.log('[canvi.bs]:\tforwarding to port:', port);
    port.postMessage(request);
  }
});

var ports = {};

chrome.extension.onConnect.addListener(function(port) {
  var appId;

  console.log('[canvi.bs]: a panel port has been opened:', port);

  port.onMessage.addListener(function(message) {
    console.log('[canvi.bs]: port', port.portId_, 'sent a message:', message);

    if (message.appId) {
      appId = message.appId;

      ports[appId] = port;

      port.onDisconnect.addListener(function() {
        delete ports[appId];
      });
      console.log('got the tab id:', appId);
    }
    // else if (message.from === 'devtools') {
    else {
      console.log('dispatching to tab:', appId);
      chrome.tabs.sendMessage(appId, message);
    }
  });
});

console.log('[canvi] background page accepting messages..');