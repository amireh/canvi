define('core/util', [ 'lodash' ], function(_) {
  'use strict';

  var Util = {
    invoke: function(callback, thisArg) {
      if (_.isFunction(callback)) {
        var params = _.flatten(arguments);

        params.shift();
        params.shift();

        callback.apply(thisArg, params);
        return true;
      }

      return false;
    }
  };

  return Util;
});