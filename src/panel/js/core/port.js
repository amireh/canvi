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

      this.trigger([ message.category, message.label ].join(':'), message.data);
    },

    /**
     * Dispatch a request or a response to Canvi.
     *
     * @param {String} category   The "category" of messages this message falls under.
     * @param {String} label      A label that describes this particular message.
     * @param {Object} [data={}]  Any specific message data.
     */
    toCanvi: function(category, label, data) {
      this.get('chromePort').postMessage({
        category: category,
        label: label,
        data: data || {},
        from: 'panel'
      });
    }
  });

  Panel.Port  = new Port();
  Panel.Port.connect();
})();