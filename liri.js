const cmd = process.argv[2];
const arg = process.argv[3];

require("dotenv").config();

const axios = require("axios");
const keys = require("./keys.js");
const Spotify = require("node-spotify-api");

const spotifyClientId = keys.spotify.id;
const spotifyClientSecret = keys.spotify.secret;
let spotify = new Spotify({
  id: spotifyClientId,
  secret: spotifyClientSecret
});

let moment = require("moment");

switch (cmd) {
  case "spotify-this-song":
    spotifyThis(arg);
    break;
  case "concert-this":
    concertThis(arg);
    break;
  case "movie-this":
    movieThis(arg);
    break;
  // case "do-what-it-says":
  //   doWhatItSays(arg);
  //   break;
  default:
    console.log("Unrecognized command: ", cmd);
    break;
}

function spotifyThis(songTitle) {
  const defaultSongTitle = "The Sign";
  let exactMatch = false;

  spotify
    .search({ type: "track", query: songTitle, limit: 20 })
    .then(function(response) {
      let trackItems = response.tracks.items;
      trackItems.map(trackItem => {
        let albumName = trackItem.album.name;
        let previewUrl = trackItem.preview_url;
        let trackUri = trackItem.uri;
        let trackName = trackItem.name;
        let trackname = trackName.toLowerCase();
        let songtitle = songTitle.toLowerCase();
        if (trackname === songtitle) {
          console.log(
            "------------------------------------------------------------------------------------------"
          );
          exactMatch = true;
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
      if (!exactMatch) {
        console.log(`\nNo exact match found for song, "${songTitle}"`);
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

// Track search returns an array of items organized like this
// response.tracks.items:
//
// let spotifyTrackItems = [
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
        console.log("Band/Artist:", group);
      });
      console.log("Venue:", venueName);
      console.log("Location:", venueLocation);
      console.log("Date:", formattedEventDate);
    });
  });
}

// let events = [
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
    // console.log(response.data);
    // * Title of the movie.
    // * Year the movie came out.
    // * IMDB Rating of the movie.
    // * Rotten Tomatoes Rating of the movie.
    // * Country where the movie was produced.
    // * Language of the movie.
    // * Plot of the movie.
    // * Actors in the movie.
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
