/* global Backbone, $ */
(function() {
  'use strict';

  var jst = Panel.Util.jst('macros/settings');

  /**
   * @class Panel.Views.MacroSettingsView
   *
   * Index listing of macros.
   */
  Panel.MacroSettingsView = Backbone.View.extend({
    messages: {
      'macros:configured': 'updateStatus'
    },

    macro: null,

    events: {
      'submit form': 'consume',
      'submit': 'consume',
      'click [data-action="save"]': 'proxyConfigure',
      'click [data-action="close"]': 'remove'
    },

    render: function(macro) {
      this.macro = macro;

      if (!this.macro) {
        console.error('no macro focused, expected Panel.MacroView to have been shown before.');
        return false;
      }

      if (this.$el) {
        this.remove();
      }

      this.setElement( jst(this.macro) );
      this.acceptMessages();

      $('#content').append( this.$el );

      this.$status = this.$('[data-action="configure"]');
    },

    proxyConfigure: function() {
      var data = this.$('form').serializeObject();

      this.$status.html('Saving...');
      this.toCanvi('macros', 'configureMacro', data);
    },

    updateStatus: function() {
      this.$status.html('Saved.');
    }
  });

  /**
   * @class Panel
   */

  /**
   * @property {Panel.Views.MacroSettingsView} Global instance.
   */
  Panel.MacroSettingsView = new Panel.MacroSettingsView();
})();