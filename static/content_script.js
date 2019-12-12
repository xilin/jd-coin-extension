var valueArray = [];
var index = -1;
var lastInterval = null;
var PageType = {
  UNKONWN: 0,
  COIN: 1,
  ECARD: 2,
  SN: 3,
};
var currentPageType = PageType.UNKONWN;

chrome.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {
    console.log(request);
    valueArray = request.input;
    if (!valueArray || valueArray.length < 1) {
      console.log('数据非法');
      return;
    }
    index = -1;
    currentPageType = pageType();
    sendResponse({ response: "start" });
    if (currentPageType === PageType.UNKONWN) {
      return;
    }
    fillNext();
  });

function pageType() {
  var url = location.href;
  if (url.indexOf('ecard_bind') !== -1) {
    return PageType.ECARD;
  } else if (url.indexOf('coin') !== -1) {
    return PageType.COIN;
  } else if (url.indexOf('mycard') !== -1) {
    return PageType.SN;
  } else {
    return PageType.UNKONWN;
  }
}

function setValue(value) {
  if (currentPageType === PageType.COIN) {
    var inputArray = document.getElementsByClassName('input');
    var codeArray = value.split('-');
    for (var i = 0; i < inputArray.length; i++) {
      inputArray[i].value = codeArray[i];
    }
    document.getElementsByClassName('ex-btn fl')[0].click();
  } else if (currentPageType === PageType.ECARD) {
    var input = document.getElementsByClassName('input_text')[0];
    input.value = value;
    var e = new Event('input');
    input.dispatchEvent(e);
    document.getElementsByClassName('bind_new_btn')[0].click();
  } else if (currentPageType === PageType.SN) {
    var values = value.split(',');
    var cardNum = document.getElementsByClassName('cardNum')[0];
    cardNum.value = values[0];
    var e = new Event('input');
    cardNum.dispatchEvent(e);
    var pwd = document.getElementsByClassName('pwd')[0];
    pwd.value = values[1];
    e = new Event('input');
    pwd.dispatchEvent(e);
    document.getElementsByClassName('bind-btn')[0].click();
  }
}

function checkConfirm() {
  var checkInterval = 1000;
  var confirmTimeout = 2000;
  var nextTimeout = 3000;
  lastInterval = setInterval(function () {
    var confirmButton = null;
    var closeButtonName = null;
    if (currentPageType === PageType.COIN) {
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
      confirmButton = document.getElementById('J_cardBtn');
      closeButtonName = 'ui-btn';
    } else if (currentPageType === PageType.ECARD) {
      var hasCancelButtonInTwoButtonsMode = document.getElementsByClassName('btn_2').length > 0;
      if (!hasCancelButtonInTwoButtonsMode) {
        console.log('验证失败，未创建确认框');
        return;
      }
      confirmButton = document.getElementsByClassName('btn_1')[0];
      closeButtonName = 'btn_2';
    } else if (currentPageType === PageType.SN) {
      var hasPopup = document.getElementsByClassName('ajax-result').length > 0;
      if (!hasPopup) {
        console.log('验证失败，未创建确认框');
        return;
      }
      confirmButton = document.getElementsByClassName('ajax-result')[0].getElementsByClassName('sign-ok')[0];
      closeButtonName = null;
    }
    clearInterval(lastInterval);
    // confirm redeem button
    confirmButton.click();
    setTimeout(() => {
      // confirm close button
      if(closeButtonName) {
        document.getElementsByClassName(closeButtonName)[0].click();
      }
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