// Capture the relevant command-line arguments.

const cmd = process.argv[2];
const arg = process.argv[3];

// Source in super spotify credentials and instantiate
// a spotify object that will smooth over all the distressing details
// of Spotify's api.  :-)

require("dotenv").config();
const keys = require("./keys.js");
const Spotify = require("node-spotify-api");
const spotifyClientId = keys.spotify.id;
const spotifyClientSecret = keys.spotify.secret;
let spotify = new Spotify({
  id: spotifyClientId,
  secret: spotifyClientSecret
});

// Leverage the aixos package for issuing ajax calls against
// omdb and bandsintown.com endpoints.

const axios = require("axios");

// We'll need this to support the 'do-what-it-says' requirement
// where we stuff command-line arguments into a file.

const fs = require("fs");

// Use this to format the dates for concert events associated with
// the 'concert-this' requirement.

let moment = require("moment");

// Process the LIRI command-lind arguments.

dispatchCmd(cmd, arg);

function dispatchCmd(cmd, arg) {
  switch (cmd) {
    case "spotify-this-song":
      let exactMatchFound = false;
      spotifyThis(arg, exactMatchFound);
      break;
    case "concert-this":
      concertThis(arg);
      break;
    case "movie-this":
      movieThis(arg);
      break;
    case "do-what-it-says":
      doWhatItSays("random.txt");
      break;
    default:
      console.log("Unrecognized command: ", cmd);
      break;
  }
}

// Handle each specific form of input.

function spotifyThis(songTitle, exactMatchFound) {
  const defaultSongTitle = "The Sign";

  spotify
    .search({ type: "track", query: songTitle, limit: 10 })
    .then(function(response) {
      if (exactMatchFound) return;

      let trackItems = response.tracks.items;
      trackItems.map(trackItem => {
        if (exactMatchFound) return;

        let albumName = trackItem.album.name;
        let previewUrl = trackItem.preview_url;
        let trackUri = trackItem.uri;
        let trackName = trackItem.name.trim();
        let trackname = trackName.toLowerCase();
        let songtitle = songTitle.toLowerCase().trim();
        // console.log("trackname = ", trackname);
        // console.log("songtitle = ", songtitle);
        if (trackname === songtitle) {
          exactMatchFound = true;

          console.log(
            "------------------------------------------------------------------------------------------"
          );
          let trackArtists = trackItem.artists;
          trackArtists.map(trackArtistObj => {
            let trackArtist = trackArtistObj.name;
            let trackArtistId = trackArtistObj.id;
            console.log("Artist:", trackArtist);
          });

          console.log("Song name:", trackName);
          if (previewUrl) {
            console.log("Preview link:", previewUrl);
          } else {
            console.log("Preview link:", "unavailable");
          }
          console.log("Album:", albumName);
          // console.log("Track URI:", trackUri);
        } else {
          // console.log("\nIgnoring partial match:", trackName);
          // console.log("Preview link:", previewUrl);
          // console.log("Album:", albumName);
          // console.log("Track URI:", trackUri);
          // console.log("\n");
        }
      });
      if (!exactMatchFound) {
        console.log(`\nNo exact match found for song, ${songTitle}`);
        console.log(
          "Enjoy the lively stylings of 'Ace of Base' as a consolation.\n"
        );
        spotifyThis(defaultSongTitle);
      }
    })
    .catch(function(err) {
      console.log(err);
    });
}

// Here is an example array of track items related to a given song name returned from
// a track search using the node-spotify-api npm package:
//
// let response.tracks.items = [
//   {
//     album: {
//       album_type: "album",
//       artists: [Array],
//       available_markets: [Array],
//       external_urls: [Object],
//       href: "https://api.spotify.com/v1/albums/0K4pIOOsfJ9lK8OjrZfXzd",
//       id: "0K4pIOOsfJ9lK8OjrZfXzd",
//       images: [Array],
//       name: "25",
//       release_date: "2016-06-24",
//       release_date_precision: "day",
//       total_tracks: 11,
//       type: "album",
//       uri: "spotify:album:0K4pIOOsfJ9lK8OjrZfXzd"
//     },
//     artists: [[Object]],
//     available_markets: [],
//     disc_number: 1,
//     duration_ms: 295493,
//     explicit: false,
//     external_ids: { isrc: "GBBKS1500214" },
//     external_urls: {
//       spotify: "https://open.spotify.com/track/4sPmO7WMQUAf45kwMOtONw"
//     },
//     href: "https://api.spotify.com/v1/tracks/4sPmO7WMQUAf45kwMOtONw",
//     id: "4sPmO7WMQUAf45kwMOtONw",
//     is_local: false,
//     name: "Hello",
//     popularity: 71,
//     preview_url:
//       "https://p.scdn.co/mp3-preview/0b90429fd554bad6785faa2b8931d613db4a0ee4?cid=bda9c4a64c2a4ec681a3d216bd8bda8b",
//     track_number: 1,
//     type: "track",
//     uri: "spotify:track:4sPmO7WMQUAf45kwMOtONw"
//   }
// ];

function concertThis(artistOrBand) {
  let encodedArtistOrBand = encodeURI(artistOrBand);
  queryUrl = `https://rest.bandsintown.com/artists/${encodedArtistOrBand}/events?app_id=codingbootcamp`;
  axios({
    method: "get",
    url: queryUrl
  }).then(function(response) {
    let events = response.data;
    events.map(event => {
      let venueName = event.venue.name;
      let venueLocation = `${event.venue.city}, ${event.venue.region}`;
      let eventDateTime = event.datetime; // YYYY-MM-DDTHH:mm:ss
      let eventDate = eventDateTime.split("T")[0];
      let eventTime = eventDateTime.split("T")[1];
      let formattedEventDate = moment(eventDate).format("MM/DD/YYYY");
      let lineup = event.lineup;
      if (lineup.length > 0) {
        console.log(
          "------------------------------------------------------------------------------------------"
        );
      }
      lineup.map(group => {
        console.log("Lineup:", group);
      });
      console.log("Venue:", venueName);
      console.log("Location:", venueLocation);
      console.log("Date:", formattedEventDate);
    });
  });
}

// Here is an example array of band or artist "events" returned from bandsintown.com with
// the following query URL:
//
// https://rest/bandsintown.com/artists/${encodedArtistOrBand}/events?app_id=codingbootcamp
//
// let response.data = [
//   {
//     id: "101120661",
//     artist_id: "1073911",
//     url:
//       "https://www.bandsintown.com/e/101120661?app_id=codingbootcamp&came_from=267&utm_medium=api&utm_source=public_api&utm_campaign=event",
//     on_sale_datetime: "",
//     datetime: "2019-05-25T19:00:30",
//     description: "",
//     venue: {
//       country: "United States",
//       city: "Austin",
//       latitude: "30.208557",
//       name: "Nutty Brown Amphitheatre",
//       region: "TX",
//       longitude: "-97.972533"
//     },
//     lineup: ["Bob Schneider Music"],
//     offers: [
//       {
//         type: "Tickets",
//         url:
//           "https://www.bandsintown.com/t/101120661?app_id=codingbootcamp&came_from=267&utm_medium=api&utm_source=public_api&utm_campaign=ticket",
//         status: "available"
//       }
//     ]
//   }
// ];

function movieThis(movieTitle) {
  let encodedMovieTitle = encodeURI(movieTitle);

  queryUrl = `http://www.omdbapi.com/?t=${encodedMovieTitle}&y=&plot=short&apikey=trilogy`;
  axios({
    method: "get",
    url: queryUrl
  }).then(function(response) {
    let title = response.data.Title;
    let year = response.data.Year;
    let rating = response.data.imdbRating;
    let rottenTomatoesRating = response.data.Ratings.filter(ratingObj => {
      return ratingObj.Source.includes("Rotten Tomatoes");
    })[0].Value;
    let country = response.data.Country;
    let language = response.data.Language;
    let plot = response.data.Plot;
    let actors = response.data.Actors;
    console.log("Title:", title);
    console.log("Year:", year);
    console.log("IMDB rating:", rating);
    console.log("Rotten Tomatores rating:", rottenTomatoesRating);
    console.log("Country:", country);
    console.log("Language:", language);
    console.log("Plot:", plot);
    console.log("Actors:", actors);
  });
}

function doWhatItSays(filename) {
  fs.readFile(filename, "utf-8", function(err, data) {
    if (err) {
      return console.log(err);
    } else {
      let cmd = data.split(",")[0].trim();
      let arg = data.split(",")[1].trim();
      // Normalize argument by stripping double-quotes.
      arg = arg.replace(/^\"/g, "");
      arg = arg.replace(/"$/g, "");
      dispatchCmd(cmd, arg);
    }
  });
}
