define('models/context', [
  'lodash',
  'backbone',
  'core/util',
  'store'
], function(_, Backbone, Util, Store) {
  'use strict';

  /**
   * @class Canvi.Context
   *
   * A persistent model state that automatically syncs changes to localStorage.
   * Useful for stateful Backbone.Collections.
   */
  return Backbone.Model.extend({

    /**
     * Initializer. A unique cache key must be passed.
     *
     * @param  {Object} [data={}] Initial state.
     * @param  {Object} options Options set, a "key" attribute must be assigned.
     */
    initialize: function(data, options) {
      if (!options.key) {
        throw 'Context must be assigned a unique cache key!';
      }

      this.key = options.key;
      this.on('change', this.updateCacheEntry);
    },

    /**
     * Persist to localStorage. Don't use this directly, use #set or #save instead.
     * @private
     */
    updateCacheEntry: function() {
      Store.set(this.key, this.toJSON());
    },

    increment: function(prop) {
      this.set(prop, (this.get(prop) || 0) + 1);
    },

    decrement: function(prop) {
      this.set(prop, (this.get(prop) || 0) - 1);
    },

    is: function(prop) {
      return !!this.get(prop);
    },

    sync: function(method, model, options) {
      switch(method) {
        case 'read':
        break;

        case 'create':
        case 'update':
        case 'patch':
          this.updateCacheEntry();
        break;

        case 'delete':
          Store.remove(this.key);
        break;
      }

      Util.invoke(options.success, this, Store.get(this.key));

      return true;
    }
  });
});