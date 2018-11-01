var x = setInterval(function() {

  // Get todays date and time
  var now = new Date();

  // Find the distance between now and the count down date
  var distance = now;

  // Time calculations for days, hours, minutes and seconds
  var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  var seconds = Math.floor((distance % (1000 * 60)) / 1000);

  // Display the result in the element with id="demo"
  document.getElementById("zegar").innerHTML = hours + ": "
  + minutes + ": " + seconds;

}, 1000);