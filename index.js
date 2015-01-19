
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
      "ssl": performanceTiming.secureConnectionStart === 0 ? 0 : performanceTiming.connectEnd - performanceTiming.secureConnectionStart
    }
  });

  if (!win.performance.getEntriesByType) {
    return HAR;
  }

  var resourceList = win.performance.getEntriesByType("resource");

  for (var i = 0, l = resourceList.length, resourceTiming; i < l; i++) {
    resourceTiming = resourceList[i];

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
        "ssl": resourceTiming.secureConnectionStart === 0 ? 0 : resourceTiming.connectEnd - resourceTiming.secureConnectionStart
      }
    });
  }

  return HAR;
};

win.onload = function(){

  var perf = Sai.perf()
  console.log(perf)
  var pageTimings = perf.log.pages[0].pageTimings
  var entries = perf.log.entries

  Sai.log({
    profile: "perf-entrie",
    url: entries[0].request.url,
    startTime: entries[0].timings.startedDateTime,
    blocked: entries[0].timings.blocked,
    dns: entries[0].timings.dns,
    connect: entries[0].timings.connect,
    send: entries[0].timings.send,
    receive: entries[0].timings.receive,
    ssl: entries[0].timings.ssl
  })

  Sai.log({
    "profile": "perf-page",
    "load": pageTimings.onLoad,
    "ready": pageTimings.onContentLoad,
    "tti": pageTimings._TTI
  })

  for(var i=0,l=entries.length; i<l; i++){
    Sai.log({
      profile: "perf-entrie",
      url: entries[i].request.url,
      startTime: entries[i].timings.startedDateTime,
      blocked: entries[i].timings.blocked,
      dns: entries[i].timings.dns,
      connect: entries[i].timings.connect,
      send: entries[i].timings.send,
      receive: entries[i].timings.receive,
      ssl: entries[i].timings.ssl
    })
  }
  console.log(perf)

};

module.exports = Sai;
