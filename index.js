
var win = window;
var doc = win.document;
var loc = win.location;
var isFrame = win !== top;

var Sai = require("sai");
var ready = require("ready");
var detector = require("detector");

var HAR = {
  "log": {
    "version" : "1.2",
    "creator" : {
      "name": "Sai-perf",
      "version": "<%=version%>"
    },
    "browser" : {
      "name": detector.browser.name,
      "version": detector.browser.fullVersion
    },
    "pages": [],
    "entries": []
  }
};

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

function getPerformance(timing, navigationStart){
  return {
    wait : timing.fetchStart - navigationStart,
    redirect: timing.redirectEnd  - timing.redirectStart,
    appCache: timing.domainLookupStart  - timing.fetchStart,
    dnslookup: timing.domainLookupEnd - timing.domainLookupStart,
    tcpconnect: timing.connectEnd - timing.connectStart,
    request: timing.responseStart - timing.requestStart,
    response: timing.responseEnd - timing.responseStart,

    TTFB: timing.responseStart - navigationStart,
  };
}

function merge(origin, target) {
  for(var key in target){
    if (target.hasOwnProperty(key)) {
      origin[key] = target[key];
    }
  }
  return origin;
}

function sum(timing, startTime){
  return timing.responseEnd - startTime;

  var total = 0;
  for(var key in timing){
    if (timing.hasOwnProperty(key) && timing[key] !== -1) {
      total += timing[key];
    }
  }
  return total;
}

Sai.perf = function(){
  var performance = {};
  var performanceTiming = win.performance.timing;
  var navigationStart = performanceTiming.navigationStart;

  var page_id = "p0";

  HAR.log.pages.push({
    "startedDateTime": 0,
    "id": page_id,
    "pageTimings": {
      "onContentLoad": performanceTiming.domContentLoadedEventEnd - navigationStart,
      "onLoad": performanceTiming.loadEventStart === 0 ? 0 : performanceTiming.loadEventStart - navigationStart, // loadEventStart:0
      "_TTI": performanceTiming.domInteractive - navigationStart // CUSTOM FIELD.
      //FIRST_PAINT: "-",
    }
  });

  HAR.log.entries.push({
    "pageref": page_id,
    "startedDateTime": 0,
    "time": performanceTiming.responseEnd - navigationStart,
    "request": {
      "method": "",
      "url": loc.href.split("#")[0]
    },
    "timings": {
      "blocked": performanceTiming.fetchStart - navigationStart, // stalled.
      "dns": performanceTiming.domainLookupEnd - performanceTiming.domainLookupStart, // dnslookup.
      "connect": performanceTiming.connectEnd - performanceTiming.connectStart, // tcp connect.
      "send": performanceTiming.responseStart - performanceTiming.requestStart, // request.
      "receive": performanceTiming.responseEnd - performanceTiming.responseStart, // response
      "ssl": performanceTiming.secureConnectionStart === 0 ? -1 : performanceTiming.secureConnectionStart - performanceTiming.connectStart
    }
  });

  //performance[loc.href] = merge(getPerformance(performanceTiming, navigationStart),
    //{
      //unload: performanceTiming.unloadEventEnd - performanceTiming.unloadEventStart, // 0, referrer page unload event.
      //interactive: performanceTiming.domInteractive - performanceTiming.domLoading,
      //domready: performanceTiming.domContentLoadedEventStart - performanceTiming.domInteractive, // 过早获取时 domComplete 有时会是 0
      //domcomplete: performanceTiming.domComplete === 0 ? 0 : performanceTiming.domComplete - performanceTiming.domLoading, // domComplete:0
      //load: performanceTiming.loadEventEnd - performanceTiming.loadEventStart, // 0
    //}
  //);

  if (!win.performance.getEntriesByType) {
    return HAR;
  }

  var resourceList = win.performance.getEntriesByType("resource");

  for (var i = 0, l = resourceList.length, resourceTiming; i < l; i++) {
    resourceTiming = resourceList[i];
    //performance[resourceTiming.name] = getPerformance(resourceTiming, navigationStart);

    HAR.log.entries.push({
      "pageref": page_id,
      "startedDateTime": resourceTiming.startTime,
      "time": resourceTiming.duration,
      "request": {
        "method": "GET",
        "url": resourceTiming.name
      },
      "timings": {
        "blocked": resourceTiming.fetchStart - resourceTiming.startTime, // stalled.
        "dns": resourceTiming.domainLookupEnd - resourceTiming.domainLookupStart, // dnslookup.
        "connect": resourceTiming.connectEnd - resourceTiming.connectStart, // tcp connect.
        "send": resourceTiming.responseStart - resourceTiming.requestStart, // request.
        "receive": resourceTiming.responseEnd - resourceTiming.responseStart, // response
        "ssl": resourceTiming.secureConnectionStart === 0 ? -1 : resourceTiming.secureConnectionStart - resourceTiming.connectStart
      }
    });
  }

  return HAR;
};

win.onbeforeunload = function(){
  //Sai.log({
    //"test": "TEST"
  //})
};

module.exports = Sai;
