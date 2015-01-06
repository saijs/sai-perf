# Demo

---

<script type='text/javascript' src='http://s3u.github.io/har-view/scripts/jquery.min.js'></script>
<script type='text/javascript' src='http://s3u.github.io/har-view/scripts/jquery-ui.min.js'></script>
<script type='text/javascript' src='http://s3u.github.io/har-view/scripts/humanize.min.js'></script>
<script type='text/javascript' src='http://s3u.github.io/har-view/scripts/har-viewer.js'></script>
<script type='text/javascript' src='http://s3u.github.io/har-view/scripts/mustache.js'></script>
<link rel='stylesheet' href='http://s3u.github.io/har-view/css/jquery-ui.css'/>
<link rel='stylesheet' href='http://s3u.github.io/har-view/css/har-viewer.css'/>

<script src="https://a.alipayobjects.com/seajs/seajs/2.2.3/sea.js"></script>

<div id="har-view"></div>

<pre id="perf"></pre>

````javascript
seajs.use(['index', 'jquery'], function(Performance, $) {

  function repeat(string, times){
    return new Array(times + 1).join(string);
  }

  $(window).on("load", function(){
    window.setTimeout(function(){
      var har_data = Performance.perf();
      console.log("Perf", har_data);


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

<iframe width="1" height="1" src="http://www.baidu.com"></iframe>
