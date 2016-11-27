var GoogleMapApi = (function(){
    var map;
    var service;

    var centerPoint = {
      lat: 33.734088, 
      lng: -84.372260, 
      name: 'Zoo Atlanta', 
      formatted_address: '800 Cherokee Ave SE, Atlanta, GA 30315'
    };
    //var centerPoint = {lat: 33.833935, lng: -84.357232};

    var $searchField = document.getElementById('search-input');
    var $searchButton = document.getElementById('search-submit-button');
    var $placesList = document.getElementById('search-list');


    function initMap() {
        
        map = new google.maps.Map(document.getElementById('map'), {
            center: centerPoint,
            zoom: 15,
            styles: [
              {elementType: 'geometry', stylers: [{color: '#242f3e'}]},
              {elementType: 'labels.text.stroke', stylers: [{color: '#242f3e'}]},
              {elementType: 'labels.text.fill', stylers: [{color: '#746855'}]},
              {
                featureType: 'administrative.locality',
                elementType: 'labels.text.fill',
                stylers: [{color: '#d59563'}]
              },
              {
                featureType: 'poi',
                elementType: 'labels.text.fill',
                stylers: [{color: '#d59563'}]
              },
              {
                featureType: 'poi.park',
                elementType: 'geometry',
                stylers: [{color: '#365e44'}]
              },
              {
                featureType: 'poi.park',
                elementType: 'labels.text.fill',
                stylers: [{color: '#6b9a76'}]
              },
              {
                featureType: 'road',
                elementType: 'geometry',
                stylers: [{color: '#a65bc2'}]
              },
              {
                featureType: 'road',
                elementType: 'geometry.stroke',
                stylers: [{color: '#212a37'}]
              },
              {
                featureType: 'road',
                elementType: 'labels.text.fill',
                stylers: [{color: '#9ca5b3'}]
              },
              {
                featureType: 'road.highway',
                elementType: 'geometry',
                stylers: [{color: '#746855'}]
              },
              {
                featureType: 'road.highway',
                elementType: 'geometry.stroke',
                stylers: [{color: '#1f2835'}]
              },
              {
                featureType: 'road.highway',
                elementType: 'labels.text.fill',
                stylers: [{color: '#f3d19c'}]
              },
              {
                featureType: 'transit',
                elementType: 'geometry',
                stylers: [{color: '#2f3948'}]
              },
              {
                featureType: 'transit.station',
                elementType: 'labels.text.fill',
                stylers: [{color: '#d59563'}]
              },
              {
                featureType: 'water',
                elementType: 'geometry',
                stylers: [{color: '#5b78c2'}]
              },
              {
                featureType: 'water',
                elementType: 'labels.text.fill',
                stylers: [{color: '#515c6d'}]
              },
              {
                featureType: 'water',
                elementType: 'labels.text.stroke',
                stylers: [{color: '#17263c'}]
              }
            ]
        });
        createMarker(centerPoint);
        $searchButton.addEventListener("click", doSearch);
    }

    function createMarker(aLatLng){
        //console.log("createMarker:", aLatLng);
        var marker = new google.maps.Marker({
            position: aLatLng,
            map: map,
            title: aLatLng.name,
            formatted_address: aLatLng.formatted_address
        });
        createInfoWindow(marker);

    }

    function createInfoWindow(marker){
        //console.log("createInfoWindow", marker);
        var contentString = '<h4>'+marker.title+'</h4>' + marker.formatted_address;
        var infowindow = new google.maps.InfoWindow({
            content: contentString
        });
        marker.addListener('click', function(){
            infowindow.open(map, marker);
        });
    }

    function processPlacesResults(results, status){
        //console.log('results',results);
        //console.log('status', status);
        //console.log('name', result.name);
        $placesList.innerHTML = ' ';

        if (status == google.maps.places.PlacesServiceStatus.OK) {
            for (var i = 0; i < results.length; i++) {
                var result = results[i];
                // window.result = result; //to make it a global variabl, console
                //console.log('result', result);
                var newMarker = {
                    lat: result.geometry.location.lat(),
                    lng: result.geometry.location.lng(),
                    name: result.name,
                    formatted_address: result.formatted_address
                };
                createMarker(newMarker);
                $placesList.innerHTML += '<li>' + result.name + '</li>';
                //place.geometry.location.lat()
                //place.geometry.location.lng()
            }
        }
    }

    function doSearch(event){

        event.preventDefault();

        var request = {
            location: centerPoint,
            radius: '500',
            // name: aLatLng,
            query: $searchField.value
        };
        var service = new google.maps.places.PlacesService(map);
        // service.nearbySearch(request, callback);
        service.textSearch(request, processPlacesResults);
    }

    return{
        initMap: initMap
    };

}());

var TwitterApi = (function(options) {
    var shared = {},
        options = options || {};

    function setupListeners() {
        console.log('setupListeners()');

        setupTimeline();
        setupSearch();
        // displayTweets();
    }

    function setupTimeline() {
        $('form[name=timeline] button').click(function(event) {
            var $e = $(event.currentTarget),
                $form = $e.closest('form'),
                screen_name = $form.find('input[type=text]').val(),
                $results = $form.find('.results ul'),
                keyword = $form.find('input[name=screen_name]').val();

                params = {};

                params['op'] = 'user_timeline';
                params['screen_name'] = screen_name;
        $.ajax({
            dataType: "json",
            url: 'twitter-proxy.php',
            resultElements: $results,
            data: params//,
            //keyword: screen_name
        }).done(function(response) {
            console.log("attempting");
            $results.empty();
            for (var i = 0, max = response.length; i < max; i++) {
                var r = response[i];
                var status = r.text;
                var li = document.createElement('li');
                var txt = document.createTextNode(status);
                //var txtNode_SN = document.createElement('p');
                var txtNode = document.createElement('span');
                if(keyword != null){
                    //console.log(status.text, keyword);
                    var highlightedKeyword = RegExModule.highlightTweet(status, keyword);
                    console.log("highlightedKeyword:", highlightedKeyword);
                } else{
                    txtNode.innerHTML = txt;
                }
                //txtNode.innerHTML = txt;
                txtNode.innerHTML = highlightedKeyword;
                li.appendChild(txtNode);
                //li.appendChild(txt);
                $results.append(li);
            }
            //displayTweets($results, response.statuses);
            //displayTweets($results, response);  //correct
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
            resultElements: $results,
            data: params,
            keyword: keyword
        }).done(function(response) {
            displayTweets($results, response.statuses, keyword);
        });
            return false;
        });
    }
    function displayTweets($results, response, keyword) {
        console.log("displayTweets", $results);
        $results.empty();
        for (var s in data) {
            var status = data[s];
            var li = document.createElement('li');
            var screen_name = status.user.screen_name;
            var txt = status['text'];
            var txtNode_SN = document.createElement('p');
            var txtNode = document.createElement('span');
            if(keyword != null){
                console.log(status.text, keyword);
                var highlightedKeyword = RegExModule.highlightTweet(status.text, keyword);
                console.log("highlightedKeyword:", highlightedKeyword);
            } else{
                txtNode.innerHTML = txt;
            }
            txtNode_SN.innerHTML = screen_name;
            txtNode.innerHTML = highlightedKeyword;
            //txtNode.innerHTML = txt;
            li.appendChild(txtNode_SN);
            li.appendChild(txtNode);
            $results.append(li);
        }

        // // var keyword = $form.find('input[name=q]').val();

        // for(tweet = ;tweet++;) {
        //   var highlightedTweet = RegExModule.highlightTweet(tweet, keyword)  
        // }
        // return highlightTweet;
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
        //console.log("matchURL:", string.text);
        var urlRE = /(?:(?:https?|ftp|file):\/\/|www\.|ftp\.)(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[-A-Z0-9+&@#\/%=~_|$?!:,.])*(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[A-Z0-9+&@#\/%=~_|$])/igm;
        ///[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi
        var matched = string.match(urlRE);
        return matched;
    }
    function highlightTweet(tweet, keyword){
        //console.log("tweet:", tweet, "keyword", keyword);
        var processed = highlightURL(tweet);
        //console.log("processed1:", processed);
        var processed = highlightTwitterHandle(processed);
        //console.log("processed2:", processed);
        var processed = highlightKeyword(processed, keyword);
        console.log("processed3:", processed);
        return processed;
    }
    function highlightKeyword(string, keyword){
        //console.log("string:", tweet, "keyword:", keyword);
        //var newString = tweet.replace(keyword, '<span class="highlight">'+ keyword + '</span>');
        //return newString;
        var keywordRE = new RegExp("("+keyword+")", "gi");
        var newString = string.replace(keywordRE,'<span class="highlight">$1</span>');

        return newString;
    }
    function highlightTwitterHandle(tweet){
        // var twitterHandleRE = /(^|[^@\w])@(\w{1,15})\b/; /([@][A-z0-9]+)|([#][A-z0-9]+)/g
        var twitterHandleRE = /([@][A-z0-9]+)/g;

        var matched = tweet.match(twitterHandleRE);

        var newString = tweet.replace(matched, '<a class="highlight" href="http://twitter.com/' + matched + '" target="_blank">' + matched + '</a>');

        // for(var s in matched){
        //     var status = matched[s];
        //     var newString ='<a class="highlight" href="http://twitter.com/' + status + '">' + status + '</a>';
        // }
        // $regex = "/(?<=^|(?<=[^a-zA-Z0-9-_\.]))@([A-Za-z]+[A-Za-z0-9]+)/i";
        // preg_replace($regex, "<a href='http://twitter.com/$1'>@$1</a>", $string);
        //newString = newString.replace(twitterHandleRE, "<a href='http://twitter.com/$1'>@$1</a>", tweet);
        return newString;

    }
    function highlightURL(string) {
        //match a URL in the string, and then modify the strong to turn the URL into a hyperlink
        var newString = matchURL(string);
        //process the matched URL...
        var newHighlightedString = string.replace(newString, '<a class="highlight" href="' + newString + '">' + newString + '</a>');
        // (fill in code here)
        //and then return the new string:
        return newHighlightedString;
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
        matchURL: matchURL,
        highlightTweet: highlightTweet,
        highlightKeyword: highlightKeyword
    }

})();
//$document.ready(function() {
    RegExModule.init();
//});
