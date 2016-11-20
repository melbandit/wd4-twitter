var TwitterApi = (function(options) {

    var $searchTimelineField = document.getElementById('timeline-search-input');
    var $timelineButton = document.getElementById('timeline-submit-button');
    var $timelineList = document.getElementById('timeline');

    var $quickSearchField = document.getElementById('quick-search-input');
    var $quickSearchButton = document.getElementById('quick-search-submit');
    var $quickSearchList = document.getElementById('quick-search');

    var $detailedSearchField = document.getElementById('detailed-search-input');
    var $limitSearchAmount = document.getElementById('limit');
    var $detailedResultType = document.getElementById('search-result-type');
    var $detailedSearchButton = document.getElementById('detailed-search-submit');
    var $detailedSearchList = document.getElementById('detailed-search');


	var shared = {};
	var options = options || {};

	function setupListeners() {
		console.log('setupListeners()');
        $timelineButton.addEventListener("click", searchTimeline);
        $quickSearchButton.addEventListener("click", searchTweets);
        $detailedSearchButton.addEventListener("click", searchDetailedTweets);
	}

    function searchTimeline(event){
        event.preventDefault();

        var url = "twitter-proxy.php?op=user_timeline&screen_name=" + $searchTimelineField.value + "&count=10";
 
        $.ajax({
            url: url,
            dataType: 'json',
            method: 'GET',
        }).done(function(result) {
        	console.log("timeline worked", result);
            processTimelineResults(result);
        }).fail(function(err) {
            console.log("timeline not working");
            throw err;
        });
    }

    function processTimelineResults(results){
        console.log('Timeline results:',results);

        $timelineList.innerHTML = ' ';

        var docs = results;

        if (results.length) {
            for (var i = 0; i < results.length; i++) {
                var result = docs[i];
                $timelineList.innerHTML += '<li>' +'<p>' + result.user.screen_name + '</p>' + '"' + result.text + '"' + '</li>' ;
            }
        } else {
            console.warn("status not OK");
        }

	}

    function searchTweets(event){
        event.preventDefault();

        var url = "twitter-proxy.php?op=search_tweets&q=" + $quickSearchField.value + "&result_type=recent&count=10";
 
        $.ajax({
            url: url,
            dataType: 'json',
            method: 'GET',
        }).done(function(result) {
            //console.log("Tweet quick search worked", result);
            processTweetResults(result);
        }).fail(function(err) {
            console.log("Tweet quick search not working");
            throw err;
        });
    }

    function processTweetResults(results){
        console.log('Tweet results', results.statuses);

        $quickSearchList.innerHTML = ' ';

        var docs = results.statuses;

        if (results.statuses.length) {
            for (var i = 0; i < results.statuses.length; i++) {
                var result = docs[i];
                $quickSearchList.innerHTML += '<li>' +'<p>' + result.user.screen_name + '</p>' + '"' + result.text + '"' + '</li>' ;
            }
        } else {
            console.warn("status not OK");
        }

    }

    function searchDetailedTweets(event){
        event.preventDefault();

        var url = "twitter-proxy.php?op=search_tweets&q=" + $detailedSearchField.value + "&result_type=" + $detailedResultType.value + "&count=" + $limitSearchAmount.value;
 
        $.ajax({
            url: url,
            dataType: 'json',
            method: 'GET',
        }).done(function(result) {
            //console.log("Tweet quick search worked", result);
            processDetailedTweetResults(result);
        }).fail(function(err) {
            console.log("Tweet quick search not working");
            throw err;
        });
    }

    function processDetailedTweetResults(results){
        console.log('Tweet results', results.statuses);

        $detailedSearchList.innerHTML = ' ';

        var docs = results.statuses;

        if (results.statuses.length) {
            for (var i = 0; i < results.statuses.length; i++) {
                var result = docs[i];
                $detailedSearchList.innerHTML += '<li>' +'<p>'  + result.user.screen_name + '</p>' + '"' + result.text + '"' + '</li>' ;
            }
        } else {
            console.warn("status not OK");
        }

    }

	var init = function() {
		console.log('init()');
        setupListeners();
	};
	shared.init = init;

	return shared;
}());

$(document).ready(function(){
	TwitterApi.init();
});
