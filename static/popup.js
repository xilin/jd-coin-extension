function registerEvent() {
  $('#confirm').on('click', function () {
    var result = processInput();
    sendMessage(result);
  });
}

function processInput() {
  var inputText = $('#coins').val();
  var separator = inputText.indexOf('\r') === -1 ? '\n' : '\r';
  var array = inputText.split(separator);
  return array.map(function (i) {
    var text = i.trim();
    var validLength = 19;
    if (text.length > validLength) {
      text = text.slice(-1 * validLength);
    }
    return text;
  });
}

function sendMessage(value) {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, { input: value }, function (response) {
      console.log(response);
    });
  });
}

$(document).ready(function () {
  registerEvent();
});