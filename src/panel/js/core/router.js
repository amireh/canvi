(function() {
  'use strict';

  /**
   * @class Panel.Router
   *
   * Panel Backbone.js router for navigating around the panel.
   */
  var Router = Backbone.Router.extend({
    routes: {
      'macros': 'showMacros',
      'macros/:id': 'showMacro',
      'insights': 'switchToInsights',
    },

    initialize: function() {
      var that = this;

      // Panel reload hook
      $(document).on('click', '[data-action="reload"]', function() {
        window.location.reload(true);

        return false;
      });

      // Route all links
      $(document).on('click', 'a', function(e) {
        var url = $(this).attr('href');

        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();

        that.navigate(url);

        return false;
      });
    },

    navigate: function(url) {
      try {
        console.debug('router: navigating to:', url);
        Backbone.history.navigate(url, { silent: false, trigger: true });

        $('nav .selected').removeClass('selected');
        $('nav [href*="' + url + '"]').parent().addClass('selected');
      } finally {
        // Not doing this will leave the panel in a broken state where the
        // URL doesn't map to any HTML file, so we must restore to the "index"
        // page.
        window.history.pushState('', '', 'panel.html');
        Panel.Storage.set('lastUrl', url);
      }
    },

    showMacros: function() {
      this.show(Panel.MacrosView);
    },
    showMacro: function(macroId) {
      this.show(Panel.MacroView, macroId);
    },

    show: function(view) {
      var params = _.flatten(arguments);

      params.shift();

      if (this.view) {
        this.view.remove();
      }

      this.view = view;
      this.view.render.apply(this.view, params);
    }
  });

  Panel.Router = new Router();
})();