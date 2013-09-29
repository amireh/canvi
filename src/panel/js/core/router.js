(function() {
  'use strict';

  var Router = Backbone.Router.extend({
    routes: {
      'macros': 'switchToMacros',
      'insights': 'switchToInsights',
    },

    initialize: function() {
      var that = this;

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
      } finally {
        // Not doing this will leave the panel in a broken state where the
        // URL doesn't map to any HTML file, so we must restore to the "index"
        // page.
        window.history.pushState('', '', 'panel.html');
        Panel.Storage.set('lastUrl', url);
      }
    },

    switchToMacros: function() {
      Panel.MacrosView.render();
    }
  });

  Panel.Router = new Router();
})();