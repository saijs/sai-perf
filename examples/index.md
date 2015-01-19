# Demo

---

<script type='text/javascript' src='../assets/jquery.min.js?nowrap'></script>
<script type='text/javascript' src='../assets/jquery-ui.min.js?nowrap'></script>
<script type='text/javascript' src='../assets/humanize.min.js?nowrap'></script>
<script type='text/javascript' src='../assets/har-viewer.js?nowrap'></script>
<script type='text/javascript' src='../assets/mustache.js?nowrap'></script>
<link rel='stylesheet' href='../assets/jquery-ui.css'/>
<link rel='stylesheet' href='../assets/har-viewer.css'/>

<script src="../spm_modules/sai/3.0.0/seer-sai.js?nowrap"></script>
<script src="../spm_modules/sai/3.0.0/seer-jsniffer.js?nowrap"></script>
<script src="https://a.alipayobjects.com/seajs/seajs/2.2.3/sea.js"></script>

<style>
.request > span:nth-child(6) {
  display: inline-block;
  width: 200px;
}
.timelineBar {
  border-left: 1px solid #f60;
}
</style>

<div id="har-view"></div>

<pre id="perf"></pre>

````javascript
Sai.server = "https://magentmng.alipay.com/m.gif"

seajs.use(['index', 'jquery'], function(Performance, $) {

  function typeOf(type) {
    return function(object) {
      return Object.prototype.toString.call(object) === '[object ' + type + ']'
    }
  }
  var isString = typeOf("String")
  var isNumber = typeOf("Number")
  var isBoolean = typeOf("Boolean")
  var isArray = typeOf("Array")
  var isObject = typeOf("Object")

  function JSON2querystring (json){
    var querystring = [];
    var value;

    function encodeObject(object){
    }

    for (var key in json) {
      value = json[key]
      if (isString(value) || isNumber(value) || isBoolean(value)) {
        querystring.push(encodeURIComponent(key) + '=' + encodeURIComponent(value))
      } else if (isObject(value)) {
        querystring.push('(' + key + '=' + JSON2querystring(value) + ')')
      } else if (isArray(value)) {
        querystring.push('(' + key + '=' + JSON2querystring(value) + ')')
      }
    }
    return querystring.join("")
  }

  function repeat(string, times){
    return new Array(times + 1).join(string);
  }

  $(window).on("load", function(){
    window.setTimeout(function(){
      var har_data = Performance.perf();
      //console.log("Perf", har_data, JSON.stringify(har_data).length);
      //console.log("E", JSON2querystring(har_data))


      jQuery('#har-view').HarView();
      var har_viewer = jQuery('#har-view').data('HarView');
      har_viewer.render(har_data);

      var indent = 0;
      $("#perf").html(JSON.stringify(har_data).replace(/\{|\},|\}|["0-9],/g, function($0){
        if ($0 === '{') {
          indent += 2;
        } else if ( $0 === '},') {
          indent -= 2;
          $0 = '<br />' + repeat(' ', indent) + $0;
        } else if ( $0 === '}') {
          indent -= 2;
          $0 = '<br />' + repeat(' ', indent) + $0;
        } else if ($0 === '",') {
        }
        return $0 + '<br/>' + repeat(" ", indent);
      }));
    }, 200)
  });

});
````

<!-- iframe width="1" height="1" src="http://www.baidu.com"></iframe -->
