define('models/macro', [ 'jquery', 'lodash', 'backbone' ], function($, _, Backbone) {
  'use strict';

  return Backbone.Model.extend({
    initialize: function() {
      this._intercepted = [];
      this.intercept('click', 'recordClicks');
    },

    /**
     * Listen to an event in the injected page regardless of bubble status.
     *
     * @param {String} event
     * The event name to listen to, eg "click".
     *
     * @param {String} callback
     * Method identifier on this object to bind to the event handler, will
     * be bound to `this` as an evaluating context.
     */
    intercept: function(event, callback) {
      callback = _.bind(this[callback], this);

      document.addEventListener(event, callback, false);

      this._intercepted.push({
        event: event,
        callback: callback
      });
    },

    /**
     * Uninstall all event interceptors.
     */
    stop: function() {
      _.each(this._intercepted, function(entry) {
        document.removeEventListener(entry.event, entry.callback);
      });

      this._intercepted = [];
    },

    recordClicks: function(e) {
      var $target = $(e.target);
      var payload;

      console.log('[Canvi] something was clicked:', $target);
      console.debug('Button?', $target.is('button'));

      payload = {
        type: 'macroEvent',
        data: {
          type: 'click',
          target: e.toString()
        }
      };

      Canvi.Messenger.sendToPanel(payload);
      // chrome.runtime.sendMessage(payload, function(response) {
      //   console.debug('[Canvi] got response from extension:', response);
      // });
      // window.postMessage({ type: "FROM_PAGE", text: "Hello from the webpage!" }, "*");
    }
  });
});