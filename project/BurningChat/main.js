window.onload = function() {
  document.querySelector('#greeting').innerText =
    'Hello, World! It is ' + new Date();
};

Environment().onClickMessageListener.addCallback(function(message) {
  console.log("from main.js");
});
