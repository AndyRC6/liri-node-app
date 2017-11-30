var userInput = process.argv.splice(2);
var command = userInput[0];
userInput = userInput.splice(1);
userInput = userInput.join(' ');
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var request = require('request');
var fs = require('fs');
var keys = require('./keys');

function spotifySong(){
    var spotify = new Spotify({
        id: keys.spotifyKeys.id,
        secret: keys.spotifyKeys.secret
    });

    if(userInput === ""){
        userInput = 'man in the mirror';
    }

    spotify.search({limit: '1', type: 'track', query: userInput}, function(err, data){
        if(!err){
            console.log('Song Name: ' + data.tracks.items[0].name);
            console.log('Artist Name: ' + data.tracks.items[0].album.artists[0].name);
            console.log('Album Name: ' + data.tracks.items[0].album.name);
            console.log('Preview: ' + data.tracks.items[0].href);
        }
        else{
            console.log(err);
        }
    })
}

function movieThis(){

    if(userInput === ""){
        userInput = 'Mr. Nobody';
    }

    request(`http://www.omdbapi.com/?t=${userInput}&y=&plot=short&apikey=trilogy`, function(error, response, body) {
          if (!error && response.statusCode === 200) {
            console.log('Name: ' + JSON.parse(body).Title);
            console.log('Year: ' + JSON.parse(body).Year);
            console.log('IMDB Rating: ' + JSON.parse(body).Ratings[0].Value);
            console.log('Rotten Tomatoes Rating: ' + JSON.parse(body).Ratings[1].Value);
            console.log('Country: ' + JSON.parse(body).Country);
            console.log('Language: ' + JSON.parse(body).Language);
            console.log('Plot: ' + JSON.parse(body).Plot);
            console.log('Cast: ' + JSON.parse(body).Actors);
          }
    });
}

function myTweets(){
    var client = new Twitter({
        consumer_key: keys.twitterKeys.consumer_key,
        consumer_secret: keys.twitterKeys.consumer_secret,
        access_token_key: keys.twitterKeys.access_token_key,
        access_token_secret: keys.twitterKeys.access_token_secret
    });

    var params = {screen_name: 'andyrc700'};
    client.get('statuses/user_timeline', params, function(error, tweets, response) {
      if (!error) {
        tweets.forEach(function(item){
            console.log(item.created_at);
            console.log(item.text);
        })
      }
    });
}

function doWhatItSays(){
    fs.readFile('random.txt', 'utf-8', function(err, data){
        if(!err){
            var fileInput = data.split(' ');
            var fileCommand = fileInput[0];
            fileInput = fileInput.splice(1);
            fileInput = fileInput.join(' ');
            userInput = fileInput;

            switch(fileCommand.trim()){
                case "spotify-this-song": spotifySong();
                break;
                case "movie-this": movieThis();
                break;
                case "my-tweets": myTweets();
                break;
                case "do-what-it-says": doWhatItSays();
            }

        }
        else{
            throw err;
        }
    })
}

switch(command.trim()){
    case "spotify-this-song": spotifySong();
    break;
    case "movie-this": movieThis();
    break;
    case "my-tweets": myTweets();
    break;
    case "do-what-it-says": doWhatItSays();
}

