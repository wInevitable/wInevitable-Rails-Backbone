$(document).ready(function() {
  $('.pro').click(function() {
    $('.dropdown').addClass('show');
  });

  $('body').click(function(event){
    var className = event.target.className.split(" ")[1];
    if (className != "sticky") {
      $('.dropdown').removeClass('show');
    }
  });

  $('.email').hover(function() {
    $('.email-pop-up').toggleClass('email-show');
  });
});