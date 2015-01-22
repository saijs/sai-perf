
# Test Page

----

<link type="text/css" rel="stylesheet" href="test.css" media="screen" charset="utf-8" />

## Page Performance

<div class="timing-overview">
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

<div id="output-page-performance"></div>


## Resource Performance (same origin)

<div class="resource-overview">
  <span id="resource-same-origin-startTime" class="resource-startTime"></span>
  <span id="resource-same-origin-redirectStart" class="resource-redirectStart"></span>
  <span id="resource-same-origin-redirectEnd" class="resource-redirectEnd"></span>
  <span id="resource-same-origin-fetchStart" class="resource-fetchStart"></span>
  <span id="resource-same-origin-domainLookupStart" class="resource-domainLookupStart"></span>
  <span id="resource-same-origin-domainLookupEnd" class="resource-domainLookupEnd"></span>
  <span id="resource-same-origin-connectStart" class="resource-connectStart"></span>
  <span id="resource-same-origin-secureConnectionStart" class="resource-secureConnectionStart"></span>
  <span id="resource-same-origin-connectEnd" class="resource-connectEnd"></span>
  <span id="resource-same-origin-requestStart" class="resource-requestStart"></span>
  <span id="resource-same-origin-responseStart" class="resource-responseStart"></span>
  <span id="resource-same-origin-responseEnd" class="resource-responseEnd"></span>
</div>

<div id="output-resource-same-origin-performance"></div>


## Resource Performance (different origin)

<div class="resource-overview">
  <span id="resource-diff-origin-startTime" class="resource-startTime"></span>
  <span id="resource-diff-origin-redirectStart" class="resource-redirectStart"></span>
  <span id="resource-diff-origin-redirectEnd" class="resource-redirectEnd"></span>
  <span id="resource-diff-origin-fetchStart" class="resource-fetchStart"></span>
  <span id="resource-diff-origin-domainLookupStart" class="resource-domainLookupStart"></span>
  <span id="resource-diff-origin-domainLookupEnd" class="resource-domainLookupEnd"></span>
  <span id="resource-diff-origin-connectStart" class="resource-connectStart"></span>
  <span id="resource-diff-origin-secureConnectionStart" class="resource-secureConnectionStart"></span>
  <span id="resource-diff-origin-connectEnd" class="resource-connectEnd"></span>
  <span id="resource-diff-origin-requestStart" class="resource-requestStart"></span>
  <span id="resource-diff-origin-responseStart" class="resource-responseStart"></span>
  <span id="resource-diff-origin-responseEnd" class="resource-responseEnd"></span>
</div>

<div id="output-resource-diff-origin-performance"></div>


## Resource Performance (different origin, and `Timing-Allow-Origin`)

<div class="resource-overview">
  <span id="resource-cors-origin-startTime" class="resource-startTime"></span>
  <span id="resource-cors-origin-redirectStart" class="resource-redirectStart"></span>
  <span id="resource-cors-origin-redirectEnd" class="resource-redirectEnd"></span>
  <span id="resource-cors-origin-fetchStart" class="resource-fetchStart"></span>
  <span id="resource-cors-origin-domainLookupStart" class="resource-domainLookupStart"></span>
  <span id="resource-cors-origin-domainLookupEnd" class="resource-domainLookupEnd"></span>
  <span id="resource-cors-origin-connectStart" class="resource-connectStart"></span>
  <span id="resource-cors-origin-secureConnectionStart" class="resource-secureConnectionStart"></span>
  <span id="resource-cors-origin-connectEnd" class="resource-connectEnd"></span>
  <span id="resource-cors-origin-requestStart" class="resource-requestStart"></span>
  <span id="resource-cors-origin-responseStart" class="resource-responseStart"></span>
  <span id="resource-cors-origin-responseEnd" class="resource-responseEnd"></span>
</div>

<div id="output-resource-cors-origin-performance"></div>

<script type="text/javascript" src="./test.js?nowrap"></script>
