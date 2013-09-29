define('models/macro_entry', [
  'lodash',
  'backbone',
], function(_, Backbone) {
  'use strict';

  return Backbone.Model.extend({
    urlRoot: '/macro_entries',
    url: '/macro_entries',

    defaults: {
      type: null,
      target: null,
      url: null
    }
  });
});