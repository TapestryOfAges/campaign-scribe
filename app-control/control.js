"use strict";

const {ipcRenderer} = require('electron');
const fs = require("fs");
const {dialog} = require('electron').remote
const jsmediatags = require("jsmediatags");

//const {remote} = require('electron')
//const {Menu, MenuItem} = remote

let state = "launch";
// launch - app just opened
// combat - combat is running

let menustate = "none";
// none - no menu
// start/null - only "Run/Edit" buttons
// run - run buttons expanded, no edit buttons
// edit - edit buttons expanded, no run or combat buttons
// combat - run and combat buttons expanded, no edit buttons

let iconlist = {};
let icontab = "Badge";
let icondirs = [];
let preset_groups = {};
let locations = {};
let soundtrack = {};
let combattype = "Combat";  // Combat, Boss, Final
let ack_keyboard = 0;  // Are we accepting keyboard input?
let launched_display = 0;
let current_location;
let explosion = new Audio("../sounds/exp05.mp3");
let tmpbackground = "";
let selectedentity;
let notes = "";
let calendar = {};

// editing
let currently_editing = "";
let tempeditgroup = {};

function Entity() {
	this.initmod = 0;
	this.status_effects = [];
	this.init = null;
	this.align = "enemy";
	this.icon = "Other/NecromancerIcons_02_b.png";
	this.name = "";
	this.displayname = "";
	this.index = 1;
	this.ready = 0;
	this.delay = 0;
	this.tiebreaker = 0;
	this.goneyet = 0;
  this.setinit = 0;
  this.armorclass = 0;
  this.hitpoints = 0;
}

Entity.prototype.clone = function(cloneme) {
	this.initmod = cloneme.initmod;
	this.align = cloneme.align;
	this.icon = cloneme.icon;
	this.name = cloneme.name;
	this.index = cloneme.index;
	this.displayname = cloneme.displayname;
	this.tiebreaker = cloneme.initmod;
  this.goneyet = cloneme.goneyet;
  this.armorclass = cloneme.armorclass;
  this.hitpoints = cloneme.hitpoints;
}

let menulock=0;
function unlockmenu() { menulock=0; }

{
//  let dirlist = []; 
  let dirlist = fs.readdir('./icons', function(err, files) {
    for (let i=0;i<files.length;i++) {
      let workingdir = `./icons/${files[i]}`;
      icondirs[icondirs.length] = "" + files[i];
      iconlist[files[i]] = [];
      let tmp = fs.readdir(workingdir, function(err, files2) {
        for (let j=0;j<files2.length;j++) {
          iconlist[files[i]].push(files2[j]);
        }
      });    
    }
  });
}


function Prefs() {
	this.showtiebreaker = 0;
	this.pcswinties = 0;
	this.boldtext = 0;
	this.deathsound = 1;
}

let myprefs = new Prefs();

document.addEventListener("DOMContentLoaded", function(event) {   // replaces $(document).ready

	window.onkeydown = function(e) { // replaces $(window).keydown(function(e) {
//    console.log(e);
    let code = (e.keyCode ? e.keyCode : e.which);
		if ((state === "combat") && ack_keyboard)  {
      if (code == 32 || code == 78 || code == 110) { nextCombatant(); e.preventDefault(); }
      else if (code == 80 || code == 112) { prevCombatant(); e.preventDefault(); }
      else if (code == 68) { e.preventDefault(); changestate(combatants[current_turn].name, combatants[current_turn].index, "delay"); }
      else if (code == 82) { e.preventDefault(); changestate(combatants[current_turn].name, combatants[current_turn].index, "ready"); }
    } 
  }
 
  let prefstate = localStorage.getItem("preferences");  // TO-DO: remove, prefs in campaign save
  if (prefstate) {
    let statearray = state.split(",");
  
    myprefs.boldtext = statearray[0];
    myprefs.pcswinties = statearray[1];
    myprefs.showtiebreaker = statearray[2];
    myprefs.deathsound = statearray[3];
    myprefs.victorysound = statearray[4];   

    ipcRenderer.send("send_prefs", myprefs);
  }
  
  SetUpStatuses();
});


// Window menu buttons
function new_campaign() {
  show_campaign_buttons();
}

function load_campaign() {
  dialog.showOpenDialog({ properties: ['openFile'], filters: [{name: "Campaigns", extensions: ['cpn']}]}, function (fileNames) {
    if (fileNames === undefined) return;

    let fileName = fileNames[0];
    fileName = fileName.replace(/\\/g,"/");
    fs.readFile(fileName,'utf8', function(err,data) {
      let dataset = JSON.parse(data);
      preset_groups = dataset.preset_groups;
      myprefs = dataset.myprefs;
      locations = dataset.locations;
      soundtrack = dataset.soundtrack;
      userabilities = dataset.abilities;
      abilitiesmask = dataset.abilitiesmask
      userspells = dataset.spells;
      spellsmask = dataset.spellsmask;
      notes = dataset.notes;
      calendar = dataset.calendar;
    });

    show_campaign_buttons();
  }); 

}

function save_campaign() {
  dialog.showSaveDialog({filters: [{name: "Campaign", extensions: ['cpn']}]}, function(filename) {
    filename = filename.replace(/\.cpn/, "");
    filename = filename.replace(/\.CPN/, "");
    filename = filename + ".cpn";

    let campaign = {};
    campaign.soundtrack = soundtrack;
    campaign.preset_groups = preset_groups;
    campaign.myprefs = myprefs;
    campaign.locations = locations;
    campaign.abilities = userabilities;
    campaign.abilitiesmask = abilitiesmask;
    campaign.spells = userspells;
    campaign.spellsmask = spellsmask;
    campaign.notes = notes;
    campaign.calendar = calendar;
    fs.writeFile(filename,JSON.stringify(campaign),'utf8', function() {});
  });
}

// create UI
function show_campaign_buttons(callbacks) {
  if (menustate === "none") {
    document.getElementById('menu').innerHTML = `<div id='buttons' class='nonebuttons'>
    <img id='edit_campaign_button' src='../ui/edit_campaign_button.png' onClick='edit_campaign();' /><br />
    <img id='run_campaign_button' src='../ui/run_campaign_button.png' onClick='run_campaign();' />
    </div>
    <div id='edit_buttons_group' class='edit_buttons_start'><img src='../ui/edit_locations.png' style='position:relative; top: 0px;' onclick='edit_locations()' />
  <img src='../ui/edit_preset_groups.png' style='position:relative; top: 0px;' onclick='edit_presets()' />
  <img src='../ui/edit_status.png' style='position:relative; top: 0px;' onclick='EditStatusLists()' />
  <img src='../ui/edit_soundtrack.png' style='position:relative; top: 0px;' onclick='edit_soundtrack()' /></div>
    <div id='run_buttons_group' class='edit_buttons_start'><img src='../ui/change_location.png' onclick='change_location()' />
    <img src='../ui/change_background.png' onClick='change_background()' />
    <img src='../ui/change_soundtrack.png' onClick='change_playlist()' />
    <img src='../ui/prepare_combat.png' onClick='prepare_combat()' /></div>
    <div id='combat_buttons_group' class='edit_buttons_start'>
    <img src='../ui/combat_next_combat.png' id='next_combat' onClick='toggle_next_combat()' />
    <img src='../ui/combat_add.png' onClick='add_combatant()' />
    <img src='../ui/combat_roll_all.png' onClick='roll_initiative("all")' />
    <img src='../ui/combat_roll_enemy.png' onClick='roll_initiative("enemy")' />
    <img src='../ui/combat_sort.png' onClick='sort_combatants()' />
    <img src='../ui/combat_begin_combat.png' onClick='toggle_combat()' />
    </div>
    <img src='../ui/agone-Notes.png' width='50' class='notepad' onClick='ShowNotes();' />
    <img src='../ui/hawk88-Calendar-1.png' width='50' class='calendar' onClick='' />
    `;
    menustate = "start";
    if (callbacks && callbacks.length) { 
      let callback = callbacks.shift(); 
      setTimeout( function() {
        callback(callbacks);
      }, 1000); 
    }
  } else {
    if (callbacks && callbacks.length) { let callback = callbacks.shift(); callback(callbacks); }
  }
  
}

function spread_campaign_buttons(callbacks) {
  let lowerbutton = document.getElementById('run_campaign_button');
  lowerbutton.classList.remove('bottombuttonclose');
  lowerbutton.classList.add('bottombutton');
  if (callbacks && callbacks.length) { 
    let callback = callbacks.shift(); 
    setTimeout( function() {
      callback(callbacks);
    }, 300); 
  }
}

function collapse_campaign_buttons(callbacks) {
  if ((menustate === "edit") || (menustate === "null")) {
    let lowerbutton = document.getElementById('run_campaign_button');
    lowerbutton.classList.remove('bottombutton');
    lowerbutton.classList.add('bottombuttonclose');
    if (callbacks && callbacks.length) { 
      let callback = callbacks.shift(); 
      setTimeout( function() {
        callback(callbacks);
      }, 300); 
    }
    return;
  }
  if (callbacks && callbacks.length) { 
    let callback = callbacks.shift(); 
    callback(callbacks);
  }
}

function fade_out_buttons(callbacks) {
  if ((menustate === "run") || (menustate === "combat")) {
    if (menustate === "combat") {
      let combatbuttons = document.getElementById('combat_buttons_group');
      combatbuttons.classList.remove("combatfadein");
      combatbuttons.classList.add("combatfadeout");
    } 
    let runbuttons = document.getElementById('run_buttons_group');
    runbuttons.classList.remove('run_buttons');
    runbuttons.classList.add('runfadeout');
    menustate = "null";
    if (callbacks && callbacks.length) { 
      let callback = callbacks.shift(); 
      setTimeout( function() {
        callback(callbacks);
      }, 300); 
    }
    return;
  } else if (menustate === "edit") {
    let editbuttons = document.getElementById('edit_buttons_group');
    editbuttons.classList.remove('edit_buttons');
    editbuttons.classList.add('edit_buttons_out');
    menustate = "null";
    if (callbacks && callbacks.length) { 
      let callback = callbacks.shift(); 
      setTimeout( function() {
        callback(callbacks);
      }, 300); 
    }
    return;
  }
  if (callbacks && callbacks.length) { 
    let callback = callbacks.shift(); 
    callback(callbacks);
  }

}

function prepare_combat() {
  let combatbuttons = document.getElementById('combat_buttons_group');
  if (menustate === "combat") {
    combatbuttons.classList.remove("combatfadein");
    combatbuttons.classList.add("combatfadeout");
    menustate = "run";
  } else {
    combatbuttons.classList.remove("edit_buttons_start");
    combatbuttons.classList.remove("combatfadeout");
    combatbuttons.classList.add("combatfadein");
    menustate = "combat";
  }
}

function run_campaign() {
  if (!menulock) {
    menulock = 1;
    state = "peace";
    if (!launched_display) {
      ipcRenderer.send("run_game");
      launched_display = 1;
    }
    ipcRenderer.send("send_prefs", myprefs);
  
    if (menustate ==="edit") {
      fade_out_buttons([collapse_campaign_buttons,add_run_buttons,unlockmenu]);
    } else if ((menustate === "run") || (menustate === "combat")) {
      fade_out_buttons([unlockmenu]);
    } else {
      fade_out_buttons([add_run_buttons,unlockmenu]);
    }
  }
}

function edit_campaign() { 
  if (!menulock) {
    menulock = 1;
    if (menustate !== "edit") {
      fade_out_buttons([spread_campaign_buttons,add_edit_buttons,unlockmenu]);
    } else {
      fade_out_buttons([collapse_campaign_buttons,unlockmenu]);
    }
  }
}

function add_edit_buttons(callbacks) {

  let div = document.getElementById('edit_buttons_group');  
  div.classList.remove('edit_buttons_start');
  div.classList.remove('edit_buttons_out');
  div.classList.add('edit_buttons');
  menustate = "edit";
  if (callbacks && callbacks.length) { 
    let callback = callbacks.shift(); 
    setTimeout( function() {
      callback(callbacks);
    }, 300); 
  }
}

function add_run_buttons(callbacks) {

  let div = document.getElementById('run_buttons_group');  
  div.classList.remove('edit_buttons_start');
  div.classList.remove('runfadeout');
  div.classList.add('run_buttons');
  menustate = "run";
  if (callbacks && callbacks.length) { 
    let callback = callbacks.shift(); 
    setTimeout( function() {
      callback(callbacks);
    }, 300); 
  }
}


function edit_locations() {
  let buckets = Object.keys(locations);
  buckets.sort();
  document.getElementById('controlwindow').innerHTML = `<table cellpadding='3' cellspacing='2' style='text-align:center'>
  <tr>
  <td><input type='button' value='New Location' onClick='new_location()' /></td>
  </tr></table><p>`;
  for (let i=0;i<buckets.length;i++) {
    document.getElementById('controlwindow').innerHTML += '<input type="button" onClick="tmpbackground = \'\'; location_edit(\'' + buckets[i] + '\')" value="Edit" /> ' + buckets[i] + '<br />';
  }
  document.getElementById('controlwindow').innerHTML += "</p>";
}

function new_location() {
  document.getElementById('controlwindow').innerHTML = "<p>New location key:  <input type='text' size='20' name='lockey' id='lockey' /><br/>Location name: <input type='text' size='20' name='locname' id='locname' /><br /><input type='button' value='submit' onClick='create_new_location()' /></p>";
}

function create_new_location() {
  let newkey = document.getElementById('lockey').value;
  if (newkey) {
    if (locations.hasOwnProperty(newkey)) {
      document.getElementById('controlwindow').innerHTML += "<p style='color:red'>Key already exists, choose another.</p>";
    } else {
      locations[newkey] = {};
      locations[newkey].name = document.getElementById('locname').value;
      locations[newkey].background = "";
      locations[newkey].introSoundtrack = "";
      locations[newkey].soundtrack = "";

      tmpbackground = "";
      location_edit(newkey);
    }
  }
}

function location_edit(which) {
  if (!tmpbackground) { tmpbackground = locations[which].background; }
  document.getElementById('controlwindow').innerHTML = `<h2>Location: ${which} </h2>
  <form name='locform' id='locform'>
  <table cellpadding='1' cellspacing='1' border='0'>
  <tr><td>Full Name:</td><td><input type='text' size='20' name='locname' id='locname' value='${locations[which].name}' /></td></tr>
  <tr><td>Background:</td><td><span id='tmpbkg'>${tmpbackground}</span> <input type='button' onClick='changeLocationBackground("${which}")' value='Change' /></td></tr>
  <tr><td>Intro Soundtrack (optional):</td><td><input type='text' size='20' name='locintro' id='locintro' value='${locations[which].introSoundtrack}' /></td></tr>
  <tr><td>Soundtrack:</td><td><input type='text' size='20' name='locsound' id='locsound' value='${locations[which].soundtrack}' /></td></tr>
  <tr><td colspan='2'><input type='button' onClick='submit_location("${which}")' value='Submit' /></td></tr></table>`;
}

function changeLocationBackground(which) {
  dialog.showOpenDialog({ properties: ['openFile'], filters: [{name: "Images", extensions: ['jpg','gif','png']}]}, function (fileNames) {
    if (fileNames === undefined) return;

    let fileName = fileNames[0];
    fileName = fileName.replace(/\\/g,"/");
    tmpbackground = fileName;
    document.getElementById('tmpbkg').innerHTML = tmpbackground;
  }); 
}

function submit_location(which) {
  if (!locations.hasOwnProperty('which')) { locations[which] = {}; }
  locations[which].name = document.getElementById('locname').value;
  locations[which].background = tmpbackground;
  tmpbackground = "";
  locations[which].introSoundtrack = document.getElementById('locintro').value;
  locations[which].soundtrack = document.getElementById('locsound').value;
  edit_locations();
}

function edit_soundtrack() {
  let buckets = Object.keys(soundtrack);
  buckets.sort();
  document.getElementById('controlwindow').innerHTML = `<table cellpadding='3' cellspacing='2' style='text-align:center'>
  <tr>
  <td onClick='new_soundtrack()' ><img src='../ui/Square-Button-Star.png' width='24' height='24' /></td><td onClick='new_soundtrack()' style='vertical-align:middle'>New Soundtrack</td>
  </tr></table><p>`;
  for (let i=0;i<buckets.length;i++) {
    document.getElementById('controlwindow').innerHTML += '<img src="../ui/Square-Button-Settings.png" width="16" height="16" onClick="soundtrack_edit(\'' + buckets[i] + '\')" title="Edit" /> <img src="../ui/Square-Button-Delete.png" width="16" height="16" onClick="soundtrack_delete(\'' + buckets[i] + '\')" title="Delete" /> ' + buckets[i] + ' (' + soundtrack[buckets[i]].songs.length + ') <br />';
  }
  document.getElementById('controlwindow').innerHTML += "</p>";
}

function new_soundtrack() {
  document.getElementById('controlwindow').innerHTML = "<p>New soundtrack name: <input type='text' size='20' name='soundtrackname' id='soundtrackname' /><br /><input type='button' value='submit' onClick='create_new_soundtrack()' /></p>";
  document.getElementById('soundtrackname').focus();
}

function create_new_soundtrack() {
  let newname = document.getElementById('soundtrackname').value;
  if (newname) {
    if (soundtrack.hasOwnProperty(newname)) {
      document.getElementById('controlwindow').innerHTML += "<p style='color:red'>Name already exists, choose another.</p>";
    } else {
      soundtrack[newname] = {};
      soundtrack[newname].shuffle = 1;
      soundtrack[newname].songs = [];
      soundtrack_edit(newname);
    }
  }
}

function soundtrack_delete(which) {
  delete soundtrack[which];
  edit_soundtrack();
}

function soundtrack_edit(which) {
  document.getElementById('controlwindow').innerHTML = "Soundtrack edit: " + which + "<br />Shuffle: ";
  if (soundtrack[which].shuffle) { document.getElementById('controlwindow').innerHTML += "<span style='font-weight:bold' onClick='toggle_shuffle(\""+which+"\")' id='shuffle_val'>[ON]</span>"; }
  else { document.getElementById('controlwindow').innerHTML += "<span style='font-weight:bold' onClick='toggle_shuffle(\""+which+"\")' id='shuffle_val'>[OFF]</span>"; }
  document.getElementById('controlwindow').innerHTML += "<br /><input type='button' onClick='add_song(\"" + which + "\")' value='Add Song' /><br /><br />";
  for (let i=0;i<soundtrack[which].songs.length;i++) {
    document.getElementById('controlwindow').innerHTML += i+1 + ") <img src='../ui/Square-Button-Delete.png' width='16' height='16' onClick='delete_song(\"" + which + "\"," + i + ")'  /> <img src='../ui/Square-Button-Settings.png' width='16' height='16' onClick='edit_song(\"" + which + "\"," + i + ")' /> " + soundtrack[which].songs[i].name + "<br />";
  }
  document.getElementById('controlwindow').innerHTML += "<input type='button' onClick='add_song(\"" + which + "\")' value='Add Song' />";
}

function edit_song(which,idx) {
  document.getElementById('controlwindow').innerHTML = "<h2>Edit Song:</h2><p>" + soundtrack[which].songs[idx].name + "</p>";
  if (!soundtrack[which].songs[idx].overridename) { soundtrack[which].songs[idx].overridename = ""; }
  if (!soundtrack[which].songs[idx].adjustvol) { soundtrack[which].songs[idx].adjustvol=0; }
  document.getElementById('controlwindow').innerHTML += "<p>Override name: <input type='text' name='overridename' id='overridename' size='20' value='" + soundtrack[which].songs[idx].overridename + "' /></p>";
  document.getElementById('controlwindow').innerHTML += "<p>Adjust volume by: <input type='text' name='adjustvol' id='adjustvol' size='20' value='" + soundtrack[which].songs[idx].adjustvol + "' /></p>";
  document.getElementById('controlwindow').innerHTML += "<p><input type='button' value='Save Changes' onClick='save_edit_song(\""+which+"\","+idx+")' /></p>";
}

function save_edit_song(which,idx) {
  soundtrack[which].songs[idx].overridename = document.getElementById('overridename').value;
  soundtrack[which].songs[idx].adjustvol = document.getElementById('adjustvol').value;

  soundtrack_edit(which);
}

function delete_song(which,idx) {
  soundtrack[which].songs.splice(idx,1);
  soundtrack_edit(which);
}

function add_song(which) {
  dialog.showOpenDialog({ properties: ['openFile','multiSelections'], filters: [{name: "Music", extensions: ['mp3','ogg','wav']}]}, function (fileNames) {
    if (fileNames === undefined) return;
    for (let i=0;i<fileNames.length;i++) {
      soundtrack[which].songs.push({name: fileNames[i]});
    }
    soundtrack_edit(which);
  });
}

function toggle_shuffle(which) {
  if (soundtrack[which].shuffle) { soundtrack[which].shuffle = 0; document.getElementById('shuffle_val').innerHTML = "[OFF]"; }
  else { soundtrack[which].shuffle = 1; document.getElementById('shuffle_val').innerHTML = "[ON]"; }
}

function add_combat_buttons() {
  let holder = `<table cellpadding='3' cellspacing='2' style='text-align:center'>
  <tr>
  <td><input type='button' value='Prev' onClick='prevCombatant()' /></td>
  <td><input type='button' value='Next' onClick='nextCombatant()' /></td>
  <td><input type='button' value='Victory' onClick='declareVictory()' /></td>
  </tr>
  </table>`;
  document.getElementById('combat_buttons').innerHTML = holder;
}

// WORKING HERE- change playlist choice here and in location edit to a dropdown of existing playlists
function change_playlist() {
//  document.getElementById('controlwindow').innerHTML = "<input type='text' size=20 name='newlist' id='newlist' /> <input type='button' value='submit' onClick='change_playlist_to()' /> <input type='button' value='cancel' onClick='reset_control_window()' />";
  let buckets = Object.keys(soundtrack);
  buckets.sort();
  document.getElementById('controlwindow').innerHTML = `<table cellpadding='3' cellspacing='2' style='text-align:center'>
  <tr>`;
  for (let i=0;i<buckets.length;i++) {
    document.getElementById('controlwindow').innerHTML += '<img src="../ui/Square-Button-Play.png" width="16" height="16" onClick="change_playlist_to(\'' + buckets[i] + '\')" title="Select" /> ' + buckets[i] + ' (' + soundtrack[buckets[i]].songs.length + ') <br />';
  }
  document.getElementById('controlwindow').innerHTML += "</tr></table><p>";

}

function reset_control_window() {
  if (menustate === "combat") { Create_Combat_Pane(); }
  else { document.getElementById("controlwindow").innerHTML = ""; }
}

function change_playlist_to(newlist) {
  update_soundtrack(newlist);
  reset_control_window()
}

function toggle_next_combat() {
  if (combattype === "Combat") { 
    combattype = "Boss Fight"; 
    document.getElementById('next_combat').src = '../ui/combat_next_boss.png';
  }
  else if (combattype === "Boss Fight") { 
    combattype = "Final Fight"; 
    document.getElementById('next_combat').src = '../ui/combat_next_final.png';
  }
  else { 
    combattype = "Combat"; 
    document.getElementById('next_combat').src = '../ui/combat_next_combat.png';
  }

  reset_control_window()
}


function display_song() {
  let song = currently_playing.data;
  jsmediatags.read(song.name, {
    onSuccess: function(tag) {
      let album = tag.tags.album;
      if (!album) { album = "Unknown"; }
      let songname = tag.tags.title;
      if (!songname) { songname = song.displayname; }
      if (song.overridename) { songname = song.overridename; }
      let playpause = "<span id='playbutton'><img src='../ui/Square-Button-Pause.png' width='24' height='24' onClick=\"pause_music('pause')\" /></span> <img src='../ui/Square-Button-Forward.png' width='24' height='24' onClick=\"skip_music('')\" />";
      if (currently_playing.paused) { playpause = "<span id='playbutton'><img src='../ui/Square-Button-Play.png' width='24' height='24' onClick=\"pause_music('play')\" /></span> "; }
      document.getElementById("musicbox").innerHTML = playpause + "Now playing: " + album + " - " + songname;
      ipcRenderer.send('musicbox', "Now playing: " + album + " - " + songname);
    },
    onError: function(error) {
      console.log(':(', error.type, error.info);
    }
  });
}

function pause_music(toggle) {
  if (toggle === "pause") { 
    currently_playing.song.pause();
    document.getElementById("playbutton").innerHTML = "<img src='../ui/Square-Button-Play.png' width='24' height='24' onClick=\"pause_music('play')\" />";
  }
  else { 
    currently_playing.song.play();
    document.getElementById("playbutton").innerHTML = "<img src='../ui/Square-Button-Pause.png' width='24' height='24' onClick=\"pause_music('pause')\" />";
  }
} 

function skip_music() {
  PlayNextSong(1);
}

function next_combat(type) {
  combattype = type;
}

function add_combatant() {
  ack_keyboard = 0;
  document.getElementById("controlwindow").innerHTML = `		<form name='add_manually'>
  <table cellpadding='0' cellspacing='0' border='0'><tr><td style='vertical-align:top'>
  <p>Enter combatant values:<br/>
  Name: <input type='text' name='com_name' size='15' /><br />
  Align: <select name='com_align'><option value='enemy'>Enemy</option><option value='friendly'>Friendly</option>
                                <option value='neutral'>Neutral</option></select><br />
  Initmod: <img src='../buttons/Square-Button-Minus.png' onclick='modMod(-1)' width='32' height='32' /> <input type='text' name='com_initmod' size='2' /> <img src='../buttons/Square-Button-Plus.png' onclick='modMod(1)' width='32' height='32' /><br />
  Init: <input type='text' name='com_init' size='2' /> <input type='button' onClick='addRollInit("roll")' value='Roll' />
   <input type='button' onClick='addRollInit("end")' value='End' /> <input type='button' onClick='addRollInit("start")' value='Start' /> 
               <input type='button' onClick='addRollInit("next")' value='Next' />
  <br />
  Armor class: <input type='text' name='com_ac' size='2' /><br />
  Hit points: <input type='text' name='com_hp' size='2' /><br />
  Icon: <img src='../icons/Other/NecromancerIcons_02_b.png' width='32' height='32' id='com_icon_pic' onClick='submitAddManual("icon");' /><br />
  Number to add: <input type='text' name='com_addnum' size='2' />
  <input type='hidden' value='Other/NecromancerIcons_02_b.png' name='com_icon' /></p>
  </td>
  <td id='icontd' style='vertical-align:top'></td></tr></table>
  <p><input type='button' value='Add to Battle' onClick='submitAddManual("add");'  />
    <input type='button' value='Select Presets' onClick='submitAddManual("preset");'  />
    <input type='button' value='Done' onClick='Create_Combat_Pane();'  /></p>
</form>`;

}

function modMod(how) {
  how = parseInt(how);
  if (!document.add_manually.com_initmod.value) { add_manually.com_initmod.value = 0; }
  document.add_manually.com_initmod.value = parseInt(add_manually.com_initmod.value) + how;
}

function addRollInit(val) {
  var the_form = document.add_manually;
  the_form.com_init.value = val;	
}

function MakeIconPane(onclicktarget) {
  if (!onclicktarget) { onclicktarget = "select_icon";}
  let icontable = '<table cellpadding="0" cellspacing="0" border="0"><tr>';
//  let curri = 0;
  for (let i=0;i<icondirs.length;i++) {
    icontable += "<td><img src='../buttons/tab-left.png' /></td>";
    icontable += `<td style='color:#f1d78d;background-image:url("../buttons/tab-center.png");background-repeat:repeat-x' onClick='ChangeIconTab("${icondirs[i]}", "${onclicktarget}")')>${icondirs[i]}</td>`;
    icontable += "<td><img src='../buttons/tab-right.png' /></td>";
//    if (icondirs[i] === icontab) { curri = i; }
  }
  icontable += '<table cellpadding="3" cellspacing="0" border="0">';
  for (let i=0;i < iconlist[icontab].length; i++) {
    icontable = icontable + "<tr>";
    for (let j=0;j < 12; j++) {
      if (i+j < iconlist[icontab].length) {
        let icon = iconlist[icontab][i+j];
        icontable = icontable + `<td onClick='${onclicktarget}("${icontab}/${icon}")'><img src='../icons/${icontab}/${icon}'  width='32' height='32' /></td>`;
      }
    }
    i += 11;
    icontable = icontable + "</tr>";
  }
  icontable = icontable + "</table>";
  return icontable;
}

function ChangeIconTab(changeTo, paneTarget) {
  icontab = changeTo;
  let icontable = MakeIconPane(paneTarget);
  document.getElementById('icontd').innerHTML = icontable;
}

function submitAddManual(which) {
	if (which === "preset") { 
    let presetlist = Object.keys(preset_groups);
    presetlist.sort();
    let showpresets = "";
    for (let i=0;i<presetlist.length;i++) {
      showpresets += "<img src='../icons/" + preset_groups[presetlist[i]].icon + "' onClick='submitAddCombatant(\"" + presetlist[i] + "\")' width='32' height='32' /> " + presetlist[i] + "<br />";
    }
    document.getElementById("controlwindow").innerHTML = showpresets;
  }  else if (which === "icon") {
    let icontable = MakeIconPane();
    document.getElementById('icontd').innerHTML = icontable;
  } else if (which === "add")  {
    let the_form = document.add_manually;
    let reps = parseInt(the_form.com_addnum.value);
    if (isNaN(reps)) { reps = 1; }
    if (reps < 1) { return 0; }
    let newguy = new Entity;
    if (!the_form.com_name.value) {
      the_form.com_name.value = prompt("Need a name:", "");  
      if (!the_form.com_name.value) {
        return 0;
      }
    }
    newguy.name = the_form.com_name.value;
    newguy.displayname = newguy.name;
    newguy.displayname = newguy.displayname.replace(/\(/g, "&lpar;");
    newguy.displayname = newguy.displayname.replace(/\)/g, "&rpar;");
    newguy.name = newguy.name.replace(/ /g,"_");
    newguy.name = newguy.name.replace(/\(/g, "lpar");
    newguy.name = newguy.name.replace(/\)/g, "rpar");
 
    for (let i=0; i < the_form.com_align.length; i++) {
      if (the_form.com_align.options[i].selected) {
        newguy.align = the_form.com_align.options[i].value;
      }
    }
    if (the_form.com_initmod.value) {
      newguy.initmod = parseInt(the_form.com_initmod.value);
      newguy.tiebreaker = newguy.initmod;
    } else {
      newguy.initmod = 0;
      newguy.tiebreaker = newguy.initmod;
    }
    newguy.init = the_form.com_init.value;
    if (the_form.com_ac.value) { newguy.armorclass = the_form.com_ac.value; }
    if (the_form.com_hp.value) { newguy.hitpoints = the_form.com_hp.value; }
    if (the_form.com_icon.value) {
      newguy.icon = the_form.com_icon.value;
    }
    Create_Combat_Pane();
    for (let i=0;i<reps;i++) {
      let tmpguy = new Entity;
      tmpguy.clone(newguy);
      add_char(tmpguy);
    }

    add_combatant();
    ack_keyboard = 1;
    update_display();
  }
}

function select_icon(new_icon) {
  let the_form=document.add_manually;
  the_form.com_icon.value = new_icon;
  document.getElementById('com_icon_pic').src = "../icons/" + new_icon;
  document.getElementById('icontd').innerHTML = "";
}

function open_prefs() {

  document.getElementById('controlwindow').innerHTML = `<form name="preferences">
  <p>Initiative Tracker Preferences:</p>
  <table cellpadding="0" cellspacing="0" border="0">
    <tr>
      <td colspan="2" style="font-weight:bold">House Rules</td>
    </tr>
    <tr>
      <td>PCs Win Ties:</td>
      <td><input type="radio" name="pcsWinTies" value="0"> No 
        <input type="radio" name="pcsWinTies" value="1"> Yes</td>
    </tr>
    <tr>
      <td colspan="2" style="font-weight:bold">Display</td>
    </tr>
    <tr>
      <td>Bold Text:</td>
      <td><input type="radio" name="boldText" value="0"> None
        <input type="radio" name="boldText" value="1"> All
        <input type="radio" name="boldText" value="2"> Active
      </td>
    </tr>
    <tr>
      <td>Death Sound:</td>
      <td><input type="radio" name="deathSound" value="0"> None
        <input type="radio" name="deathSound" value="1"> Explosion
      </td>
    </tr>
    <tr>
      <td colspan="2" style="font-weight:bold">Debug</td>
    </tr>
    <tr>
      <td>Show Tiebreakers:</td>
      <td><input type="radio" name="showTiebreaker" value="0"> No
      <input type="radio" name="showTiebreaker" value="1"> Yes</td>
    </tr>
  </table>
  <input type="submit" value="Submit" onClick="submitPrefs(1);" class="jqmClose" />
  </form>`;

  let the_form = document.preferences;
  setCheckedValue(the_form.pcsWinTies, myprefs.pcswinties);
  setCheckedValue(the_form.boldText, myprefs.boldtext);
  setCheckedValue(the_form.showTiebreaker, myprefs.showtiebreaker);
  setCheckedValue(the_form.deathSound, myprefs.deathsound);
}

function edit_presets() {  
  let presetlist;
  let showpresets;
  presetlist = Object.keys(preset_groups);
  presetlist.sort();

  if (presetlist.length > 0) {
    showpresets = "<input type='button' onClick='editGroup();' value='Add' /><br /><table cellpadding='1' cellspacing='1' border='1'>";
    for (let i=0;i<presetlist.length;i++) {
      showpresets += "<tr><td><img src='../icons/" + preset_groups[presetlist[i]].icon + "' onClick='submitAddCombatant(\"" + presetlist[i] + "\")'  width='32' height='32' /> " + presetlist[i] + " (" + preset_groups[presetlist[i]].data.length + ")</td>";
      showpresets += "<td><input type='button' value='EDIT' onclick='editGroup(\"" + presetlist[i] + "\")' /></td><td><input type='button' value='DEL' onclick='deleteGroup(\"" + presetlist[i] + "\")' /></td></tr>";
    }
  } else { showpresets = "No preset groups.<br />"; }
  showpresets += "</table><input type='button' onClick='editGroup();' value='Add' /><br /><br />"
  document.getElementById("controlwindow").innerHTML = showpresets;
}

function deleteGroup(groupname) {
  delete preset_groups[groupname];
  edit_presets();
}


function editGroup(groupname) {
  currently_editing = groupname;
  tempeditgroup = {};
  tempeditgroup.icon = "Badge/Tex_badge_26.PNG";
  tempeditgroup.data = [];
  if (!groupname) {
    let nameprompt = "<form name='groupname'>Group name: <input name='inputname' id='inputname' type='text' size='15' /></form><br />";
    nameprompt += "<input type='button' value='Submit Name' onClick='editGroup1()' />";
    document.getElementById('controlwindow').innerHTML = nameprompt;
  } else {
    tempeditgroup.icon = preset_groups[groupname].icon;
    for (let i=0;i<preset_groups[groupname].data.length;i++) {
      tempeditgroup.data[i] = new Entity;
      tempeditgroup.data[i].clone(preset_groups[groupname].data[i]);
    }
    editGroup2(currently_editing);
  }
}

function editGroup1() {
  if (document.getElementById('inputname').value) {
    if (preset_groups.hasOwnProperty(document.getElementById('inputname').value)) {
      document.getElementById('controlwindow').innerHTML += "<br /><span style='color:red'>A group already exists with that name.</span>";
    } else {
      currently_editing = document.getElementById('inputname').value;
      editGroup2();
    }
  }
}

function editGroup2(groupname) {
  let newscreen = "";
  newscreen += "<form name='groupform' id='groupform'><img src='../icons/"+tempeditgroup.icon+"' width='32' height='32' id='groupicon' /> <b>"+currently_editing+"</b><br />";
  newscreen += "<table id='grouptable' cellspacing='1' cellpadding='1' border='1'>";
  newscreen += "<tr><th></th><th>Name</th><th>Initmod</th><th>AC</th><th>HP</th><th>Align</th><th></th></tr>";
  for (let i=0;i<tempeditgroup.data.length;i++) {
    newscreen += "<tr><td><img src='../icons/" + tempeditgroup.data[i].icon + "' width='16' height='16' /></td>";
    newscreen += "<td>" + tempeditgroup.data[i].name + "</td>";
    newscreen += "<td>" + tempeditgroup.data[i].initmod + "</td>";
    newscreen += "<td>" + tempeditgroup.data[i].armorclass + "</td>";
    newscreen += "<td>" + tempeditgroup.data[i].hitpoints + "</td>";
    newscreen += "<td>" + tempeditgroup.data[i].align + "</td>";
    newscreen += "<td><input type='button' value='Edit' onClick='editGroupMember(" +i+ ",\""+ groupname + "\")' /> <input type='button' value='Delete' onClick='deleteGroupMember(" +i+ ",\""+ groupname + "\")' /></td></tr>";
  }
  newscreen += "</table><input type='button' value='Add Group Member' onClick='editGroupMember(-1,\""+groupname+"\")' /><input type='button' value='Save Group' onClick='saveGroup()' /><input type='button' value='Cancel' onClick='cancelSaveGroup()' /></form>";
  newscreen += "<p>Change icon:</p><div id='icontd'>";
  newscreen += MakeIconPane("groupIcon");
  newscreen += "</div>";
  document.getElementById("controlwindow").innerHTML = newscreen;
}

function groupIcon(idx) {
  document.getElementById('groupicon').src = "../icons/" + idx;
  tempeditgroup.icon = idx;
}

function deleteGroupMember(which) {
  tempeditgroup.data.splice(which,1);
  editGroup2(currently_editing);
}

function editGroupMember(which) {
  let icon = "Badge/Tex_badge_26.PNG";
  let ename = "";
  let einitmod = 0;
  let ealign = "enemy";
  let eac = 0;
  let ehp = 0;
  if (which > -1) { 
    icon = tempeditgroup.data[which].icon; 
    ename = tempeditgroup.data[which].name;
    einitmod = tempeditgroup.data[which].initmod;
    ealign = tempeditgroup.data[which].align;
    eac = tempeditgroup.data[which].armorclass;
    ehp = tempeditgroup.data[which].hitpoints;
  }
  let newscreen = "<form id='groupentity'><img src='../icons/"+icon+"' width='32' height='32' id='entityicon' /><br />";
  newscreen += "<table cellpadding='0' cellspacing='2' border='0'><tr><td style='vertical-align:top'>";
  newscreen += "Name: <input name='formname' type='text' size='16' value='"+ename+"' /><br />";
  newscreen += "Init Mod: <img src='../buttons/Square-Button-Minus.png' onclick='modEditMod(-1)' width='32' height='32' /> <input name='forminit' id='forminit' type='text' size='2' value='"+einitmod+"' /> <img src='../buttons/Square-Button-Plus.png' onclick='modEditMod(1)' width='32' height='32' /><br />";
  newscreen += "Armor Class: <input name='formac' type='text' size='2' value='"+eac+"' /><br />";
  newscreen += "Hit Points: <input name='formhp' type='text' size='2' value='"+ehp+"' /><br />";
  newscreen += "Align: <select name='formalign'>";
  if (ealign === "friendly") { newscreen += "<option value='friendly' selected='selected'>Friendly</option>"; }
  else { newscreen += "<option value='friendly'>Friendly</option>"; }
  if (ealign === "neutral") { newscreen += "<option value='neutral' selected='selected'>Neutral</option>"; }
  else { newscreen += "<option value='neutral'>Neutral</option>"; }
  if (ealign === "enemy") { newscreen += "<option value='enemy' selected='selected'>Enemy</option>"; }
  else { newscreen += "<option value='enemy'>Enemy</option>"; }
  newscreen += "</select><br />";
  newscreen += "Quant: <input name='formquant' type='text' size='2' /><br />";
  newscreen += "<input type='hidden' id='iconpath' value="+icon+" />"
  newscreen += "<input type='button' onClick='submitGroupMember("+which+")' value='Submit' /> <input type='button' onClick='editGroup2(\""+currently_editing+"\")' value='Cancel' /></td>";
  newscreen += "<td style='vertical-align:top'>Change icon:<div id='icontd'>";
  newscreen += MakeIconPane('changeMemberIcon');
  newscreen += "</div></td></tr></table>";
  document.getElementById("controlwindow").innerHTML = newscreen;
}

function modEditMod(how) {
  how = parseInt(how);
  if (!document.groupentity.forminit.value) { document.groupentity.forminit.value = 0; }
  document.groupentity.forminit.value = parseInt(document.groupentity.forminit.value) + how;
}

function changeMemberIcon(idx) {
  document.getElementById('entityicon').src="../icons/"+idx;
  document.getElementById('iconpath').value=idx;
}

function submitGroupMember(which) {
  let theform = document.getElementById('groupentity');
  let q = 1;
  if (parseInt(theform.formquant.value) && (which === -1)) { q = parseInt(theform.formquant.value); }
  for (let i=1;i<=q;i++) {
    let newmember = new Entity;
    newmember.icon = document.getElementById('iconpath').value;
//    newmember.icon = newmember.icon.replace(/^.*\//, "");
  
    newmember.name = theform.formname.value;
    newmember.initmod = theform.forminit.value;
    newmember.align = theform.formalign.value;
    newmember.armorclass = theform.formac.value;
    newmember.hitpoints = theform.formhp.value;
    if (which === -1) {
      tempeditgroup.data.push(newmember);
    } else {
      tempeditgroup.data[which] = newmember;
    }
  }

  editGroup2(currently_editing);
}

function saveGroup() {
  preset_groups[currently_editing] = tempeditgroup;
  tempeditgroup = {};
  edit_presets();
}

function cancelSaveGroup() {
  tempeditgroup = {};
  edit_presets();
}

function submitAddCombatant(groupname) {
  Create_Combat_Pane();
  for (let i=0;i<preset_groups[groupname].data.length;i++) {
    add_char(preset_groups[groupname].data[i]);
  }
  add_combatant();
  update_display();
}

function submitPrefs(val) {
	let the_form = document.preferences;
	let new_boldtext = getCheckedValue(the_form.boldText);
	let new_pcswinties = getCheckedValue(the_form.pcsWinTies);
	let new_showtiebreaker = getCheckedValue(the_form.showTiebreaker);
	let new_deathsound = getCheckedValue(the_form.deathSound);
	let new_victorysound = getCheckedValue(the_form.victorySound);
	
	myprefs.boldtext = new_boldtext;
	myprefs.pcswinties = new_pcswinties;
	myprefs.showtiebreaker = new_showtiebreaker;
	myprefs.deathsound = new_deathsound;
	myprefs.victorysound = new_victorysound;
	
	let saveval = new_boldtext + "," + new_pcswinties + "," + new_showtiebreaker + "," + new_deathsound + "," + new_victorysound;

  localStorage.setItem("preferences", saveval);
}

function toggle_combat() {
  Create_Combat_Pane();
  toggle_display_combat();
  if (state !== "combat") {
    state = "combat";

    if (soundtrack.hasOwnProperty(combattype)) {
      let newsnd = soundtrack[combattype].songs.slice();
      newsnd = ShuffleArray(newsnd);
      backup_playlist = playlist;
      playlist = newsnd;
      if (soundtrack.hasOwnProperty(`${combattype} Intro`)) {
        let intro = soundtrack[combattype + " Intro"].songs.slice();
        for (let i=intro.length-1;i>=0;i--) {
          playlist.unshift(intro[i]);
        }
      }
      CueNextSong();
      PlayNextSong(1);
    }
    ack_keyboard = 1;
  } else {
    state = "peace";
    playlist = backup_playlist;
    document.getElementById("controlwindow").innerHTML = "";
    ack_keyboard = 0;
    clear_combatants();
  }
  reset_control_window();
  update_display();
}

function Create_Combat_Pane() {
  document.getElementById("controlwindow").innerHTML = `    <div id="header">
  <table cellpadding="1" cellspacing="1">
    <tr><td id="location"></td><td id="combat_buttons"></td><td id="round_number" ondblclick="set_round_num()"></td></tr>
  </table>
  </div>
  <div id="initiative">
  </div>  `;

  if (combatants.length) { drawTable(); }
  if (state === "combat") { 
    add_combat_buttons();
    document.getElementById('round_number').innerHTML = "Round<br />" + round;
		document.getElementById('round_number').style.backgroundColor = "white";
  }
}

function set_round_num(){
  let input = document.getElementById("round_number").innerHTML = "<input type='text' size='2' id='tmprnd' value='" + round + "' onBlur='process_round_num()' />";
  document.getElementById("tmprnd").focus();
  document.getElementById("tmprnd").select();
  ack_keyboard = 0;
}

function process_round_num() {
  let newrnd = document.getElementById("tmprnd").value;
  if (!isNaN(newrnd)) {
    round = parseInt(newrnd);
  } 
  document.getElementById('round_number').innerHTML = "Round<br />" + round;
  update_display();
  ack_keyboard = 1;
}

function declareVictory() {
  playlist = [];
  playlist = backup_playlist;
  backup_playlist = [];
  if (soundtrack.hasOwnProperty("Victory")) {
    let tmpplaylist = soundtrack["Victory"].songs.slice();
    tmpplaylist = ShuffleArray(tmpplaylist);
    playlist.unshift(tmpplaylist[0]);
  }
  CueNextSong();
  PlayNextSong(1);
  
  state = "peace";
  document.getElementById("controlwindow").innerHTML = "";

  clear_combatants();
  reset_control_window();
}

// return the value of the radio button that is checked
// return an empty string if none are checked, or
// there are no radio buttons
function getCheckedValue(radioObj) {
	if(!radioObj)
		return "";
	let radioLength = radioObj.length;
	if(radioLength === undefined)
		if(radioObj.checked)
			return radioObj.value;
		else
			return "";
	for(let i = 0; i < radioLength; i++) {
		if(radioObj[i].checked) {
			return radioObj[i].value;
		}
	}
	return "";
}

// set the radio button with the given value as being checked
// do nothing if there are no radio buttons
// if the given value does not exist, all the radio buttons
// are reset to unchecked
function setCheckedValue(radioObj, newValue) {
	if(!radioObj)
		return;
	let radioLength = radioObj.length;
	if(radioLength === undefined) {
		radioObj.checked = (radioObj.value == newValue.toString());
		return;
	}
	for(let i = 0; i < radioLength; i++) {
		radioObj[i].checked = false;
		if(radioObj[i].value === newValue.toString()) {
			radioObj[i].checked = true;
		}
	}
}

function change_background() {
  dialog.showOpenDialog({ properties: ['openFile'], filters: [{name: "Images", extensions: ['jpg','gif','png']}]}, function (fileNames) {
    if (fileNames === undefined) return;

    let fileName = fileNames[0];
    fileName = fileName.replace(/\\/g,"/");
    ipcRenderer.send('change_bg', fileName);
  }); 
}

function change_location_txt() {
  let tmphold = "<input type='text' size='20' name='locname' id='locname' /> <input type='button' value='Send' onClick='send_change_loc_txt()' /> <input type='button' value='Send' onClick='cancel_loc_txt()' /> ";
  document.getElementById('controlwindow').innerHTML = tmphold;
}

function cancel_loc_txt() {
  document.getElementById('controlwindow').innerHTML = "";
}

function send_change_loc_txt() {
  let newloc = document.getElementById('locname').value;
  ipcRenderer.send('change_location', newloc);
  document.getElementById('controlwindow').innerHTML = "";
}

function change_location() {
  let tmphold = "<form name='changeloc' id='changeloc'><select name='newloc' id='newloc'>";
  let loclist = Object.keys(locations);
  for (let i=0;i<loclist.length;i++) {
    tmphold += "<option value='" + loclist[i] + "'>" + loclist[i] + "</option>";
  }
  tmphold += "</select><input type='button' value='Submit' onClick='change_loc_to()' /> <input type='button' value='Cancel' onClick='reset_control_window()' /></form>";
  document.getElementById('controlwindow').innerHTML = tmphold;
}

function change_loc_to() {
  let sel = document.getElementById("newloc");
  let newloc = sel.options[sel.selectedIndex].value;

  current_location = newloc;

  if (locations[newloc].background) { ipcRenderer.send('change_bg', locations[newloc].background); }

  update_soundtrack(locations[newloc]);
  document.getElementById('controlwindow').innerHTML = "";
  ipcRenderer.send('change_location', newloc);
}

function update_soundtrack(newloc) {
  playlist = [];
  if (newloc.introSoundtrack && soundtrack.hasOwnProperty(newloc.introSoundtrack)) {
    if (soundtrack[newloc.introSoundtrack].shuffle) {
      let newsnd = soundtrack[newloc.introSoundtrack].songs.slice();
      playlist = ShuffleArray(newsnd);
    } else {
      playlist = soundtrack[newloc.introSoundtrack].songs.slice();
    }
  }

  if (newloc.soundtrack && soundtrack.hasOwnProperty(newloc.sountrack)) {
    if (soundtrack[newloc.soundtrack].shuffle) {
//      console.log(soundtrack[newloc.soundtrack].songs);
      let newsnd = soundtrack[newloc.soundtrack].songs.slice();
//      console.log(newsnd);
      newsnd = ShuffleArray(newsnd);
//      console.log(newsnd);
      playlist = playlist.concat(newsnd);
    } else {
      let newsnd = soundtrack[newloc.soundtrack].songs.slice();
      playlist = playlist.concat(newsnd);
    }
  }

  CueNextSong();
  PlayNextSong(1);
}

function ShowNotes() {
  let notefield = `<textarea id='notefield' cols='75' rows='25'>${notes}</textarea><br /><input type='button' id='savebutton' value='Save' onClick='SaveNotes()' />`
  document.getElementById('controlwindow').innerHTML = notefield;
}

function SaveNotes() {
  notes = document.getElementById('notefield').value;
}


function update_display() {
  if (state === "combat") {
    ipcRenderer.send('init_table', document.getElementById('initiative').innerHTML);
    ipcRenderer.send('statblock', CreateStatBlock());
    ipcRenderer.send('set_round', round);
  } else {
    ipcRenderer.send('init_table', "");
    ipcRenderer.send('statblock', "");
    ipcRenderer.send('set_round', 0);
  }
}

// more stackoverflow: http://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array#
function ShuffleArray(arr) {
  var currentIndex = arr.length, temporaryValue, randomIndex ;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = arr[currentIndex];
    arr[currentIndex] = arr[randomIndex];
    arr[randomIndex] = temporaryValue;
  }

  return arr;
}

ipcRenderer.on('load', function(event) {
  load_campaign();
});

ipcRenderer.on('save', function(event) {
  save_campaign()
});

ipcRenderer.on('new', function(event) {
  new_campaign();
});

