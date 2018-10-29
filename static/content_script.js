var valueArray = [];
var index = -1;
var lastInterval = null;

chrome.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {
    console.log(request);
    valueArray = request.input;
    if (!valueArray || valueArray.length < 1) {
      console.log('数据非法');
      return;
    }
    index = -1;
    sendResponse({ response: "start" });
    fillNext();
  });

function setValue(value) {
  var inputArray = document.getElementsByClassName('input');
  var codeArray = value.split('-');
  for (var i = 0; i < inputArray.length; i++) {
    inputArray[i].value = codeArray[i];
  }
  document.getElementsByClassName('ex-btn fl')[0].click();
}

function checkConfirm() {
  var checkInterval = 1000;
  var confirmTimeout = 2000;
  var nextTimeout = 3000;
  lastInterval = setInterval(function () {
    var confirmPopup = document.getElementById('J_cardMsgPop');
    if (!confirmPopup) {
      console.log('验证失败，未创建确认框');
      return;
    }
    var isPopupHidden = confirmPopup.style.display == 'none';
    if (isPopupHidden) {
      console.log('验证失败，未弹出确认框');
      return;
    }
    clearInterval(lastInterval);
    // confirm redeem button
    document.getElementById('J_cardBtn').click();
    setTimeout(() => {
      // confirm close button
      document.getElementsByClassName('ui-btn')[0].click();
      setTimeout(fillNext, nextTimeout);
    }, confirmTimeout);
  }, checkInterval);
}

function fillNext() {
  if (lastInterval) {
    clearInterval(lastInterval);
  }

  index++;
  if (valueArray.length <= index) {
    return;
  }
  setValue(valueArray[index]);
  checkConfirm();
}