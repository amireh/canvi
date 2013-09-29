(function() {
  'use strict';

  var Port = Backbone.Model.extend({
    connect: function() {
      this.set({
        id: chrome.devtools.inspectedWindow.tabId,
        chromePort: chrome.extension.connect({
          name: 'Canvi Panel'
        })
      });

      this.get('chromePort').postMessage({ appId: this.get('id') });
      this.get('chromePort').onMessage.addListener(_.bind(this.broadcast, this));
    },

    broadcast: function(message) {
      console.log('[panel] got a message:', message);

      this.trigger(message.type, message.data);
    }
  });

  Panel.Port  = new Port();
  Panel.Port.connect();
})();