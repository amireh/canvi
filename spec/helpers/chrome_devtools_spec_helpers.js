var root = this;

this.toCanvi = function(namespace, label, data, callback) {
  var message;

  if (_.isFunction(data)) {
    callback = data;
  }

  runs(function() {
    Canvi.Messenger.broadcast({
      from: 'panel',
      namespace: namespace,
      label: label,
      data: data
    });
  });

  waitsFor(function() {
    return message = chrome.lastMessage();
  }, 'Canvi to respond to #' + [ namespace, label ].join(':'), 1000);

  runs(function() {
    Util.invoke(callback, null, message);
  });
};

this.cachedMacros = function() {
  return Canvi.Storage.get('macros');
}