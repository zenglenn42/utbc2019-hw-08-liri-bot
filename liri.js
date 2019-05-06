// https://www.npmjs.com/package/spotify-web-api-node

require("dotenv").config();

// const axios = require("axios");
const keys = require("./keys.js");

const spotifyClientId = keys.spotify.id;
const spotifyClientSecret = keys.spotify.secret;

const cmd = process.argv[2];
const arg = process.argv[3];
const Spotify = require("node-spotify-api");

let spotify = new Spotify({
  id: spotifyClientId,
  secret: spotifyClientSecret
});

switch (cmd) {
  case "spotify-this-song":
    spotifyThis(arg);
    break;
  // case "concert-this":
  //   concertThis(arg);
  //   break;
  // case "movie-this":
  //   movieThis(arg);
  //   break;
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
