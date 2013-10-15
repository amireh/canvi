this.simulateClick = function() {
  $(document.body).click();
};

this.expectClick = function(message) {
  if (!message) {
    message = chrome.lastMessage();
  }

  expect( message.label ).toEqual('entry');
  expect( message.data.type ).toEqual('click');
  expect( message.data.target ).toEqual('body');
};