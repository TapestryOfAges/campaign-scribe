"use strict";

let combatants = [];
let display = [];
let nameshash = [];
let current_turn = 0;
let round=1;

function add_char(char) {
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
  if (state === "combat") {
    sort_combatants();
  }
  update_display();
}

function toggle_display_combat() {
	if (state === "combat") {
    for (let i=0;i < combatants.length; i++) {
      combatants[i].goneyet = 0;
    }
		drawTable();
    document.getElementById('initiative').style.display = "none";
	}
	else {
		drawTable();
		
		set_active_player();
    round = 1;
		document.getElementById('initiative').style.display = "block";
	}
}

function sort_combatants() {
	if (!combatants.length) { return; }
	let current_dude;
	if (state === "combat") {
		current_dude = combatants[current_turn];
	}
	combatants.sort(sortByInit);
	for (let i = 1; i < combatants.length; i++) {
		if ((combatants[i].init === combatants[i-1].init) && (combatants[i].tiebreaker >= combatants[i-1].tiebreaker)) {
			combatants[i].tiebreaker = combatants[i-1].tiebreaker - .01;
		}
	}
	if (state === "combat") {
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
	let ran = Math.floor(Math.random()*2)+1;
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
	row = row + `<td class='rowinit_${person.align}' id='${person.name}_${person.index}_rowinit'><span id='${person.name}_${person.index}_rowinitval' ondblclick="getInput('${person.name}', '${person.index}', 'initval')">${person.init}</span> <span id='${person.name}_${person.index}_rowinitmod' ondblclick="getInput('${person.name}', '${person.index}', 'initmod')">(${person.initmod})</span>`;
	if (myprefs.showtiebreaker === 1) { row = row + " [" + person.tiebreaker + "]"; }
	row = row + "</td>";
	
	let ind = "";
	if ((person.index) && (nameshash[person.name] > 1)) { ind = person.index; }
	let myname = person.name;
	if (person.displayname) { myname = person.displayname; }
	row = row + `<td class='rowname_${person.align}' id='${person.name}_${person.index}_rowname' ondblclick="getInput('${person.name}', '${person.index}', 'name')"> ${myname} ${ind}</td>`;
	let stat1 = "";
	stat1 = `<table cellpadding='0' cellspacing='0' border='0'><tr><td ondblclick='getInput("${person.name}", "${person.index}", "ac")' style='vertical-align:middle'><img src='../ui/ac.png' height='30' /><span id='${person.name}_${person.index}_rowac'>`;
	if (person.armorclass) {
		stat1 += person.armorclass;
	}
	stat1 += `</span></td><td ondblclick='getInput("${person.name}", "${person.index}","hp")' style='vertical-align:middle'><img src='../ui/hp.png' height='30' /><span id='${person.name}_${person.index}_rowhp'>`;
	if (person.hitpoints) {
		stat1 += person.hitpoints;
	}
	stat1 += `</span></td></tr></table>`;

	let stat2 = "";
  for (let i=0;i<person.status_effects.length;i++) {
		let st = encodeURI(FindStatusByName(person.status_effects[i]));
		console.log(st);
		
    let statdesc = FindStatusByName(person.status_effects[i], "desc");
    stat2 += `<img src="${st}" onClick='removeStat("${person.name}", "${person.index}", ${i})' class='statuseffect' title="${statdesc}" />`;
	}
	stat2 += `<img src='../buttons/button-plus.gif' class='headonly' onclick="addStat('${person.name}', '${person.index}')" />`;

	row = row + `<td class='rowstatus_${person.align} headonly' id='${person.name}_${person.index}_rowstat1' >${stat1}</td>`;
	row = row + `<td class='rowstatus_${person.align}' id='${person.name}_${person.index}_rowstat2'>${stat2}</td>`;
  row = row + `<td width='30' id='${person.name}_${person.index}_rowkill' class='headonly' onclick='killCombatant("${person.name}", "${person.index}")'><img src='../buttons/button-x.gif' width='30' height='30' /></td>`;
  row = row + `<td id='${person.name}_${person.index}_rowbuttons' class='rowbuttons_${person.align} headonly' />&nbsp;</td>`;
	row = row + "</tr>";
	return row;
}

function add_to_bottom(person) {
	let row = make_row(person);
	display[display.length] = row;
	let table = makeTable();

	document.getElementById('initiative').innerHTML = table;
	update_display();
}

function makeTable() {
	let table = "<table id='inittable' class='inittable' border='1' cellspacing='1' cellpadding='0'><tr class='headrow'>";
	table = table + "<th></th><th></th><th>Init</th><th>Combatant</th><th class='headonly'></th><th>Status</th><th class='headonly'>Kill</th><th></th>";
	table = table + "</tr>";
	for (let i=0; i < display.length; i++) {
		table = table + display[i];
	}
	table = table + "</table>";
	return table;
}

function getInput(name,index,inputtype) {
  let dude = findEntityByName(name, index);
  let input = document.getElementById(name + "_" + index + "_row" + inputtype);
  let currdata = input.innerHTML;
  let size=8;
  if ((inputtype === "initmod") || (inputtype === "initval") || inputtype === "ac" || inputtype === "hp") { size=2; }
  let newinput = `<input type='text' id='tmp_${inputtype}' size=${size} onBlur='ProcessChangeInput("${name}", "${index}", "${inputtype}")' value='${currdata}' />`;
	input.innerHTML = newinput;
	document.getElementById(`tmp_${inputtype}`).focus();
	document.getElementById(`tmp_${inputtype}`).select();
	ack_keyboard = 0;
}

function ProcessChangeInput(name,index,inputtype) {
  let dude = findEntityByName(name, index);
  let input = document.getElementById("tmp_" + inputtype);
  let data = input.value;  // ???
  let newhtml = "";
  if (inputtype === "initval") {
		data = parseFloat(data);
		if (!isNaN(data)) {
			dude.init = data;
			dude.setinit = 1;
		}
	} else if (inputtype === "initmod") {
    data = parseFloat(data);
		if (!isNaN(data)) {
			dude.initmod = data;
			dude.setinit = 1;
		}
	} else if (inputtype === "name") {
		if (data) { dude.displayname = data; }
  } else if ((inputtype === "stat1") || (inputtype === "stat2") || (inputtype === "stat3")) {
    if (data) { dude[inputtype] = data; }
	} else if ((inputtype === "statdur2") || (inputtype === "statdur3")) {
	  if (data) { dude[inputtype] = data; }
	} else if (inputtype === "ac") {
    if (data) { dude.armorclass = data; }
	} else if (inputtype === "hp") { 
    if (data) { dude.hitpoints = data; }
	}
	ack_keyboard = 1;
	drawTable();  // if this doesn't work, recreate just the right sections
}

function findEntityByName(name, index) {
	for (let i=0; i<combatants.length; i++) {
		if ((combatants[i].name == name) && (combatants[i].index == index)) { return combatants[i]; }
	}
	console.log("Cannot find combatant with name " + name + " " + index);
}

function roll_initiative(which) {
	for (let i=0; i<combatants.length; i++) {
		if ((which === "all") || ((which === "enemy") && (combatants[i].setinit === 0) && (combatants[i].align === "enemy"))) {
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
	let rowid = person + "_" + index + "_rowbuttons";
	if (val) {
		document.getElementById(rowid).innerHTML = "<img src='../buttons/green-delay.gif' onclick='changestate(\"" + person + "\", \"" + index + "\", \"delay\")' /> &nbsp; <img src='../buttons/green-ready.gif' onclick='changestate(\"" + person + "\", \"" + index + "\", \"ready\")' />";
	}
	else {
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
	if (state === "combat") {
		let curr_combatant = combatants[current_turn];
		setCurrentTurn(curr_combatant);
		set_active_player();
	}	
	for (let i=0;i < combatants.length; i++) {
		if ((state === "combat") && (i !== current_turn)) {
      let rowid = combatants[i].name + "_" + combatants[i].index + "_rowbuttons";
			document.getElementById(rowid).addEventListener("mouseenter", tmpfunc);
			document.getElementById(rowid).addEventListener("mouseleave", tmpfunc);
		}
		if (state === "combat") {
			if ((combatants[i].goneyet === 0) && (combatants[i].align !== "friendly")) {
				let rowid = combatants[i].name + "_" + combatants[i].index + "_row";
//				document.getElementById(rowid).style.display = "none";
        document.getElementById(rowid).classList.add("notyet");
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
    	rowid = cur_combat.name + "_" + cur_combat.index + "_rowstat2";
      document.getElementById(rowid).style.fontWeight = "bold";
    }
	}
	update_display();
}

function clear_combatants() {
	combatants = [];
	display = [];
	nameshash = [];
	current_turn = 0;
	round = 1;
//	drawTable();
	update_display();
}

function set_active_row(rowid,color) {
	console.log(rowid);
	document.getElementById(rowid).style.backgroundColor = color;
	if (myprefs.boldtext == 1) { 
		document.getElementById(rowid).style.fontWeight = "bold";
	}
	else { 
		document.getElementById(rowid).style.fontWeight = "normal";
	}
	update_display();
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
	let align = cur_combat.align;
	let color;
	if (align === "friendly") { color = "#3399ff"; }
	else if (align === "enemy") { color = "#dd0000"; }
	else { color = "#ffffff"; }	
  set_active_row(cur_combat.name + "_" + cur_combat.index + "_rowinit", color);
	set_active_row(cur_combat.name + "_" + cur_combat.index + "_rowname", color);
	set_active_row(cur_combat.name + "_" + cur_combat.index + "_rowstat1", color);
  set_active_row(cur_combat.name + "_" + cur_combat.index + "_rowstat2", color);
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
	document.getElementById(rowid).classList.remove("notyet");
	align = cur_combat.align;
	if (align === "friendly") { color = "green"; }
	else if (align === "enemy") { color = "orange"; }
  else { color = "yellow"; }
  set_active_row(cur_combat.name + "_" + cur_combat.index + "_rowinit", color);
  set_active_row(cur_combat.name + "_" + cur_combat.index + "_rowname", color);
  set_active_row(cur_combat.name + "_" + cur_combat.index + "_rowstat1", color);
  set_active_row(cur_combat.name + "_" + cur_combat.index + "_rowstat2", color);
	rowid = cur_combat.name + "_" + cur_combat.index + "_rowbuttons";
	document.getElementById(rowid).innerHTML = "<img src='../buttons/green-delay.gif' onclick='changestate(\"" + cur_combat.name + "\", \"" + cur_combat.index + "\", \"delay\")' /> &nbsp; <img src='../buttons/green-ready.gif' onclick='changestate(\"" + cur_combat.name + "\", \"" + cur_combat.index + "\", \"ready\")' />";
  document.getElementById(rowid).style.backgroundColor = color;
	document.getElementById(rowid).removeEventListener("mouseenter",tmpfunc);
	document.getElementById(rowid).removeEventListener("mouseleave",tmpfunc);

 	rowid = cur_combat.name + "_" + cur_combat.index + "_row";
  document.getElementById(rowid).style.display = "";
	cur_combat.goneyet = 1;
	update_display();
}

function nextCombatant() {
	if (!document.getElementById('initiative')) { Create_Combat_Pane(); }
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
	if (!document.getElementById('initiative')) { Create_Combat_Pane(); }
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
	let fighter = findEntityByName(name, index);
	let fighter_index;
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
	if (state === "combat") {
	  if (myprefs.deathsound) {
			explosion.currentTime = 0;
	    explosion.play();
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

