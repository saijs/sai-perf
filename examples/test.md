
# Test Page

----

<style>
#timing-overview {
  background-image: url(timing-overview-2.png);
  background-repeat: no-repeat;
  -webkit-background-size: cover;
  -moz-background-size: cover;
  -o-background-size: cover;
  background-size: contain;

  position: relative;
  width: 800px;
  height: 500px;
  margin-right: 200px
}
#timing-overview > span {
  position: absolute;
  font-size: 11px;
  color: #f00;
}
#navigationStart {
  left: 330px;
  top: 0px;
}
#redirectStart {
  left: 330px;
  top: 20px;
}
#redirectEnd {
  left: 330px;
  top: 40px;
}
#fetchStart {
  left: 340px;
  top: 60px;
}
#domainLookupStart {
  left: 430px;
  top: 78px;
}
#domainLookupEnd {
  left: 440px;
  top: 95px;
}
#connectStart {
  left: 440px;
  top: 113px;
}
#secureConnectionStart {
  left: 525px;
  top: 135px;
}
#connectEnd {
  left: 480px;
  top: 152px;
}
#requestStart {
  left: 500px;
  top: 170px;
}
#responseStart {
  left: 550px;
  top: 188px;
}
#responseEnd {
  left: 590px;
  top: 208px;
}

#unloadEventStart {
  left: 670px;
  top: 468px;
}
#unloadEventEnd {
  left: 680px;
  top: 446px;
}
#domLoading {
  left: 695px;
  top: 428px;
}
#domInteractive {
  left: 725px;
  top: 405px;
}
#domContentLoadedEventStart {
  left: 795px;
  top: 385px;
}
#domContentLoadedEventEnd {
  left: 805px;
  top: 363px;
}
#domComplete {
  left: 795px;
  top: 338px;
}
#loadEventStart {
  left: 715px;
  top: 158px;
}
#loadEventEnd {
  left: 755px;
  top: 135px;
}
</style>

<div id="timing-overview">
  <span id="navigationStart"></span>
  <span id="redirectStart"></span>
  <span id="redirectEnd"></span>
  <span id="fetchStart"></span>
  <span id="domainLookupStart"></span>
  <span id="domainLookupEnd"></span>
  <span id="connectStart"></span>
  <span id="secureConnectionStart"></span>
  <span id="connectEnd"></span>
  <span id="requestStart"></span>
  <span id="responseStart"></span>
  <span id="responseEnd"></span>
  <span id="unloadEventStart"></span>
  <span id="unloadEventEnd"></span>
  <span id="domLoading"></span>
  <span id="domInteractive"></span>
  <span id="domContentLoadedEventStart"></span>
  <span id="domContentLoadedEventEnd"></span>
  <span id="domComplete"></span>
  <span id="loadEventStart"></span>
  <span id="loadEventEnd"></span>
</div>
<div id="output"></div>


<script type="text/javascript">
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
    $("output").innerHTML = [
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

  }

  window.setTimeout(test, 50)
})
</script>
