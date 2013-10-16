(function() {
  'use strict';

  var ports = {};


  // Messages coming in from the panel:
  chrome.extension.onConnect.addListener(function(port) {
    var tabId;
    var panelId = port.portId_;

    if (port.name !== 'Canvi Panel') {
      console.debug('got a message but not from panel', port);
      return;
    }

    console.log('panel registered:', panelId);

    port.onMessage.addListener(function(message) {
      if (tabId) {
        console.log('panel', panelId, 'to canvi', tabId, message);
        chrome.tabs.sendMessage(tabId, message);
      }
      else if (message.tabId) {
        tabId = message.tabId;
        ports[tabId] = port;

        port.onDisconnect.addListener(function() {
          delete ports[tabId];
        });

        console.log('panel', panelId, 'is attached to canvi instance', tabId);
      }
      else {
        console.warn('got a message, but no tabId, can do nothing.');
      }
    });

  });

  // Forward messages coming in from Canvi to the Panel:
  chrome.extension.onMessage.addListener(function(message, canvi) {
    var idPanel;
    var idCanvi = canvi.tab.id;
    var panelPort = ports[idCanvi];

    if (panelPort) {
      idPanel = panelPort.portId_;
      console.log('canvi', idCanvi, 'to panel', idPanel, message);
      panelPort.postMessage(message);
    }
    else {
      console.error('unknown canvi instance:', idCanvi);
    }
  });

  window.notifyPanels = function(msg) {
    Object.keys(ports).forEach(function(portId_) {
      ports[portId_].postMessage(msg);
    });
  }

  window.notifyCanvi = function(idCanvi, message) {
    chrome.tabs.sendMessage(idCanvi, message);
  }

  window.notifyCanvis = function(message) {
    Object.keys(ports).forEach(function(portId_) {
      notifyCanvi(parseInt(portId_), message);
    });
  }

  window.ports = ports;

  console.log('ready to establish links between canvi and panel instances');
})();