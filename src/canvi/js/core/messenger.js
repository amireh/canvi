define('core/messenger', [ 'backbone' ], function(Backbone) {
  'use strict';

  return Backbone.Model.extend({
    defaults: {
      channel: null,
      proxyPort: null,
      panelPort: null
    },

    requiredFields: [ 'namespace', 'label' ],
    handlers: {},

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
        this.trigger([ message.namespace, message.label ].join(':'), message.data);

        // Invoke namespace handlers
        if (this.handlers[message.namespace]) {
          console.info('invoking', this.handlers[message.namespace].length, 'namespace handlers for:', message.namespace)
          _.invoke(this.handlers[message.namespace], message.label, message.data);
        }
      }
    },

    /**
     * Dispatch a request or a response to the Panel.
     *
     * @param {String} namespace
     * The message namespace that the Panel handlers subscribe to.
     *
     * @param  {Object} [payload={}]
     * Any data to be attached to the message.
     */
    toPanel: function(namespace, label, payload) {
      chrome.extension.sendMessage({
        from: 'canvi',
        namespace: namespace,
        label: label,
        data: payload
      });
    },

    /**
     * Subscribe to all messages published to the given namespace. The subscriber
     * is expected to define handlers that are named "onMessage" where Message
     * is substituted with the message label. Eg, 'macros:start' => onStart.
     *
     * @param  {String} namespace The message namespace.
     * @param  {Object} object The subscriber.
     */
    bindToNamespace: function(namespace, object) {
      if (!this.handlers[namespace]) {
        this.handlers[namespace] = [];
      }

      this.handlers[namespace].push(object);

      console.debug('Object has subscribed to namespace:', namespace);
    }
  });
});