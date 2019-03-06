"use strict";

const {ipcRenderer} = require('electron')

ipcRenderer.on('change_bg', function(event, changeto) {
  document.getElementById('bgfg').innerHTML = "<div style='position:relative;height:100%;width:100%'><img src='" + changeto + "' style='position:absolute;top:0px;bottom:0px;left:0px;right:0px;margin:auto;height:100%;width:100%;object-fit:contain' /></div>";
});
  
ipcRenderer.on('change_location', function(event, newloc) {
  change_location(newloc);
});

function change_location(where) {
  document.getElementById('location').innerHTML = "<h1 style='background-color:white'>"+where+"</h1>";
}

ipcRenderer.on('reset_size', function(event) {
  window.resizeTo(1200,800);
});

ipcRenderer.on('init_table', function(event, inittable) {
  if (inittable) {
    document.getElementById('initiative').innerHTML = `<center>${inittable}</center>`;
    document.getElementById('inittable').style.fontSize = "x-large";
  } else {
    document.getElementById('initiative').innerHTML = "";
  }
});

ipcRenderer.on('set_round', function(event, roundnum) {
  if (roundnum) {
    document.getElementById('round_number').innerHTML = "Round<br />" + roundnum;
    document.getElementById('round_number').style.backgroundColor = "white";
  } else {
    document.getElementById('round_number').innerHTML = "";
  }
});

ipcRenderer.on('statblock', function(event, stats) {
  if (stats) {
    document.getElementById('statblock').innerHTML = `${stats}`;
    document.getElementById('statblocktable').style.fontSize = "large";
  } else {
    document.getElementById('statblock').innerHTML = "";
  }
});
