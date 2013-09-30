(function() {
  'use strict';

  /**
   * @class Zepto
   */

  /**
   * @method disable
   *
   * Disable a DOM element.
   */
  $.fn.disable = function() {
    $(this).prop('disabled', true);
  };

  /**
   * @method enable
   *
   * Enable a DOM element.
   */
  $.fn.enable = function() {
    $(this).prop('disabled', false);
  };
})();