var root = this;

root.$fixture = null;

beforeEach(function() {
  if (root.$fixture) {
    root.$fixture.off();
    root.$fixture.remove();
  }

  root.$fixture = $('<div id="fixture" />').appendTo($('body'));
  root.$fixture.on('click', 'button', function(e) {
    $(e.target).siblings().removeClass('selected');
    $(e.target).addClass('selected');
  });
});