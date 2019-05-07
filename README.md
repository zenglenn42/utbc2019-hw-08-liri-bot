# utbc2019-hw-08-liri-bot (Language Interpretation and Recognition Interface, LIRI)

Low-end siri?  Playing with nodejs and axios for ajax calls outside the cocoon of the browser.

## Usage

```
node liri.js spotify-this-song "song name"
node liri.js movie-this "movie title"
node liri.js concert-this "band or artist"
node liri.js do-what-it-says   (reads command from random.txt)
```

## Examples

### spotify-this-song

```
$ node liri.js spotify-this-song "blue suede shoes"
------------------------------------------------------------------------------------------
Artist: Elvis Presley
Song name: Blue Suede Shoes
Preview link: https://p.scdn.co/mp3-preview/cd57814726943052ca66e279a3fe23cf9cbfbd93?cid=bda9c4a64c2a4ec681a3d216bd8bda8b
Album: Elvis Presley
```

If the song is not found in the database, the specification says to offer the following consolation:

```
$ node liri.js spotify-this-song "this is not a song"

No exact match found for song, this is not a song
Enjoy the lively stylings of 'Ace of Base' as a consolation.

------------------------------------------------------------------------------------------
Artist: Ace of Base
Song name: The Sign
Preview link: https://p.scdn.co/mp3-preview/4c463359f67dd3546db7294d236dd0ae991882ff?cid=bda9c4a64c2a4ec681a3d216bd8bda8b
Album: The Sign (US Album) [Remastered]
```

### movie-this

```
$ node liri.js movie-this "it's a wonderful life"
Title: It's a Wonderful Life
Year: 1946
IMDB rating: 8.6
Rotten Tomatores rating: 93%
Country: USA
Language: English, French
Plot: An angel is sent from Heaven to help a desperately frustrated businessman by showing him what life would have been like if he had never existed.
Actors: James Stewart, Donna Reed, Lionel Barrymore, Thomas Mitchell
```

### concert-this

$ node liri.js concert-this "Bob Schneider"
------------------------------------------------------------------------------------------
Lineup: Bob Schneider Music
Venue: Nutty Brown Amphitheatre
Location: Austin, TX
Date: 05/25/2019
------------------------------------------------------------------------------------------
Lineup: Bob Schneider Music
Venue: Dakota (Early Show)
Location: Minneapolis, MN
Date: 06/01/2019
------------------------------------------------------------------------------------------
Lineup: Bob Schneider Music
Venue: Dakota (Late Show)
Location: Minneapolis, MN
Date: 06/01/2019
------------------------------------------------------------------------------------------
Lineup: Bob Schneider Music
Lineup: Carolina Story
Venue: Shank Hall
Location: Milwaukee, WI
Date: 06/18/2019

### do-what-it-says

random.txt
```
spotify-this-song,"I Want it That Way"
```

```
$ node liri.js do-what-it-says
------------------------------------------------------------------------------------------
Artist: Backstreet Boys
Song name: I Want It That Way
Preview link: https://p.scdn.co/mp3-preview/e72a05dc3f69c891e3390c3ceaa77fad02f6b5f6?cid=bda9c4a64c2a4ec681a3d216bd8bda8b
Album: The Hits--Chapter One
```
