define('models/macro', [
  'jquery',
  'lodash',
  'backbone',
  'models/macro_entry'
], function($, _, Backbone, MacroEntry) {
  'use strict';

  var MacroEntrySet = Backbone.Collection.extend({
    model: MacroEntry
  });

  return Backbone.Model.extend({
    urlRoot: '/macros',
    url: '/macros',

    defaults: {
    },

    initialize: function() {
      this.entries = new MacroEntrySet(null);
      this.listenTo(this.entries, 'add', this.announceEntry);
    },

    start: function() {
      this.set('status', 'active');

      Canvi.Messenger.toPanel('macros', 'recordingStarted', {
        id: this.get('id')
      });
    },

    pause: function() {
      this.set('status', 'paused');

      Canvi.Messenger.toPanel('macros', 'recordingPaused', {
        id: this.get('id')
      });
    },

    resume: function() {
      this.start();
      this.entries.each(function(entry) {
        entry.collection.trigger('add', entry);
      });
    },

    /**
     * Uninstall all event interceptors.
     */
    stop: function() {
      this.set('status', 'stopped');

      Canvi.Messenger.toPanel('macros', 'recordingStopped', {
        id: this.get('id')
      });
    },

    onClick: function(e) {
      var $target = $(e.target);

      console.debug('[Canvi] something was clicked');
      this.addEntry('click', e.target, window.location.href);
    },

    /**
     * @private
     */
    identify: function(el) {
      var fragments = [ el.nodeName.toLowerCase() ];

      if (el.id) {

        fragments.push('#' + el.id);
      }

      return fragments.join('');
    },

    /**
     * @private
     */
    addEntry: function(event, element, url) {
      var entry = {
        type: event,
        target: this.identify(element),
        url: url
      };

      this.entries.add(entry);

      console.debug('entries:', this.entries);
      this.trigger('change', this);
    },

    announceEntry: function(entry) {
      console.info('new macro entry:', entry);
      Canvi.Messenger.toPanel('macros', 'entry', entry.toJSON());
    },

    parse: function(data) {
      console.debug('macro parsed from:', data);
      this.entries = new MacroEntrySet(data.entries, { parse: true, remove: false });
      delete data.entries;
      return data;
    },

    toJSON: function() {
      var data = Backbone.Model.prototype.toJSON.apply(this, arguments);

      data.entries = this.entries.toJSON();

      return data;
    }
  });
});