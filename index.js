
var win = window
var loc = win.location
var doc = win.document
var isFrame = win !== top
var supportPerformance = win.performance
var PAGE_URL = loc.href

var Sai = require("sai")

function addEventListener(element, eventName, handler) {
  if (!element) {return}
  if (element.addEventListener) {
    element.addEventListener(eventName, handler, false)
  } else if (element.attachEvent) {
    element.attachEvent("on" + eventName, handler)
  }
}

function ready (handler) {
  if (doc.readyState === "complete") {
    handler()
  } else {
    addEventListener(win, "load", handler)
  }
}

// 数字精度，这里精确到毫秒，毫秒以下的 fix 掉。
// {Number} number, 精确到毫秒的数值。
function fixedPrecision (number) {
  return Math.round(number)
}

function getPagePerformance(){
  if (!supportPerformance) {
    return
  }
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
    "navigation-type": NAVIGATION_TYPE[performanceNavigation.type] || "",
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

function getResourcePerformance(){
  if (!supportPerformance || !win.performance.getEntriesByType) {
    return
  }

  var resourcePerf = []
  var resourceList = win.performance.getEntriesByType("resource");

  for (var i = 0, l = resourceList.length, resourceTiming; i < l; i++) {
    resourceTiming = resourceList[i];

    var wasRestricted = !resourceTiming.requestStart
    var hasSSL = !!resourceTiming.secureConnectionStart
    var redirect = wasRestricted ? -1 : resourceTiming.redirectEnd - resourceTiming.redirectStart
    var appcache = wasRestricted ? -1 : resourceTiming.domainLookupStart - resourceTiming.fetchStart
    var dns = wasRestricted ? -1 : resourceTiming.domainLookupEnd - resourceTiming.domainLookupStart
    var tcp = wasRestricted ? -1 : resourceTiming.connectEnd - resourceTiming.connectStart
    var request = wasRestricted ? -1 : resourceTiming.responseStart - resourceTiming.requestStart
    var response = wasRestricted ? -1 : resourceTiming.responseEnd - resourceTiming.responseStart
    var networkDuration = wasRestricted ? -1 : dns + tcp + request + response

    resourcePerf.push({
      "initiator-type": resourceTiming.initiatorType,
      url: resourceTiming.name,
      restricted: wasRestricted ? 1 : 0,
      start: fixedPrecision(resourceTiming.startTime),
      duration: fixedPrecision(resourceTiming.duration),
      "network-duration": fixedPrecision(networkDuration),
      redirect: fixedPrecision(redirect),
      appcache: fixedPrecision(appcache),
      dns: fixedPrecision(dns),
      tcp: fixedPrecision(tcp),
      ssl: hasSSL ? fixedPrecision(resourceTiming.connectEnd - resourceTiming.secureConnectionStart) : -1,
      request: fixedPrecision(request),
      response: fixedPrecision(response)
    })
  }

  return resourcePerf
}

Sai.perf = function(){
    ready(function() {
      win.setTimeout(function(){
        var pagePerf = getPagePerformance()
        Sai.log(pagePerf, isFrame ? "perf-frame" : "perf-page")

        var resourcePerf = getResourcePerformance()
        for(var i=0,l=resourcePerf.length; i<l; i++){
          var resPerf = resourcePerf[i]
          resPerf.ref = PAGE_URL
          Sai.log(resPerf, isFrame ? "perf-frame-resource" : "perf-resource")
        }
      }, 50)
    })
}

/* global module */
module.exports = Sai;
