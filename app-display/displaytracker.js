"use strict";

const {ipcRenderer} = require('electron')

function Prefs() {
	this.showtiebreaker = 0;
	this.pcswinties = 0;
	this.boldtext = 0;
	this.deathsound = 1;
	this.victorysound = 8;
}

let combatants = [];
let in_combat = 0;
let display = [];
let nameshash = [];
let current_turn = 0;
let round=1;
let myprefs = new Prefs();

ipcRenderer.on('add_char', function(event, char) {
  if (char.init === "roll") {
    char.init = Math.floor(Math.random()*20)+1  + char.initmod;
    char.setinit = 1;
  }
  else if (char.init === "start") {
    if (combatants.length > 0) {
      char.init = combatants[0].init +1;
      char.setinit = 1;
    }
    else {char.init = 0; char.setinit = 1; }
  }
  else if (char.init === "end") {
    if (combatants.length > 0) {
      char.init = combatants[combatants.length-1].init - 1;
      char.setinit = 1;
    }
    else { char.init = 0; char.setinit = 1;}
  }
  else {
    char.init = parseInt(char.init);
    if (isNaN(char.init)) { char.init = 0; }
    else {char.setinit = 1; }
  }

	char.index = 1;
	char.initmod = parseInt(char.initmod);
	set_index(char);
	if (!char.displayname) { char.displayname = char.name; }
  combatants[combatants.length] = char;
  add_to_bottom(combatants[combatants.length-1]);
  if (in_combat === 1) {
    sort_combatants();
  }

});

ipcRenderer.on('send_prefs', function(event, prefs) {
  myprefs = prefs;
});

ipcRenderer.on('change_state', function(event, state) {
  changestate(combatants[current_turn].name, combatants[current_turn].index, state);
});

ipcRenderer.on('set_round_nbr', function(event, nbr) {
  document.getElementById('round_number').innerHTML = nbr;
  round = nbr;
});

ipcRenderer.on('roll_init', function(event, who) {
  roll_initiative(who);
});

ipcRenderer.on('toggle_combat', function(event) {
  toggle_combat();
});

ipcRenderer.on('next_combatant', function(event) {
  nextCombatant();
});

ipcRenderer.on('prev_combatant', function(event) {
  prevCombatant();
});

ipcRenderer.on('declare_victory', function(event) {
  declareVictory();
});

ipcRenderer.on('clear_combat', function(event) {
	clear_combatants();
});

ipcRenderer.on('sort', function(event) {
  sort_combatants();
});

ipcRenderer.on('change_bg', function(event, changeto) {
//  document.getElementById('bg').style.backgroundImage = "url('" + changeto + "')";
  document.getElementById('bgfg').innerHTML = "<div style='position:relative;height:100%;width:100%'><img src='" + changeto + "' style='position:absolute;top:0px;bottom:0px;left:0px;right:0px;margin:auto;height:100%;width:100%;object-fit:contain' /></div>";
});

ipcRenderer.on('change_location', function(event, newloc) {
	change_location(newloc);
});

ipcRenderer.on('reset_size', function(event) {
  window.resizeTo(1200,800);
});

function change_location(where) {
  document.getElementById('location').innerHTML = "<h1 style='background-color:white'>"+where+"</h1>";
}

function sort_combatants() {
	var current_dude;
	if (in_combat) {
		current_dude = combatants[current_turn];
	}
	combatants.sort(sortByInit);
	for (let i = 1; i < combatants.length; i++) {
		if ((combatants[i].init === combatants[i-1].init) && (combatants[i].tiebreaker >= combatants[i-1].tiebreaker)) {
			combatants[i].tiebreaker = combatants[i-1].tiebreaker - .01;
		}
	}
	if (in_combat) {
		setCurrentTurn(current_dude);
	}
  drawTable();
}

function sortByInit(a, b) {
	if (a.init > b.init) { return -1; }
	if (a.init < b.init) { return 1; }
	if (myprefs.pcswinties === 1) {
		if ((a.align === "friendly") && (a.goneyet === 0) && (b.align !== "friendly") && (b.goneyet === 0)) { return -1; }
		if ((a.align !== "friendly") && (a.goneyet === 0) && (b.align === "friendly") && (b.goneyet === 0)) { return 1;}
	}
	if (a.tiebreaker > b.tiebreaker) { return -1; }
	if (a.tiebreaker < b.tiebreaker) { return 1; }
	var ran = Math.floor(Math.random()*2)+1;
	if (ran === 1) { return -1; }
	return 1;
}

function set_index(dude) {
	if (nameshash[dude.name]) {
		dude.index = nameshash[dude.name] + 1;
		nameshash[dude.name] = dude.index;
	}
	else {
		nameshash[dude.name] = 1;
	}
}

function look_for_name(new_name) {
	if (combatants.length === 0) {return -1; }
	for (let i=0;i < combatants.length; i++) {
		if ((new_name.name === combatants[i].name) && (new_name.index === combatants[i].index)) { return i; }
	}
	return -1;
}

function make_row(person) {
	let row = "<tr id='" + person.name + "_" + person.index + "_row'>";
	let r_d_icon = "";
	if (person.ready === 1) { r_d_icon = "<img src='../buttons/red-ready.gif' onclick='changestate(\""+ person.name + "\", \"" + person.index + "\", \"unready\")' />"; }
	if (person.delay === 1) { r_d_icon = "<img src='../buttons/red-delay.gif' onclick='changestate(\""+ person.name + "\", \"" + person.index + "\", \"undelay\")' />"; }
	row = row + "<td class='turnmarker' id='" + person.name + "_" + person.index + "_turnmarker' width='32'>" + r_d_icon + "</td>";
	row = row + "<td class='rowicon' id='" + person.name + "_" + person.index + "_rowicon'><img src='../icons/" + person.icon + "' width='32' height='32'/ ></td>";
	row = row + "<td class='rowinit_" + person.align + "' ondblclick=\"getInput('"+ person.name +"', '" + person.index + "', 'init')\" id='" + person.name + "_" + person.index + "_rowinit'>" + person.init + " (" + person.initmod + ")";
	if (myprefs.showtiebreaker === 1) { row = row + " [" + person.tiebreaker + "]"; }
	row = row + "</td>";
	
	let ind = "";
	if ((person.index) && (nameshash[person.name] > 1)) { ind = person.index; }
	let myname = person.name;
	if (person.displayname) { myname = person.displayname; }
	row = row + "<td class='rowname_" + person.align + "' id='" + person.name + "_" + person.index + "_rowname' ondblclick=\"getInput('"+ person.name +"', '" + person.index + "', 'displayname')\"> " + person.displayname + " " + ind + "</td>";
	var stat1 = "";
	var statdur1 = "";
	if (person.stat1) { 
		stat1 = person.stat1; 
		statdur1 = "<table cellpadding='0' cellspacing='0' border='0'><tr><td>" + person.statdur1 + "</td><td>";
		if (person.statdur1 !== "-") {
		  statdur1 = statdur1 + "&nbsp;<img src='../buttons/button-down.gif' width='14' height='14' onClick=\"reduceDur('" + person.name + "', '" + person.index + "', 1)\" />";
	  }
		statdur1 = statdur1 + "&nbsp;<img src='../buttons/button-X.gif' width='18' height='18' onClick=\"removeStatus('" + person.name + "', '" + person.index + "', 1)\" /></td></tr></table>";
	}
	var stat2 = "";
	var statdur2 = "";
	if (person.stat2) { 
		stat2 = person.stat2;
		statdur2 = "<table cellpadding='0' cellspacing='0' border='0'><tr><td>" + person.statdur2 + "</td><td>";
		if (person.statdur2 !== "-") {
		  statdur2 = statdur2+ "&nbsp;<img src='../buttons/button-down.gif' width='14' height='14' onClick='reduceDur(\"" + person.name + "\", \"" + person.index + "\", 2)' />";
		}
		statdur2 = statdur2 + "&nbsp;<img src='../buttons/button-X.gif' width='18' height='18' onClick='removeStatus(\"" + person.name + "\", \"" + person.index + "\", 2)' /></td></tr></table>";
	}
	var stat3 = "";
	var statdur3 = "";
	if (person.stat3) { 
		stat3 = person.stat3; 
		statdur3 = "<table cellpadding='0' cellspacing='0' border='0'><tr><td>" + person.statdur3 + "</td><td>";
		if (person.statdur3 !== "-") {
		  statdur3 = statdur3 + "&nbsp;<img src='../buttons/button-down.gif' width='14' height='14' onClick='reduceDur(\"" + person.name + "\", \"" + person.index + "\", 3)' />";
		}
		statdur3 = statdur3 + "&nbsp;<img src='../buttons/button-X.gif' width='18' height='18' onClick='removeStatus(\"" + person.name + "\", \"" + person.index + "\", 3)' /></td></tr></table>";
	}
	row = row + "<td width='100' class='rowstatus_" + person.align + "' id='" + person.name + "_" + person.index + "_rowstat1' ondblclick=\"getInput('"+ person.name +"', '" + person.index + "', 'stat1')\">" + stat1 + "</td>";
	row = row + "<td width='20' class='rowstatdur_" + person.align + "' id='" + person.name + "_" + person.index + "_rowstatdur1' >" + statdur1 + "</td>";
	row = row + "<td width='100' class='rowstatus_" + person.align + "' id='" + person.name + "_" + person.index + "_rowstat2' ondblclick=\"getInput('"+ person.name +"', '" + person.index + "', 'stat2')\">" + stat2 + "</td>";
	row = row + "<td width='20' class='rowstatdur_" + person.align + "' id='" + person.name + "_" + person.index + "_rowstatdur2' >" + statdur2 + "</td>";
	row = row + "<td width='100' class='rowstatus_" + person.align + "' id='" + person.name + "_" + person.index + "_rowstat3' ondblclick=\"getInput('"+ person.name +"', '" + person.index + "', 'stat3')\">" + stat3 + "</td>";
	row = row + "<td width='20' class='rowstatdur_" + person.align + "' id='" + person.name + "_" + person.index + "_rowstatdur3' >" + statdur3 + "</td>";
  row = row + "<td width='30' id='" + person.name + "_" + person.index + "_rowkill' onclick='killCombatant(\"" + person.name + "\", \"" + person.index + "\")'><img src='../buttons/button-x.gif' width='30' height='30' /></td>";
  row = row + "<td width='75' id='" + person.name + "_" + person.index + "_rowbuttons' class='rowbuttons_" + person.align + "' />&nbsp;</td>";
	row = row + "</tr>";
	return row;
}

function add_to_bottom(person) {
	var row = make_row(person);
	display[display.length] = row;
	var table = makeTable();

  document.getElementById('initiative').innerHTML = table;
}

function makeTable() {
	let table = "<table id='inittable' class='inittable' border='1' cellspacing='1' cellpadding='0'><tr class='headrow'>";
	table = table + "<th></th><th></th><th>Init</th><th>Combatant</th><th>Status</th><th>Dur</th><th>Status</th><th>Dur</th><th>Status</th><th>Dur</th><th>Kill</th><th></th>";
	table = table + "</tr>";
	for (let i=0; i < display.length; i++) {
		table = table + display[i];
	}
	table = table + "</table>";
	return table;
}

function getInput(name, index, inputtype) {
	let dude = findEntityByName(name, index);
	let data = prompt("" + inputtype + ":", dude[inputtype]);
	if (inputtype === "init") {
		data = parseFloat(data);
		if (!isNaN(data)) { 
			dude.init = data; 
			dude.setinit = 1;
			data = prompt("initmod:", dude.initmod);
			if (!isNaN(data)) {
				dude.initmod = parseFloat(data);
			}
			let initrow = "" + dude.init + " (" + dude.initmod + ")";
      let rowid = dude.name + "_" + dude.index + "_rowinit";
      document.getElementById(rowid).innerHTML = initrow;
		}
	}
	if (inputtype === "displayname") {
		dude.displayname = data;
    let rowid = dude.name + "_" + dude.index + "_rowname";
    document.getElementById(rowid).innerHTML = data;
	}
	if ((inputtype === "stat1") || (inputtype === "stat2") || (inputtype === "stat3")) {
		dude[inputtype] = data;
		let rowid = dude.name + "_" + dude.index + "_row" + inputtype;
		document.getElementById(rowid).innerHTML = data;
		if (data) {
			let dur = inputtype.replace("stat", "statdur");
			let durind = inputtype.replace("stat", "");
  		data = parseInt( prompt("Duration:", dude["dur"]) );
  		if (isNaN(data)) { data = "-"; }
      rowid = dude.name + "_" + dude.index + "_row" + dur;
  		let rowdata = "<table cellpadding='0' cellspacing='0' border='0'><tr><td>" + data + "</td>";  		
  		rowdata = rowdata + "<td>&nbsp;";
  		if (!isNaN(data)) { 
			  rowdata = rowdata + "<img src='../buttons/button-down.gif' width='14' height='14' onClick='reduceDur(\"" + name + "\", \"" + index + "\", " + durind + ")' />&nbsp;";
			}
			rowdata = rowdata + "<img src='../buttons/button-X.gif' width='18' height='18' onClick='removeStatus(\"" + name + "\", \"" + index + "\", " + durind + ")' /></td></tr></table>";
			document.getElementById(rowid).innerHTML = rowdata;
  		dude[dur] = data;
  	}
	}
	if ((inputtype === "statdur1") || (inputtype === "statdur2") || (inputtype === "statdur3")) {
		alert("How did you get here?");
		if (data) {
			dude[inputtype] = data;
			let rowid = dude.name + "_" + dude.index + "_row" + inputtype;
			let rowdata = "<table cellpadding='0' cellspacing='0' border='0'><tr><td>" + data + "</td>";
			rowdata = rowdata + "<td>&nbsp;<img src='../buttons/button-down.gif' width='14' height='14' onClick='reduceDur(\"" + name + ", " + index + ", " +inputtype + "\")' />";
			rowdata = rowdata + "&nbsp;<img src='../buttons/button-X.gif' width='18' height='18' onClick='removeStatus(\"" + name + ", " + index + ", " + inputtype + "\")' /></td></tr></table>";
			document.getElementById(rowid).innerHTML = rowdata;
		}
	}
}

function findEntityByName(name, index) {
	for (let i=0; i<combatants.length; i++) {
		if ((combatants[i].name == name) && (combatants[i].index == index)) { return combatants[i]; }
	}
	alert("Cannot find combatant with name " + name + " " + index);
}

function roll_initiative(which) {
	for (let i=0; i<combatants.length; i++) {
		if ((which === "all") || ((which === "enemy") && (combatants[i].setinit === 0))) {
			let ran=Math.floor(Math.random()*20)+1;
			ran = ran + combatants[i].initmod;
			combatants[i].init = ran;
			combatants[i].setinit = 1;
			combatants[i].delay = 0;
			combatants[i].ready = 0;
		}
    combatants[i].goneyet = 0;
	}
	sort_combatants();
}

function tmpfunc(e) {
	let data = e.target.id.split("_");
	let draw = 0;
	if (e.type === "mouseenter") { draw = 1; }
	drawTempButtons(data[0],data[1],draw);
}

function drawTempButtons(person, index, val) {
//	var rowid = "#" + person + "_" + index + "_rowbuttons";
	var rowid = person + "_" + index + "_rowbuttons";
	if (val) {
//		$(rowid).html("<img src='green-delay.gif' onclick='changestate(\"" + person + "\", \"" + index + "\", \"delay\")' /> &nbsp; <img src='green-ready.gif' onclick='changestate(\"" + person + "\", \"" + index + "\", \"ready\")' />");
		document.getElementById(rowid).innerHTML = "<img src='../buttons/green-delay.gif' onclick='changestate(\"" + person + "\", \"" + index + "\", \"delay\")' /> &nbsp; <img src='../buttons/green-ready.gif' onclick='changestate(\"" + person + "\", \"" + index + "\", \"ready\")' />";
	}
	else {
//		$(rowid).html("");
		document.getElementById(rowid).innerHTML = "";
	}
}

function drawTable() {
	display = [];
	for (let i=0;i < combatants.length; i++) {
		display[i] = make_row(combatants[i]);
	}
	let table = makeTable();
  document.getElementById('initiative').innerHTML = table;
	if (in_combat) {
		let curr_combatant = combatants[current_turn];
		setCurrentTurn(curr_combatant);
		set_active_player();
	}	
	for (let i=0;i < combatants.length; i++) {
		if ((in_combat) && (i !== current_turn)) {
      let rowid = combatants[i].name + "_" + combatants[i].index + "_rowbuttons";
			document.getElementById(rowid).addEventListener("mouseenter", tmpfunc);
			document.getElementById(rowid).addEventListener("mouseleave", tmpfunc);
		}
		if (in_combat) {
			if ((combatants[i].goneyet === 0) && (combatants[i].align !== "friendly")) {
				var rowid = combatants[i].name + "_" + combatants[i].index + "_row";
				document.getElementById(rowid).style.display = "none";
			}
		}
		if (myprefs.boldtext === 1) {
			let cur_combat = combatants[i];
			let rowid = cur_combat.name + "_" + cur_combat.index + "_rowinit";
			document.getElementById(rowid).style.fontWeight = "bold";
			rowid = cur_combat.name + "_" + cur_combat.index + "_rowname";
			document.getElementById(rowid).style.fontWeight = "bold";
    	rowid = cur_combat.name + "_" + cur_combat.index + "_rowstat1";
	    document.getElementById(rowid).style.fontWeight = "bold";
    	rowid = cur_combat.name + "_" + cur_combat.index + "_rowstatdur1";
	    document.getElementById(rowid).style.fontWeight = "bold";
    	rowid = cur_combat.name + "_" + cur_combat.index + "_rowstat2";
      document.getElementById(rowid).style.fontWeight = "bold";
    	rowid = cur_combat.name + "_" + cur_combat.index + "_rowstatdur2";
      document.getElementById(rowid).style.fontWeight = "bold";
    	rowid = cur_combat.name + "_" + cur_combat.index + "_rowstat3";
      document.getElementById(rowid).style.fontWeight = "bold";
    	rowid = cur_combat.name + "_" + cur_combat.index + "_rowstatdur3";
      document.getElementById(rowid).style.fontWeight = "bold";
    }
	}
	ipcRenderer.send('init_table', document.getElementById('initiative'));
}

function clear_combatants() {
	combatants = [];
	drawTable();
}

// Moved
function toggle_combat() {
	if (in_combat) {
		in_combat = 0;
    for (let i=0;i < combatants.length; i++) {
      combatants[i].goneyet = 0;
    }
		drawTable();
		document.getElementById('initiative').style.display = "none";;
	}
	else {
		in_combat = 1;
		drawTable();
		
		set_active_player();
		round = 1;
		document.getElementById('initiative').style.display = "block";
		}
}

function set_active_row(rowid,color) {
	document.getElementById(rowid).style.backgroundColor = color;
	if (myprefs.boldtext == 1) { 
		document.getElementById(rowid).style.fontWeight = "bold";
	}
	else { 
		document.getElementById(rowid).style.fontWeight = "normal";
	}
}

function set_active_player(prev) {
	let prev_turn = current_turn - 1;
	if (prev_turn < 0) { prev_turn = combatants.length -1; }
	if (prev === 1) {
		prev_turn = current_turn +1;
		if (prev_turn >= combatants.length) {
			prev_turn = 0;
		}
	}
	let cur_combat = combatants[prev_turn];
	let rowid = cur_combat.name + "_" + cur_combat.index + "_turnmarker";
	let sethtml = "";
	if (cur_combat.ready) { sethtml = "<img src='../buttons/red-ready.gif' onclick='changestate(\""+ cur_combat.name + "\", \"" + cur_combat.index + "\", \"unready\")' />"; }
	if (cur_combat.delay) { sethtml = "<img src='../buttons/red-delay.gif' onclick='changestate(\""+ cur_combat.name + "\", \"" + cur_combat.index + "\", \"undelay\")' />"; }
	document.getElementById(rowid).innerHTML = sethtml;
	rowid = cur_combat.name + "_" + cur_combat.index + "_row";
	document.getElementById(rowid).style.margin = "0px 0px 0px 0px";
	var align = cur_combat.align;
	var color;
	if (align === "friendly") { color = "#3399ff"; }
	else if (align === "enemy") { color = "#dd0000"; }
	else { color = "#ffffff"; }	
  set_active_row(cur_combat.name + "_" + cur_combat.index + "_rowinit", color);
	set_active_row(cur_combat.name + "_" + cur_combat.index + "_rowname", color);
	set_active_row(cur_combat.name + "_" + cur_combat.index + "_rowstat1", color);
  set_active_row(cur_combat.name + "_" + cur_combat.index + "_rowstatdur1", color);
  set_active_row(cur_combat.name + "_" + cur_combat.index + "_rowstat2", color);
  set_active_row(cur_combat.name + "_" + cur_combat.index + "_rowstatdur2", color);
  set_active_row(cur_combat.name + "_" + cur_combat.index + "_rowstat3", color);
  set_active_row(cur_combat.name + "_" + cur_combat.index + "_rowstatdur3", color);
	rowid = cur_combat.name + "_" + cur_combat.index + "_rowbuttons";
	document.getElementById(rowid).innerHTML = "";
  document.getElementById(rowid).style.backgroundColor = color;
  document.getElementById(rowid).addEventListener("mouseenter", tmpfunc);
  document.getElementById(rowid).addEventListener("mouseleave", tmpfunc);

	cur_combat = combatants[current_turn];
	cur_combat.ready = 0;
	cur_combat.delay = 0;
	rowid = cur_combat.name + "_" + cur_combat.index + "_turnmarker";
	document.getElementById(rowid).innerHTML = "<img src='../buttons/turn_marker.gif' />";
	rowid = cur_combat.name + "_" + cur_combat.index + "_row";
	document.getElementById(rowid).style.margin = "3px 0px 3px 0px";
	var align = cur_combat.align;
	var color;
	if (align === "friendly") { color = "green"; }
	else if (align === "enemy") { color = "orange"; }
  else { color = "yellow"; }
  set_active_row(cur_combat.name + "_" + cur_combat.index + "_rowinit", color);
  set_active_row(cur_combat.name + "_" + cur_combat.index + "_rowname", color);
  set_active_row(cur_combat.name + "_" + cur_combat.index + "_rowstat1", color);
  set_active_row(cur_combat.name + "_" + cur_combat.index + "_rowstatdur1", color);
  set_active_row(cur_combat.name + "_" + cur_combat.index + "_rowstat2", color);
  set_active_row(cur_combat.name + "_" + cur_combat.index + "_rowstatdur2", color);
  set_active_row(cur_combat.name + "_" + cur_combat.index + "_rowstat3", color);
  set_active_row(cur_combat.name + "_" + cur_combat.index + "_rowstatdur3", color);
	rowid = cur_combat.name + "_" + cur_combat.index + "_rowbuttons";
	document.getElementById(rowid).innerHTML = "<img src='../buttons/green-delay.gif' onclick='changestate(\"" + cur_combat.name + "\", \"" + cur_combat.index + "\", \"delay\")' /> &nbsp; <img src='../buttons/green-ready.gif' onclick='changestate(\"" + cur_combat.name + "\", \"" + cur_combat.index + "\", \"ready\")' />";
  document.getElementById(rowid).style.backgroundColor = color;
	document.getElementById(rowid).removeEventListener("mouseenter",tmpfunc);
	document.getElementById(rowid).removeEventListener("mouseleave",tmpfunc);

 	rowid = cur_combat.name + "_" + cur_combat.index + "_row";
  document.getElementById(rowid).style.display = "";
  cur_combat.goneyet = 1;
}

function nextCombatant() {
	current_turn++;
	if (current_turn === combatants.length) { 
		current_turn = 0; 
		round++;
		document.getElementById('round_number').innerHTML = "Round<br />" + round;
		document.getElementById('round_number').style.backgroundColor = "white";
	}
	set_active_player();
}

function prevCombatant() {
	current_turn--;
	if (current_turn === -1) { 
		current_turn = combatants.length-1; 
		round--;
		document.getElementById('round_number').innerHTML = "Round<br />" + round;
	}
	set_active_player(1);
}

function setCurrentTurn(person) {
	for (let i = 0; i < combatants.length; i++) {
    if (combatants[i] === person) { current_turn = i; return i; }		
	}
}

function killCombatant(name, index) {
	var fighter = findEntityByName(name, index);
	var fighter_index;
	for (let i = 0; i< combatants.length; i++) { 
		if (combatants[i] === fighter) { fighter_index = i; }
	}
	if (current_turn === fighter_index) {     // active player was killed
		nextCombatant();
	}
	if (fighter_index > current_turn) {
		combatants.splice(fighter_index,1);
	}
	else {
		combatants.splice(fighter_index,1);
		current_turn--;
	}
	drawTable();
	if (in_combat) {
	  if (myprefs.deathsound) {
	    playSound(1);
	  }
	}
}

function changestate(name, index, changeto) {
	if (changeto === "ready") {
		let person = findEntityByName(name,index);
		person.ready = 1;
		if (combatants[current_turn] === person) {
		  nextCombatant();
		}
		drawTable();
	}
	else if (changeto === "delay") {
		let person = findEntityByName(name,index);
		person.delay = 1;
		if (combatants[current_turn] === person) {
		  nextCombatant();
		}
		drawTable();
	}
	else if (changeto === "undelay") {
		changeto = changeto.replace("un", "");
		let person = findEntityByName(name,index);
		person[changeto] = 0;
		if (current_turn === (combatants.length - 1)) {
			person.init = combatants[current_turn].init;
			person.tiebreaker = combatants[current_turn].tiebreaker - 1;
		}
		else {
			if (combatants[current_turn].init !== combatants[current_turn+1].init) {
        person.init = combatants[current_turn].init;
        person.tiebreaker = combatants[current_turn].tiebreaker - 1;
			}
			else {
				person.init = combatants[current_turn].init;
				if (combatants[current_turn].tiebreaker !== combatants[current_turn+1].tiebreaker) {
					let tmptb = (combatants[current_turn].tiebreaker + combatants[current_turn+1].tiebreaker)/2;
	  		  tmptb = tmptb * 10000;
		  	  tmptb = parseInt(tmptb);
			    tmptb = tmptb/10000;
			    person.tiebreaker = tmptb;
			  }
			  else {
			  	let lastthis = current_turn + 1;
			  	while ((lastthis < combatants.length-1) && (combatants[lastthis].init === combatants[lastthis+1].init) && (combatants[lastthis].tiebreaker === combatants[lastthis+1].tiebreaker)) {
			  	  lastthis++;
			    }
			    if (combatants[lastthis].init === combatants[lastthis+1].init) {
			    	combatants[lastthis].tiebreaker = (combatants[lastthis+1].tiebreaker + combatants[current_turn].tiebreaker)/2;
			    }
			    else {
			    	combatants[lastthis].tiebreaker--;
			    }
			    let i = lastthis - 1;
			    while (i > current_turn) {
			    	combatants[i].tiebreaker = (combatants[current_turn].tiebreaker + combatants[i+1].tiebreaker)/2;
			    }
			    person.tiebreaker = (combatants[current_turn].tiebreaker + combatants[current_turn+1].tiebreaker)/2;
			  }
			}
			
		}
		sort_combatants();
		nextCombatant();
	}
	else if (changeto === "unready") {
		changeto = changeto.replace("un", "");
		let person = findEntityByName(name,index);
		person[changeto] = 0;
		if (current_turn === 0) {
			person.init = combatants[current_turn].init;
			person.tiebreaker = combatants[current_turn].tiebreaker + 1;
		}
		else {
			if (combatants[current_turn].init !== combatants[current_turn-1].init) {
        person.init = combatants[current_turn].init;
        person.tiebreaker = combatants[current_turn].tiebreaker + 1;
			}
			else {
				person.init = combatants[current_turn].init;
				if (combatants[current_turn].tiebreaker !== combatants[current_turn-1].tiebreaker) {
					let tmptb = (combatants[current_turn].tiebreaker + combatants[current_turn-1].tiebreaker)/2;
	  		  tmptb = tmptb * 10000;
		  	  tmptb = parseInt(tmptb);
			    tmptb = tmptb/10000;
			    person.tiebreaker = tmptb;
			  }
			  else {
			  	let lastthis = current_turn - 1;
			  	while ((lastthis > 0) && (combatants[lastthis].init === combatants[lastthis-1].init) && (combatants[lastthis].tiebreaker === combatants[lastthis-1].tiebreaker)) {
			  	  lastthis--;
			    }
			    if (combatants[lastthis].init === combatants[lastthis-1].init) {
			    	combatants[lastthis].tiebreaker = (combatants[lastthis-1].tiebreaker + combatants[current_turn].tiebreaker)/2;
			    }
			    else {
			    	combatants[lastthis].tiebreaker++;
			    }
			    let i = lastthis + 1;
			    while (i < current_turn) {
			    	combatants[i].tiebreaker = (combatants[current_turn].tiebreaker + combatants[i-1].tiebreaker)/2;
			    }
			    person.tiebreaker = (combatants[current_turn].tiebreaker + combatants[current_turn-1].tiebreaker)/2;
			  }
			}
			
		}
		sort_combatants();
	}	
}

function reduceDur(name, index, status) {
	let stat = "stat" + status;
	let statdur = "statdur" + status;
	let person = findEntityByName(name,index);
	let newstatdur = parseInt(person[statdur]);
	newstatdur--;
	person[statdur] =newstatdur;
	if (person[statdur] === 0) {
		removeStatus(name,index,status);
	}
	drawTable();
}

function removeStatus(name, index, status) {
	let stat = "stat" + status;
  let statdur = "statdur" + status;
  let person = findEntityByName(name,index);
  person[stat] = "";
  person[statdur] = 0;
  drawTable();
}

// Moved
function declareVictory() {
  // move to control
	if (myprefs.victorysound) {
    let sound = myprefs.victorysound;
    if (sound == 8) {
      sound = Math.floor(Math.random()*8)+2
    }
    playSound(sound);
	}
	
	document.getElementById('initiative').style.display = "none";
}
