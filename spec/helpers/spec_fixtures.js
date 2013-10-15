var root = this;

root.$fixture = null;

beforeEach(function() {
  $('#fixtures').remove();
  root.$fixture = $('<div />').appendTo($('body'));
});