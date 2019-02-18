
let currently_playing;
let next_song;
let playlist = [];
let backup_playlist = [];

function LoadSong(song) {
  next_song = {};
  next_song.song = new Audio(song.name);
  next_song.data = song;
  return next_song;
}

function PlayNextSong(xfade) {
  if (!xfade || !currently_playing) {
    if (!next_song) { CueNextSong(); }
    if (next_song) {
      currently_playing = next_song;
      currently_playing.song.play();
      currently_playing.song.onended = function() { PlayNextSong(); }
      display_song();
      CueNextSong();
    }
  } else if (xfade) {
    XFadeMusicDec();    
  }
}

function CueNextSong() {
  if (!playlist.length) {
    RegenPlaylist();
  }
  let newsong = playlist.shift();
  let next_song;
  if (newsong) { next_song = LoadSong(newsong); }
  return next_song;
}

function XFadeMusicDec() {
  if (currently_playing.song) {
    if (currently_playing.song.volume > 0) {
      currently_playing.song.volume -= .125;
      setTimeout(function() { XFadeMusicDec(); }, 150);
    } else {
      currently_playing.song.pause();
      currently_playing = next_song;
//    currently_playing.song.volume = 0;  //  why fade in? Just start.
      currently_playing.song.play();
      currently_playing.song.onended = function() { PlayNextSong(); }
      CueNextSong();
      display_song();
//    XFadeMusicInc();
    }
  } else {
    if (next_song) { 
      currently_playing = next_song;
      currently_playing.song.play();
      currently_playing.song.onended = function() { PlayNextSong(); }
      CueNextSong();
      display_song();
    }
  }
}

function XFadeMusicInc() {
  let maxvol = 1;
  if (currently_playing.data.volume) { maxvol = currently_playing.data.volume; }
  if (currently_playing.song.volume < maxvol) {
    currently_playing.song.volume += .125;
    if (currently_playing.song.volume > 1) { currently_playing.song.volume = 1; }
    setTimeout(function() { XFadeMusicInc(); }, 150);
  } 
}


function RegenPlaylist() {
  console.log("Regening playlist...");
  if (state === "peace") {
    if (locations[current_location].soundtrack) {
      if (soundtrack[locations[current_location].soundtrack].shuffle) {
        let newsnd = soundtrack[locations[current_location].soundtrack].songs.slice();
        newsnd = ShuffleArray(newsnd);
        playlist = newsnd;
      } else {
        let newsnd = soundtrack[locations[current_location].soundtrack].songs.slice();
        playlist = newsnd;
      }
    }
  } else {
    if (soundtrack.hasOwnProperty(combattype)) {
      let newsnd = soundtrack[combattype].songs.slice();
      newsnd = ShuffleArray(newsnd);
      playlist = newsnd;
    }
  }

  let next = playlist.shift();
//  PlayMusic(next);
}
