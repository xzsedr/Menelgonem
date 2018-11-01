var x = setInterval(function() {

  // Get todays date and time
  var now = new Date();

  // Time calculations for days, hours, minutes and seconds
  var hours = now.getHours();
  var minutes = now.getMinutes();
  var seconds = now.getSeconds();

  // Display the result in the element with id="demo"
  document.getElementById("zegar").innerHTML = hours + ": "
  + minutes + ": " + seconds;

}, 1000);