(function() {
  'use strict';

  /**
   * @class Port
   * Messenger between the Chrome background script and the Panel.
   */
  var Port = Backbone.Model.extend({
    defaults: {
      /**
       * @property {Number} id
       * The Panel unique app id, which is the Chrome tab id, which is also
       * the chromePort's id.
       *
       * This will be populated in Port#connect.
       */
      id: null,

      /**
       * @property {chrome.extension.Port} chromePort
       * The establed port between the panel and the extension.
       *
       * This will be populated in Port#connect.
       */
      chromePort: null
    },

    /**
     * Open a port to the background-script.
     */
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

    /**
     * Emit an event received from the extension. Interested parties can bind
     * to the Port with the correct event id.
     *
     * @param  {chrome.extensions.Event} message
     * The extension message.
     */
    broadcast: function(message) {
      console.log('got a message:', message);

      this.trigger(message.type, message.data);
    }
  });

  Panel.Port  = new Port();
  Panel.Port.connect();
})();