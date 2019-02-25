"use strict;"

let statuses = {};
let abilities = {};
let spells = {};

let userabilities = {};
let abilitiesmask = {};
let userspells = {};
let spellsmask = {};

// 5E
statuses["Blinded"] = "blinded.png";  
statuses["Charmed"] = "charmed.png";  
statuses["Deafened"] = "deafened.png"; 
statuses["Exhaustion"] = "exhausted.png"; 
statuses["Frightened"] = "fear.png";  
statuses["Grappled"] = "grappled.png"; 
statuses["Incapacitated"] = "incapacitated.png"; 
statuses["Invisible"] = "invisible.png";  
statuses["Paralyzed"] = "paralyzed.png"; 
statuses["Petrified"] = "petrified.png"; 
statuses["Poisoned"] = "poisoned.png"; 
statuses["Prone"] = "prone.png"; 
statuses["Restrained"] = "restrained.png"; 
statuses["Stunned"] = "stunned.png";   
statuses["Unconscious"] = "unconscious.png"; 
statuses["Dying"] = "dying.png"; 
statuses["Concentrating"] = "concentrating.png"; 

abilities["Ancestral Protectors"] = "ancestral_protectors.png";
abilities["Flames of Phlegethos"] = "flames_of_phlegethos.png";
abilities["Raging"] = "raging.png";
abilities["Reckless Attack"] = "reckless_attack.png";

spells["Absorb Elements"] = "absorb_elements.png";
spells["Dragon's Breath"] = "dragon's_breath.png";
spells["Faerie Fire"] = "faerie_fire.png";
spells["Frostbite"] = "frostbite.png";
spells["Guidance"] = "guidance.png";
spells["Maximilian's Earthen Grasp"] = "maximilian's_earthen_grasp.png";
spells["Shocking Grasp"] = "shocking_grasp.png";
// Tmp storage
//abilities["Bless"] = "r_20.png";
//spells["Haste"] = "g_14.png";
//spells["Blink"] = "";
//spells["Blur"] = "";
// Fly r_33
// Entangled r_27

function SetUpStatuses() {
  let statusmod = "<h3 style='text-align:center'>Statuses</h3><p>";
  let first = 1;
  let statlist = [];
  for (let status in statuses) {
    statlist.push(status);
  }
  statlist = statlist.sort();
  for (let i=0;i<statlist.length;i++){
    if (first) { first = 0; }
    else { statusmod += "<br />"; }
    statusmod += `<span onclick="SelectStatus('${statlist[i]}')">${statlist[i]}</span>`;
  }
  first = 1;
  statusmod += "</p><h3 style='text-align:center'>Abilities</h3><p>";
  statlist = [];
  for (let status in abilities) {
    statlist.push(status);
  }
  statlist = statlist.sort();
  for (let i=0;i<statlist.length;i++) {
    if (first) { first = 0; }
    else { statusmod += "<br />"; }
    statusmod += `<span onclick="SelectStatus('${statlist[i]}')">${statlist[i]}</span>`;
  }
  statusmod += "</p><h3 style='text-align:center'>Abilities</h3><p>";
  first = 1;
  statlist = [];
  for (let status in spells) {
    statlist.push(status);
  }
  statlist = statlist.sort();
  for (let i=0;i<statlist.length;i++) {
    if (first) { first = 0; }
    else { statusmod += "<br />"; }
    statusmod += `<span onclick="SelectStatus('${statlist[i]}')">${statlist[i]}</span>`;
  }
  statusmod += "</p>";
  document.getElementById('statuses').innerHTML = statusmod;
}

function tmp() { 
  let statusmod = "<form id='stats'>";
  statusmod = "<h3 style='text-align:center'>Statuses</h3><br /><table cellpadding='0' cellspacing='4' border='0'>";
  let statnum = 0;
  for (let status in statuses) {
    statnum++;
    if (statnum===6) { statnum=1; }
    if (statnum===1) { statusmod += "<tr>"; }
    statusmod += `<td onclick="SelectStatus('${status}')" style="text-align:center;vertical-align:top"><img src="../statuseffects/${statuses[status]}" width="32" /><br />${status}</td>`;
    if (statnum===5) { statusmod += "</tr>";}
  }
  while (statnum < 5) {
    statusmod += "<td></td>";
    statnum++;
    if (statnum===5) { statusmod += "</tr>"; }
  }
  statusmod += "</table><h3 style='text-align:center'>Abilities</h3><br /><table cellpadding='0' cellspacing='4' border='0'>";
  statnum = 0;
  for (let status in abilities) {
    statnum++;
    if (statnum===6) { statnum=1; }
    if (statnum===1) { statusmod += "<tr>"; }
    statusmod += `<td onclick="SelectStatus('${status}')" style="text-align:center;vertical-align:top"><img src="../statuseffects/${abilities[status]}" width="32" /><br />${status}</td>`;
    if (statnum===5) { statusmod += "</tr>";}
  }
  while (statnum < 5) {
    statusmod += "<td></td>";
    statnum++;
    if (statnum===5) { statusmod += "</tr>"; }
  }
  statusmod += "</table><h3 style='text-align:center'>Spells</h3><br /><table cellpadding='0' cellspacing='4' border='0'>";
  statnum = 0;
  for (let status in spells) {
    statnum++;
    if (statnum===6) { statnum=1; }
    if (statnum===1) { statusmod += "<tr>"; }
    statusmod += `<td onclick="SelectStatus('${status}')" style="text-align:center;vertical-align:top"><img src="../statuseffects/${spells[status]}" width="32" /><br />${status}</td>`;
    if (statnum===5) { statusmod += "</tr>";}
  }
  while (statnum < 5) {
    statusmod += "<td></td>";
    statnum++;
    if (statnum===5) { statusmod += "</tr>"; }
  }
  statusmod += `</table></form><br /><input type="button" value="Cancel" onClick="CancelStatus();" />`
  document.getElementById('controlwindow').innerHTML = statusmod;
}

function CancelStatus(redraw) {
  document.getElementById('statuses').style.display = "none";
  if (redraw) { drawTable(); }
}

function SelectStatus(ss) {
  for (let i=0;i<selectedentity.status_effects.length;i++) {
    if (selectedentity.status_effects[i] === ss) { CancelStatus(); return; }
  }
  selectedentity.status_effects[selectedentity.status_effects.length] = ss;
  CancelStatus(1);
  return;
}

function addStat(whoname, whoid) {
  selectedentity = findEntityByName(whoname, whoid);
  document.getElementById('statuses').style.display = "block";
}

function removeStat(whoname, whoid, statindex) {
  let who = findEntityByName(whoname, whoid);
  who.status_effects.splice(statindex,1);
  drawTable();
}

function edit_status() {
  
}

function FindStatusName(statname, usepath) {
  let path = "";
  if (usepath) { path = " ../statuseffects/"; }
  for (let i in statuses) {
    if (i === name) { return path + "" + statuses[i]; }
  }
  for (let i in abilities) {
    if (i === name) { return path + "" + abilities[i]; }
  }
  for (let i in userabilities) {
    if (i === name) { return userabilities[i]; }
  }
  for (let i in spells) {
    if (i === name) { return path + "" + spells[i]; }
  }
  for (let i in userspells) {
    if (i === name) { return userspells[i]; }
  }
  return null;
}