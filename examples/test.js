

var imgSameOrigin = new Image(1,1)
imgSameOrigin.src = "./resource-timing-overview-1.png"
var imgDiffOrigin = new Image(1,1)
imgDiffOrigin.src = "https://i.alipayobjects.com/i/localhost/png/201404/2Tdj3TmMdR.png"
var jsCORSOrigin = document.createElement("script")
jsCORSOrigin.src = "http://a.disquscdn.com/embed.js"
document.body.appendChild(jsCORSOrigin)

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

    function drawResourceTiming(type, resourceTiming){
        $("resource-" + type + "-startTime").innerHTML = resourceTiming.startTime
        $("resource-" + type + "-redirectStart").innerHTML = resourceTiming.redirectStart
        $("resource-" + type + "-redirectEnd").innerHTML = resourceTiming.redirectEnd
        $("resource-" + type + "-fetchStart").innerHTML = resourceTiming.fetchStart
        $("resource-" + type + "-domainLookupStart").innerHTML = resourceTiming.domainLookupStart
        $("resource-" + type + "-domainLookupEnd").innerHTML = resourceTiming.domainLookupEnd
        $("resource-" + type + "-connectStart").innerHTML = resourceTiming.connectStart
        $("resource-" + type + "-secureConnectionStart").innerHTML = resourceTiming.secureConnectionStart
        $("resource-" + type + "-connectEnd").innerHTML = resourceTiming.connectEnd
        $("resource-" + type + "-requestStart").innerHTML = resourceTiming.requestStart
        $("resource-" + type + "-responseStart").innerHTML = resourceTiming.responseStart
        $("resource-" + type + "-responseEnd").innerHTML = resourceTiming.responseEnd

        var isRestricted = !resourceTiming.requestStart
        var redirect = isRestricted ? -1 : resourceTiming.redirectEnd - resourceTiming.redirectStart
        var appcache = isRestricted ? -1 : resourceTiming.domainLookupStart - resourceTiming.fetchStart
        var dns = isRestricted ? -1 : resourceTiming.domainLookupEnd - resourceTiming.domainLookupStart
        var tcp = isRestricted ? -1 : resourceTiming.connectEnd - resourceTiming.connectStart
        var request = isRestricted ? -1 : resourceTiming.responseStart - resourceTiming.requestStart
        var response = isRestricted ? -1 : resourceTiming.responseEnd - resourceTiming.responseStart
        var networkDuration = isRestricted ? -1 : dns + tcp + request + response

        $("output-resource-" + type + "-performance").innerHTML = [
          '<strong>Resource Timing</strong>',
          'initiatorType: ' + resourceTiming.initiatorType,
          'restricted: ' + isRestricted,
          'TTFB: ' + (isRestricted ? -1 : resourceTiming.responseStart - resourceTiming.startTime),
          'duration: ' + (resourceTiming.duration),
          'duration (responseEnd - startTime): ' + (resourceTiming.responseEnd - resourceTiming.startTime),
          'network duration (dns + tcp + waiting(request,TTFB) + response(connect)): ' + networkDuration,
          '',
          'redirect: ' + redirect,
          'appcache: ' + appcache,
          'dns: ' + dns,
          'tcp: ' + tcp,
          'request (TTFB): ' + request,
          'response: ' + response,
        ].join('<br/>')
    }

    for (var i = 0, l = resourceList.length, resourceTiming; i < l; i++) {
      resourceTiming = resourceList[i];
      //if (endsWith(resourceTiming.name, "/resource-timing-overview-1.png")) {
      if (resourceTiming.name == imgSameOrigin.src) {
        drawResourceTiming("same-origin", resourceTiming)
      } else if (resourceTiming.name == imgDiffOrigin.src) {
        drawResourceTiming("diff-origin", resourceTiming)
      } else if (resourceTiming.name === jsCORSOrigin.src) {
        drawResourceTiming("cors-origin", resourceTiming)
      }
    }

  }

  window.setTimeout(test, 100)
})
