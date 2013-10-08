define('core/messenger', [ 'backbone' ], function(Backbone) {
  'use strict';

  /**
   * @class Canvi.Messenger
   * @alternateClassName Messenger
   *
   * Communication channel between the Google Chrome extension and Canvi.
   */
  return Backbone.Model.extend({
    defaults: {
      port: null
    },

    requiredFields: [ 'namespace', 'label' ],
    handlers: {},

    connect: function() {
      chrome.extension.onMessage.addListener(_.bind(this.broadcast, this));

      this.set('port', chrome.runtime.connect());
    },

    /**
     * Broadcast a message received from the Panel app.
     * @private
     */
    broadcast: function(event) {
      var message = event;
      var valid = true;
      var nsHandlers;

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

        nsHandlers = this.handlers[message.namespace];

        // Invoke namespace handlers
        if (nsHandlers && nsHandlers.length) {
          _.each(nsHandlers, function(handler) {
            if (_.isFunction(handler[message.label])) {
              handler[message.label](message.data);
            } else {
              console.error(message.label, 'is not understood by', handler);
            }
          });
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