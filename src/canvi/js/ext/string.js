define('ext/string', [ 'jquery' ], function($) {
  String.prototype.camelize = function() {
    return $.camelCase(this.replace(/_/, '-'));
  };
});