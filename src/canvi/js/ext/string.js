define('ext/string', [ 'jquery' ], function($) {
  'use strict';

  String.prototype.camelize = function() {
    return $.camelCase(this.replace(/_/, '-'));
  };
});