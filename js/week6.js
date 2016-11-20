
var TwitterApi = (function(options) {
    var shared = {},
        options = options || {};

    function setupListeners() {
        console.log('setupListeners()');

        setupTimeline();
        setupSearch();
    }

    function setupTimeline() {

        $('form[name=timeline] button').click(function(event) {
            var $e = $(event.currentTarget),
            $form = $e.closest('form'),
            screen_name = $form.find('input[type=text]').val(),
            $results = $form.find('.results ul'),
      params = {};

            params['op'] = 'user_timeline';
            params['screen_name'] = screen_name;
      $.ajax({
        dataType: "json",
        url: 'twitter-proxy.php',
        data: params
      }).done(function(response) {
        $results.empty();
        for (var i = 0, max = response.length; i < max; i++) {
          var r = response[i];
          var status = r.text;
          var li = document.createElement('li');
          var txt = document.createTextNode(status);
          li.appendChild(txt);
          $results.append(li);
        }
      });

            return false;
        });
    }

    function setupSearch() {

        $('form[name=search] button').click(function(event) {
            var $e = $(event.currentTarget),
                $form = $e.closest('form'),
                params = {},
                $results = $form.find('.results ul'),
                keyword = $form.find('input[name=q]').val();

            params['op'] = 'search_tweets'; // which PHP function to run
            params['q'] = keyword; // argument for the Twitter search API
            var $count_f = $form.find('input[name=count]');
            if ($count_f) {
                params['count'] = $count_f.val();// argument for the Twitter search API
            }
            var $result_type_f = $form.find('select[name=result_type]');
            if ($result_type_f) {
                params['result_type'] = $result_type_f.val();// argument for the Twitter search API
            }

      $.ajax({
        dataType: "json",
        url: 'twitter-proxy.php',
        data: params
      }).done(function(response) {

                    $results.empty();
                    for (var s in response.statuses) {
                        var status = response.statuses[s];
                        var li = document.createElement('li');
                        var txt = status['text'];
                        var txtNode = document.createElement('span');
                        txtNode.innerHTML = txt
                        li.appendChild(txtNode);
                        $results.append(li);
                    }
            });

            return false;
        });
    }
    function displayTweets() {
        // ...

        // foreach(tweet) {
        //   var highlightedTweet = RegExModule.highlightTweet(tweet, keyword)  
        // }
    }

    var init = function() {
        console.log('init()');
        setupListeners();
    };
    shared.init = init;

    return shared;
}());

TwitterApi.init();

    
var RegExModule = (function() {
    function matchURL(string) {
        var urlRE = /(?:(?:https?|ftp|file):\/\/|www\.|ftp\.)(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[-A-Z0-9+&@#\/%=~_|$?!:,.])*(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[A-Z0-9+&@#\/%=~_|$])/igm;
        var matched = string.match(urlRE);
        return matched;
    }
    function highlightTweet(tweet, keyword){
        var processed = highlightURL(tweet);
        processed = higlightTwitterHandle(processed);
        processed = higlightKeyword(processed, keyword);
        return processed;
    }
    function highlightKeword(string, word){

    }
    function highlightTwitterHandle(tweet){
        var twitterHandleRE = /(^|[^@\w])@(\w{1,15})\b/;
        var matched = tweet.match(twitterHandleRE);

        var newString ='<a class="highlight" href=http://twitter.com/"' + newString + '">' + newString + '</a>';

        return newString;

    }
    function highlightURL(string) {
        //match a URL in the string, and then modify the strong to turn the URL into a hyperlink
        var newString = matchURL(string);
        //process the matched URL...
        var newString ='<a class="highlight" href="' + newString + '">' + newString + '</a>';
        // (fill in code here)
        //and then return the new string:
        return newString;
    }
    function matchEmail(string){
        var emailRE = /(.+@.+\..+)/;
        var matched = string.match(emailRE);
        //"bob@bob.com".match(emailRE);
        return matched;
    }
    function init(){

    }
    return {
        init: init,
        matchEmail: matchEmail,
        matchURL: matchURL
    }

})();
$document.ready(function() {
    RegExModule.init();
});

