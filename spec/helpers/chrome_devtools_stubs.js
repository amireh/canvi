var root = this;

root.chrome = {
  buffer: [],

  flush: function() {
    root.chrome.buffer = [];
  },

  runtime: {
    connect: function() {}
  },

  extension: {
    /**
     * Buffer the message.
     */
    sendMessage: function(message) {
      console.debug('buffering message:', [ message.namespace, message.label ].join(':'), JSON.stringify(message.data));
      root.chrome.buffer.push(message);
    },
    onMessage: {
      addListener: function() {}
    }
  }
};

/**
 * Poll the Canvi-to-Panel message buffer for the last message received and
 * return it.
 *
 * @return {Object} The message.
 */
root.chrome.lastMessage = function() {
  var message = root.chrome.buffer.pop();

  expect(message).toBeTruthy();

  return message;
};

/**
 * Look-up a buffered message.
 *
 * @return {Object} The message.
 */
root.chrome.getMessage = function(ns, label) {
  return _.find(root.chrome.buffer, { namespace: ns, label: label });
};

root.chrome.expectMessage = function(ns, label, callback) {
  runs(function() {
    console.warn('buffer has', chrome.buffer.length, 'messages');
  });

  waitsFor(function() {
    return message = _.find(root.chrome.buffer, { namespace: ns, label: label });
  }, 'Canvi to send ' + [ ns, label ].join(':'), 1000);

  runs(function() {
    var index = root.chrome.buffer.indexOf(message);
    root.chrome.buffer.splice(index, 1);

    // root.chrome.flush();
    Util.invoke(callback, null, message);
  });
};

// Flush the buffer for every spec.
beforeEach(function() {
  Canvi.MacroManager.reset();
  root.chrome.flush();
});