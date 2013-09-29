define('core/messenger', [ 'backbone' ], function(Backbone) {
  'use strict';

  return Backbone.Model.extend({
    defaults: {
      channel: null,
      proxyPort: null,
      panelPort: null
    },

    requiredFields: [ 'category', 'label' ],

    connect: function() {
      this.set({
        channel: new MessageChannel(),
      });

      this.set({
        panelPort: this.get('channel').port1,
        proxyPort: this.get('channel').port2
      });

      // Ping the content-script so it can open a port to the panel.
      // window.postMessage('register-canvi', [ this.get('proxyPort') ], '*');

      // Accept messages from the Panel.
      // this.get('panelPort').addEventListener('message', _.bind(this.broadcast, this));
      // this.get('panelPort').start();

      // console.log(this.get('channel'));
      chrome.extension.onMessage.addListener(_.bind(this.broadcast, this));

      this.get('panelPort').start();

      var port = chrome.runtime.connect();
      console.log(chrome.extension);
      console.debug('port open');
    },

    /**
     * Broadcast a message received from the Panel app.
     * @private
     */
    broadcast: function(event) {
      var message = event;
      var valid = true;

      if (message.from !== 'panel') {
        console.warn('[Canvi] Ignoring potentially untrusted message:', event);
        return;
      }

      // Make sure it follows the expected format.
      _.each(this.requiredFields, function(field) {
        if (!message[field]) {
          console.error('[canvi] bad panel message, missing "' + field + '":', message);
          valid = false;
        }
      });

      if (valid) {
        console.debug('[Canvi] got from panel:', message);
        this.trigger([ message.category, message.label ].join(':'), message.data);
      }
    },

    /**
     * Dispatch a request or a response to the Panel.
     *
     * @param {String} category
     * The message category that the Panel handlers subscribe to.
     *
     * @param  {Object} [payload={}]
     * Any data to be attached to the message.
     */
    toPanel: function(category, label, payload) {
      chrome.extension.sendMessage({
        from: 'canvi',
        category: category,
        label: label,
        data: payload
      });
      // window.postMessage({
      //   from: 'canvi',
      //   category: category,
      //   label: label,
      //   data: payload
      // }, '*');
    }
  });
});