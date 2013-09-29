(function() {
  'use strict';

  var Router = Backbone.Router.extend({
    routes: {
      'macros': 'switchToMacros',
      'insights': 'switchToInsights',
    },

    initialize: function() {
      // Route all non-external links
      $(document).on('click', 'a', function(e) {
        var destination = $(this).attr('href');

        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();

        alert("Navigation to:" + destination);
        Backbone.history.navigate(destination, { silent: false, trigger: true });

        return false;
      });

    },

    switchToMacros: function() {
      alert("Macros");
      // $('#content').html( Panel.MacrosView.render().$el );
    }
  });

  Panel.Router = new Router();

  Backbone.history.start({
    root: '/',
    pushState: true,
    silent: false
  });

})();