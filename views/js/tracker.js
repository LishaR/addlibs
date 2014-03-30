// Forces divs of the "tracker" class to follow the screen
window.onload = function() {
  window.onscroll = function() {
    // Holds how far down the screen to keep the element
    var trackTopMargin = 200;
    // Iterates through each element of the class 'tracker'
    var trackerElements = document.getElementsByClassName('tracker');
    for (var i=0; i < trackerElements.length; i++) {
      // Keeps the tracker elements within specified margin of the screen's top
      var tracker = trackerElements[i];
      var scrollTop = getScrollTop();
      tracker.style.top = (scrollTop + trackTopMargin) + "px";
    } 
  };
};

// Returns how far down the user has scrolled
function getScrollTop() {
  // Works for most browsers
  if (typeof window.pageYOffset !== 'undefined' ) {
    return window.pageYOffset;
  }

  // Usually works for IE
  var d = document.documentElement;
  if (d.clientHeight) {
    return d.scrollTop;
  }

  // IE failsafe... kind of
  return document.body.scrollTop;
}