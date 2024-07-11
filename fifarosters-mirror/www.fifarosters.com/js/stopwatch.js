var Stopwatch = function(elem, options) {
  
  var timer       = createTimer(),
      startButton = createButton("start", start),
      stopButton  = createButton("stop", stop),
      resetButton = createButton("reset", reset),
      offset,
      clock,
      interval;
  
  // default options
  options = options || {};
  options.delay = options.delay || 1;
  options.buttons = options.buttons || false;
 
  // append elements     
  elem.appendChild(timer);
  
  if (options.suffix) {
      var suffix = createSuffix(options.suffix);
      elem.appendChild(suffix);
  }
  
  if (options.buttons) {
      elem.appendChild(startButton);
      elem.appendChild(stopButton);
      elem.appendChild(resetButton);
  }
  
  // initialize
  reset();
  
  // private functions
  function createTimer() {
    return document.createElement("span");
  }

  function createSuffix(text) {
    var span = document.createElement("span");
    span.innerHTML = text;
    return span;
  }
  
  function createButton(action, handler) {
    var a = document.createElement("a");
    a.href = "#" + action;
    a.innerHTML = action;
    a.addEventListener("click", function(event) {
      handler();
      event.preventDefault();
    });
    return a;
  }
  
  function start() {
    if (!interval) {
      offset   = Date.now();
      interval = setInterval(update, options.delay);
    }
  }
  
  function stop() {
    if (interval) {
      clearInterval(interval);
      interval = null;
    }
  }
  
  function reset() {
    clock = 0;
    render(0);
  }
  
  function update() {
    clock += delta();
    render();
  }
  
  function render() {
    timer.innerHTML = (clock/1000).toFixed(3);
  }
  
  function delta() {
    var now = Date.now(),
        d   = now - offset;
    
    offset = now;
    return d;
  }
  
  // public API
  this.start  = start;
  this.stop   = stop;
  this.reset  = reset;
};