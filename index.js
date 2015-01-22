
var win = window;
var doc = win.document;
var loc = win.location;
var isFrame = win !== top;

var Sai = require("sai");
var ready = require("ready");
var detector = require("detector");

var Performance = {
  wait: 0,
  redirect: 0,
  appcache: 0,
  unload: 0,
  dnslookup: 0,
  tcpconnect: 0,
  requestTime: 0,
  initDomTreeTime: 0,
  domReadyTime: 0,
  loadEventTime: 0,
  loadTime: 0
};

function merge(origin, target) {
  for(var key in target){
    if (target.hasOwnProperty(key)) {
      origin[key] = target[key];
    }
  }
  return origin;
}


Sai.perf = function(){
  var performanceTiming
};

function addEventListener(element, eventName, handler) {
  if (!element) {return}
  if (element.addEventListener) {
    element.addEventListener(eventName, handler, false)
  } else if (element.attachEvent) {
    element.attachEvent("on" + eventName, handler)
  }
}

// 数字精度，这里精确到毫秒，毫秒以下的 fix 掉。
// {Number} number, 精确到毫秒的数值。
function fixedPrecision (number) {
  return Math.round(number)
}

function getPagePerformance(){
  var performanceTiming = win.performance.timing;
  var navigationStart = performanceTiming.navigationStart
  var domainLookupStart = performanceTiming.domainLookupStart
  var connectEnd = performanceTiming.connectEnd
  var secureConnectionStart = "secureConnectionStart"
  var responseStart = performanceTiming.responseStart
  var loadEventStart = performanceTiming.loadEventStart

  var performanceNavigation = win.performance.navigation

  var firstPaint = 0;
  if (performanceTiming.msFirstPaint) {
    firstPaint = performanceTiming.msFirstPaint
  } else if (win.chrome && win.chrome.loadTimes) {
    firstPaint = win.chrome.loadTimes().firstPaintTime * 1000
  }

  var hasSSL = !!performanceTiming[secureConnectionStart]
  var NAVIGATION_TYPE = ["navigate", "reload", "back_forward"]

  return {
    "page-load": fixedPrecision(loadEventStart - navigationStart),
    "dom-ready": fixedPrecision(performanceTiming.domContentLoadedEventStart - navigationStart),
    "first-paint": firstPaint ? fixedPrecision(firstPaint - navigationStart) : -1,
    "redirect-count": fixedPrecision(performanceNavigation.redirectCount),
    "navigation-type": NAVIGATION_TYPE[performanceNavigation.type],
    unload: fixedPrecision(performanceTiming.unloadEventEnd - performanceTiming.unloadEventStart),
    redirect: fixedPrecision(performanceTiming.redirectEnd - performanceTiming.redirectStart),
    appcache: fixedPrecision(domainLookupStart - performanceTiming.fetchStart),
    dns: fixedPrecision(performanceTiming.domainLookupEnd - domainLookupStart),
    tcp: fixedPrecision(connectEnd - performanceTiming.connectStart),
    ssl: hasSSL ? fixedPrecision(connectEnd - performanceTiming[secureConnectionStart]) : -1,
    request: fixedPrecision(responseStart - performanceTiming.requestStart),
    response: fixedPrecision(performanceTiming.responseEnd - responseStart),
    processing: fixedPrecision(performanceTiming.domComplete - performanceTiming.domLoading),
    load: fixedPrecision(performanceTiming.loadEventEnd - loadEventStart)
  }
}


addEventListener(win, "load", function(){
  window.setTimeout(function(){
    var pagePerf = getPagePerformance()
    console.log(pagePerf)
  }, 50)
})

module.exports = Sai;
