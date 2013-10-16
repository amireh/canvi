var root = this;

this.toCanvi = function(namespace, label, data, callback) {
  var message;

  if (_.isFunction(data)) {
    callback = data;
  }

  var popMessage = _.isFunction(callback);
  var bufferSz;

  runs(function() {
    bufferSz = chrome.buffer.length;

    Canvi.Messenger.broadcast({
      from: 'panel',
      namespace: namespace,
      label: label,
      data: data
    });
  });

  waitsFor(function() {
    if (popMessage) {
      return message = chrome.lastMessage();
    }
    else {
      return chrome.buffer.length > bufferSz;
    }
  }, 'Canvi to respond to #' + [ namespace, label ].join(':'), 1000);

  runs(function() {
    Util.invoke(callback, null, message);
  });
};

this.cachedMacros = function() {
  return Canvi.Storage.get('macros');
}