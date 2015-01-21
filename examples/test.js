

var imgSameOrigin = new Image(1,1)
imgSameOrigin.src = "./resource-timing-overview-1.png"
var imgDiffOrigin = new Image(1,1)
imgDiffOrigin.src = "https://i.alipayobjects.com/i/localhost/png/201404/2Tdj3TmMdR.png"
//var imgCORSOrigin = new Image("")

function endsWith(string, suffix){
  return string.indexOf(suffix, string.length - suffix.length) !== -1;
}

window.addEventListener("load", function(){

  function test(){

    function $(id){return document.getElementById(id)}

    var performanceTiming = window.performance.timing;
    $("navigationStart").innerHTML = performanceTiming.navigationStart
    $("redirectStart").innerHTML = performanceTiming.redirectStart
    $("redirectEnd").innerHTML = performanceTiming.redirectEnd
    $("fetchStart").innerHTML = performanceTiming.fetchStart
    $("domainLookupStart").innerHTML = performanceTiming.domainLookupStart
    $("domainLookupEnd").innerHTML = performanceTiming.domainLookupEnd
    $("connectStart").innerHTML = performanceTiming.connectStart
    $("secureConnectionStart").innerHTML = performanceTiming.secureConnectionStart
    $("connectEnd").innerHTML = performanceTiming.connectEnd
    $("requestStart").innerHTML = performanceTiming.requestStart
    $("responseStart").innerHTML = performanceTiming.responseStart
    $("responseEnd").innerHTML = performanceTiming.responseEnd

    $("unloadEventStart").innerHTML = performanceTiming.unloadEventStart
    $("unloadEventEnd").innerHTML = performanceTiming.unloadEventEnd
    $("domLoading").innerHTML = performanceTiming.domLoading
    $("domInteractive").innerHTML = performanceTiming.domInteractive
    $("domContentLoadedEventStart").innerHTML = performanceTiming.domContentLoadedEventStart
    $("domContentLoadedEventEnd").innerHTML = performanceTiming.domContentLoadedEventEnd
    $("domComplete").innerHTML = performanceTiming.domComplete
    $("loadEventStart").innerHTML = performanceTiming.loadEventStart
    $("loadEventEnd").innerHTML = performanceTiming.loadEventEnd

    var firstPaint = 0;
    if (performanceTiming.msFirstPaint) {
      firstPaint = performanceTiming.msFirstPaint
    } else if (window.chrome && chrome.loadTimes) {
      firstPaint = chrome.loadTimes().firstPaintTime * 1000
    }
    $("output-page-performance").innerHTML = [
      '<strong>Performance Timing</strong>',
      // 'Page Load: ' + (performanceTiming.loadEventStart - performanceTiming.navigationStart),
      // 'DOM Ready: ' + (performanceTiming.loadEventStart - performanceTiming.navigationStart),
      'TTFB: ' + (performanceTiming.responseStart - performanceTiming.navigationStart),
      'First Paint: ' + (firstPaint ? firstPaint - performanceTiming.navigationStart : 0) + '(' + firstPaint + ', ' + performanceTiming.navigationStart + ')',
      '',
      'unload: ' + (performanceTiming.unloadEventEnd - performanceTiming.unloadEventStart),
      'redirect: ' + (performanceTiming.redirectEnd - performanceTiming.redirectStart),
      'appcache: ' + (performanceTiming.domainLookupStart - performanceTiming.fetchStart),
      'dns: ' + (performanceTiming.domainLookupEnd - performanceTiming.domainLookupStart),
      'tcp: ' + (performanceTiming.connectEnd - performanceTiming.connectStart),
      'request: ' + (performanceTiming.responseStart - performanceTiming.requestStart),
      'response: ' + (performanceTiming.responseEnd - performanceTiming.responseStart),
      'processing: ' + (performanceTiming.domComplete ? performanceTiming.domComplete - performanceTiming.responseStart : 0), // domComplete | loadEventStart
      'load: ' + (performanceTiming.loadEventEnd ? performanceTiming.loadEventEnd - performanceTiming.loadEventStart : 0)
    ].join('<br/>')



    if (!window.performance.getEntriesByType) {
      return;
    }

    var resourceList = window.performance.getEntriesByType("resource");

    for (var i = 0, l = resourceList.length, resourceTiming; i < l; i++) {
      resourceTiming = resourceList[i];
      //if (endsWith(resourceTiming.name, "/resource-timing-overview-1.png")) {
      if (resourceTiming.name == imgDiffOrigin.src) {

        $("resource-startTime").innerHTML = resourceTiming.startTime
        $("resource-redirectStart").innerHTML = resourceTiming.redirectStart
        $("resource-redirectEnd").innerHTML = resourceTiming.redirectEnd
        $("resource-fetchStart").innerHTML = resourceTiming.fetchStart
        $("resource-domainLookupStart").innerHTML = resourceTiming.domainLookupStart
        $("resource-domainLookupEnd").innerHTML = resourceTiming.domainLookupEnd
        $("resource-connectStart").innerHTML = resourceTiming.connectStart
        $("resource-secureConnectionStart").innerHTML = resourceTiming.secureConnectionStart
        $("resource-connectEnd").innerHTML = resourceTiming.connectEnd
        $("resource-requestStart").innerHTML = resourceTiming.requestStart
        $("resource-responseStart").innerHTML = resourceTiming.responseStart
        $("resource-responseEnd").innerHTML = resourceTiming.responseEnd

        $("output-resource-performance").innerHTML = [
          '<strong>Resource Timing</strong>',
          'initiatorType: ' + resourceTiming.initiatorType,
          'TTFB: ' + (resourceTiming.responseStart ? resourceTiming.responseStart - resourceTiming.startTime : 0),
          'duration: ' + (resourceTiming.duration),
          'duration (responseEnd - startTime): ' + (resourceTiming.responseEnd - resourceTiming.startTime),
          '',
          'redirect: ' + (resourceTiming.redirectEnd - resourceTiming.redirectStart),
          'appcache: ' + (resourceTiming.domainLookupStart ? resourceTiming.domainLookupStart - resourceTiming.fetchStart : 0),
          'dns: ' + (resourceTiming.domainLookupEnd - resourceTiming.domainLookupStart),
          'tcp: ' + (resourceTiming.connectEnd - resourceTiming.connectStart),
          'request: ' + (resourceTiming.responseStart - resourceTiming.requestStart),
          'response: ' + (resourceTiming.responseStart ? resourceTiming.responseEnd - resourceTiming.responseStart : 0),
        ].join('<br/>')

      }
    }

  }

  window.setTimeout(test, 50)
})
