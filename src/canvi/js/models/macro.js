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
      this.ensureId();
      this.ensureEntries();
    },

    start: function() {
      this.set('status', 'active');
    },

    pause: function() {
      this.set('status', 'paused');
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
    },

    onClick: function(e) {
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

    parse: function(data) {
      console.log('macro raw data:', data);

      if (data.entries) {
        this.ensureEntries();
        console.debug('macro cached entries:', data.entries);
        this.entries.set(data.entries, { parse: true, remove: false });
        delete data.entries;
      }

      if (!data.id) {
        data.id = 'macro_' + this.cid;
      }

      return data;
    },

    toJSON: function() {
      var data = Backbone.Model.prototype.toJSON.apply(this, arguments);

      data.entries = this.entries.toJSON();

      return data;
    },

    ensureId: function() {
      if (!this.get('id')) {
        this.set({
          id: 'macro_' + this.cid
        });
      }
    },
    ensureEntries: function() {
      if (!this.entries) {
        this.entries = new MacroEntrySet(null);
      }
    }
  });
});