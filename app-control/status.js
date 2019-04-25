"use strict;"

let statuses = {};
let abilities = {};
let spells = {};

let userabilities = {};
let abilitiesmask = {};
let userspells = {};
let spellsmask = {};

let tmpcond = {};

class condition {
  constructor(filepath, desc) {
    this.filepath = filepath;
    this.desc = desc;
    this.enabled = 1;
  }
}

// 5E
statuses["Blinded"] = new condition("../statuseffects/blinded.png", "Can't see. Disadv on Atks. Adv on Atks targeting.");
statuses["Charmed"] = new condition("../statuseffects/charmed.png", "Can't Atk charmer. Charmer has Adv on social.");  
statuses["Deafened"] = new condition("../statuseffects/deafened.png", "Can't hear."); 
statuses["Exhaustion"] = new condition("../statuseffects/exhausted.png", "See chart."); 
statuses["Frightened"] = new condition("../statuseffects/fear.png", "Disadv on AbChks and Atks while fear source is visible. Can't approach.");  
statuses["Grappled"] = new condition("../statuseffects/grappled.png", "Speed 0."); 
statuses["Incapacitated"] = new condition("../statuseffects/incapacitated.png", "Can't take actions or reactions."); 
statuses["Invisible"] = new condition("../statuseffects/invisible.png", "Atks have adv, Atks targetting have Disadv.");  
statuses["Paralyzed"] = new condition("../statuseffects/paralyzed.png", "Incapacitated (no actions or reactions). Fails Str and Dex saves. Atks targetting have Adv. Atks that hit from <=5' auto-crit."); 
statuses["Petrified"] = new condition("../statuseffects/petrified.png", "Stone. Incapacitated (no actions or reactions). Atks targetting have Adv. Resist all damage. Fails Str and Dex saves."); 
statuses["Poisoned"] = new condition("../statuseffects/poisoned.png", "Disadv on Atks and AbChks."); 
statuses["Prone"] = new condition("../statuseffects/prone.png", "Only crawl. Disadv on atks. Atks targetting from <=5' have Adv, otherwise have Disadv."); 
statuses["Restrained"] = new condition("../statuseffects/restrained.png", "Speed 0. Atks have Disadv. Atks targetting have Adv. Disadv on Dex saves."); 
statuses["Stunned"] = new condition("../statuseffects/stunned.png", "Incapacitated (no actions or reactions). Fails Str and Dex saves. Atks targetting had Adv.");   
statuses["Unconscious"] = new condition("../statuseffects/unconscious.png", "Incapacitated (no actions or reactions). Fails Str and Dex saves. Atks targetting have Adv. Atks that hit from <=5' auto-crit."); 
statuses["Dying"] = new condition("../statuseffects/dying.png", "Must make death saves."); 
statuses["Concentrating"] = new condition("../statuseffects/concentrating.png", "Con save to preserve concentration."); 

abilities["Ancestral Protectors"] = new condition("../statuseffects/ancestral_protectors.png", "Atks have disadv unless against barb. Targets other than barb hit resist that damage.");
abilities["Bardic Inspiration"] = new condition("../statuseffects/bardic_inspiration.png", "Gain bonus die to add to one AbChk, Atk, or Save.");
abilities["Flames of Phlegethos"] = new condition("../statuseffects/flames_of_phlegethos.png", "Creatures that hit from <=5' take 1d4 fire.");
abilities["Raging"] = new condition("../statuseffects/raging.png", "Adv on Str chks/saves. Str melee atks gain dmg. Resist BPS.");
abilities["Reckless Attack"] = new condition("../statuseffects/reckless_attack.png", "Adv on Str melee atks. Atks targetting gain Adv.");

spells["Absorb Elements"] = new condition("../statuseffects/absorb_elements.png", "Resist dmg type until turn start. First time you hit with melee on next turn, add Ld6 dmg of Type.");
spells["Blade Ward"] = new condition("../statuseffects/blade_ward.png", "Until next turn, resist bludgeoning/slashing/piercing from wpn atks.");
spells["Bless"] = new condition("../statuseffects/bless.png", "Add d4 to atks and saves.");
spells["Blink"] = new condition("../statuseffects/blink.png", "50% go Ethereal at end of each of your turns.");
spells["Dragon's Breath"] = new condition("../statuseffects/dragon's_breath.png", "Can breathe Type in 15' cone. Deals (2+L)d6 Type damage, Dex save half.");
spells["Entangle"] = new condition("../statuseffects/entangle.png", "Str save ends. Restrained (Speed 0. Atks have Disadv. Atks targetting have Adv. Disadv on Dex saves.)");
spells["Entangle"] = new condition("../statuseffects/entangle.png", "Incr 1 size cat. Adv on Str chks and saves. +1d4 wpn dmg.");
spells["Faerie Fire"] = new condition("../statuseffects/faerie_fire.png", "Atk targetting have Adv. Cannot be Invisible.");
spells["Feather Fall"] = new condition("../statuseffects/featherfall.png", "Fall slowly.");
spells["Frostbite"] = new condition("../statuseffects/frostbite.png", "Disadv on next wpn atk before end of next turn.");
spells["Guidance"] = new condition("../statuseffects/guidance.png", "May add 1d4 to one AbChk.");
spells["Haste"] = new condition("../statuseffects/guidance.png", "Speed x2, +2 AC, Adv Dex saves, +1 Action.");
spells["Hex"] = new condition("../statuseffects/hex.png", "Caster has +1d6 necro dmg when hits. Disadv on chosen ability checks.");
spells["Heroism"] = new condition("../statuseffects/heroism.png", "Immune to Frightened. Gains MOD tmp hp at start of each turn.");
spells["Levitate"] = new condition("../statuseffects/levitate.png", "Floats.");
spells["Maximilian's Earthen Grasp"] = new condition("../statuseffects/maximilian's_earthen_grasp.png", "Restrained. (Speed 0. Atks have Disadv. Atks targetting have Adv. Disadv on Dex saves.)");
spells["Mirror Image"] = new condition("../statuseffects/mirrorimage.png", "Chance atks targetting hit illusory duplicates.");
spells["Reduce"] = new condition("../statuseffects/reduce.png", "Reduce 1 size cat. Disad on Str chks and saves. Wpn dmg reduced by 1d4.");
spells["Shocking Grasp"] = new condition("../statuseffects/shocking_grasp.png", "Cannot take reactions until start of turn.");
spells["Slow"] = new condition("../statuseffects/slow.png", "Wis save ends. Speed 1/2, -2 to AC and Dex saves, no reactions, restrictions on actions.");
spells["Web"] = new condition("../statuseffects/web.png", "Str chk ends. Restrained (Speed 0. Atks have Disadv. Atks targetting have Adv. Disadv on Dex saves).");
// Tmp storage
// Fly r_33

function SetUpStatuses() {
  let statusmod = "<h3 style='text-align:center'>Statuses</h3><p>";
  let first = 1;
  let statlist = [];
  for (let status in statuses) {
    statlist.push(status);
  }
  statlist = statlist.sort();
  for (let i=0;i<statlist.length;i++){
    if (!FindStatusByName(statlist[i],"enabled")) { continue; }
    if (first) { first = 0; }
    else { statusmod += "<br />"; }
    let statname = statlist[i];
    let statname2 = statlist[i];
    statname = statname.replace("'","\'");
    statname = statname.replace("'","\\'");
    let staticon = FindStatusByName(statname2);
    statusmod += `<span onclick="SelectStatus('${statname}')"><img src="${staticon}" height="16" /> ${statname2}</span>`;
  }
  first = 1;
  statusmod += "</p><h3 style='text-align:center'>Abilities</h3><p>";
  statlist = [];
  for (let status in abilities) {
    statlist.push(status);
  }
  for (let status in userabilities) { 
    statlist.push(status);
  }
  statlist = statlist.sort();
  for (let i=0;i<statlist.length;i++) {
    if (!FindStatusByName(statlist[i],"enabled")) { continue; }
    if (first) { first = 0; }
    else { statusmod += "<br />"; }
    let statname = statlist[i];
    let statname2 = statlist[i];
    statname = statname.replace("'","\'");
    statname = statname.replace("'","\\'");
    let staticon = FindStatusByName(statname2);
    statusmod += `<span onclick="SelectStatus('${statname}')"><img src="${staticon}" height="16" /> ${statname2}</span>`;
  }
  statusmod += "</p><h3 style='text-align:center'>Spells</h3><p>";
  first = 1;
  statlist = [];
  for (let status in spells) {
    statlist.push(status);
  }
  for (let status in userspells) {
    statlist.push(status);
  }
  statlist = statlist.sort();
  for (let i=0;i<statlist.length;i++) {
    if (!FindStatusByName(statlist[i],"enabled")) { continue; }
    if (first) { first = 0; }
    else { statusmod += "<br />"; }
    let statname = statlist[i];
    let statname2 = statlist[i];
    statname = statname.replace("'","\'");
    statname = statname.replace("'","\\'");
    let staticon = FindStatusByName(statname2);
    statusmod += `<span onclick="SelectStatus('${statname}')"><img src="${staticon}" height="16" /> ${statname2}</span>`;
  }
  statusmod += "</p>";
  document.getElementById('statuses').innerHTML = statusmod;
}


function CancelStatus(redraw) {
  window.removeEventListener('click', WindowOnclick);
  document.getElementById('statusmod').style.display = "none";
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
  stt = document.getElementById('statusmod');
  stt.style.display = "block";
  window.addEventListener('click', WindowOnclick);
}

function WindowOnclick(e) {
  if (e.target === document.getElementById('statusmod')) { 
    CancelStatus();
  }
}

function removeStat(whoname, whoid, statindex) {
  let who = findEntityByName(whoname, whoid);
  who.status_effects.splice(statindex,1);
  drawTable();
}

function FindStatusByName(name, field) {
  if (!field) { field = "filepath"; }
  let gotstat = null;
  for (let i in statuses) {
    if (i === name) { gotstat = statuses[i]; }
  }
  for (let i in abilities) {
    if (i === name) { gotstat = abilities[i]; }
  }
  for (let i in userabilities) {
    if (i === name) { gotstat = userabilities[i]; }
  }
  for (let i in spells) {
    if (i === name) { gotstat = spells[i]; }
  }
  for (let i in userspells) {
    if (i === name) { gotstat = userspells[i]; }
  }
//  if (field === "filepath") { 
//    let statpath = gotstat[field];
//    statpath = statpath.replace("'","\\'");
//    return statpath;
//  }
  if (gotstat) {
    return gotstat[field];
  } else {
    return null;
  }
}

function EditStatusLists() { 
  let statusmod = "<form id='stats'>";
  statusmod = "<h3 style='text-align:center'>Statuses</h3><br /><table cellpadding='0' cellspacing='4' border='0'>";
  statusmod += MakeConditionTable(statuses, "statuses");
  statusmod += "<h3 style='text-align:center'>Abilities</h3><br /><table cellpadding='0' cellspacing='4' border='0'>";
  statusmod += MakeConditionTable(abilities, "abilities");
  statusmod += `<table cellpadding='0' cellspacing='4' border='0'>`;
  statusmod += MakeConditionTable(userabilities, "userabilities");
  statusmod += `<div style='text-align:center'><input type="button" value="Add Ability" onClick="PerformAddStatus('Ability')" /></div><br />`;
  statusmod += "<h3 style='text-align:center'>Spells</h3><br /><table cellpadding='0' cellspacing='4' border='0'>";
  statusmod += MakeConditionTable(spells, "spells");
  statusmod += `<table cellpadding='0' cellspacing='4' border='0'>`;
  statusmod += MakeConditionTable(userspells, "userspells");
  statusmod += `</form><div style='text-align:center'><input type="button" value="Add Spell" onClick="PerformAddStatus('Spell')" /></div>`
  document.getElementById('controlwindow').innerHTML = statusmod;
}

function MakeConditionTable(source, srcnm) {
  let statnum = 0;
  let statusmod = "";
  for (let status in source) {
    statnum++;
    if (statnum===10) { statnum=1; }
    if (statnum===1) { statusmod += "<tr>"; }
    let img = FindStatusByName(status);
    statusmod += `<td style="text-align:center;vertical-align:top"><img id="${status}_img" src="${img}" width="32"`;
    if (!FindStatusByName(status,"enabled")) { statusmod += " style='opacity:.6' "; }
    statusmod += `/><br />${status}<br /><input type="checkbox" name="chk_${status}" id="chk_${status}" `;
    if (FindStatusByName(status,"enabled")) { statusmod += "checked "; }    
    statusmod += ` onClick='toggleEnabled("${srcnm}", "${status}")' />`;
    if ((source === "userabilities") || (source === "userspells")) {
      statusmod += ` <img src="../ui/Square-Button-Delete.png" width="16" id='del_${status}' onClick="DeleteCondition(${status},${source})" />`;
    }
    statusmod += `</td>`;
    if (statnum===9) { statusmod += "</tr>";}
  }
  while (statnum < 9) {
    statusmod += "<td></td>";
    statnum++;
    if (statnum===9) { statusmod += "</tr>"; }
  }
  statusmod += "</table>";
  return statusmod;
}

function toggleEnabled(source,st) {
  if (source === "statuses") { 
    if (statuses[st].enabled) { 
      statuses[st].enabled = 0; 
      document.getElementById(st + "_img").style.opacity = .6;
    } else { 
      statuses[st].enabled = 1; 
      document.getElementById(st + "_img").style.opacity = 1;
    } 
  }
  else if (source === "abilities") { 
    if (abilities[st].enabled) { 
      abilities[st].enabled = 0; 
      document.getElementById(st + "_img").style.opacity = .6;
    } else { 
      abilities[st].enabled = 1; 
      document.getElementById(st + "_img").style.opacity = 1;
    } 
  }
  else if (source === "userabilities") { 
    if (userabilities[st].enabled) { 
      userabilities[st].enabled = 0; 
      document.getElementById(st + "_img").style.opacity = .6;
    } else { 
      userabilities[st].enabled = 1; 
      document.getElementById(st + "_img").style.opacity = 0;
    } 
  }
  else if (source === "spells") { 
    if (spells[st].enabled) { 
      spells[st].enabled = 0; 
      document.getElementById(st + "_img").style.opacity = .6;
    } else { 
      spells[st].enabled = 1; 
      document.getElementById(st + "_img").style.opacity = 0;
    } 
  }
  else if (source === "userspells") { 
    if (userspells[st].enabled) { 
      userspells[st].enabled = 0; 
      document.getElementById(st + "_img").style.opacity = .6;
    } else { 
      userspells[st].enabled = 1; 
      document.getElementById(st + "_img").style.opacity = 0;
    } 
  }
  else { console.log("Bad source."); }
}

function DeleteCondition(st,sta) {
  delete sta[st];
}

function PerformAddStatus(stattype) {
  let htmlpage = `<div style='text-align:center'><img src='../ui/noimg.png' width='64' id='statimg' onclick='PickStatImage()' /><br />
  <form id='addstatdetails' name='addstatdetails'>Name: <input type='text' name='addstatname' id='addstatname' /> <br />
  <select name='addstattype' id='addstattype'><option id='Ability' value='Ability'>Ability</option><option id='Spell' value="Spell">Spell</option></select><br />
  <input type='text' name='addstatdesc' id='addstatdesc' size='40' /><br />
  <input type='button' name='addstatsubmit' id='addstatsubmit' value='Submit' onClick='SubmitAddStatus()' /></form><br /><div id='errorsgohere' style='text-align:center;color:red'></div></div>`;

  document.getElementById('controlwindow').innerHTML = htmlpage;
  document.getElementById(stattype).selected = true;    

}

function PickStatImage(){
  dialog.showOpenDialog({ properties: ['openFile']}, function (fileNames) {
    if (fileNames === undefined) return;

    let fileName = fileNames[0];
    fileName = fileName.replace(/\\/g,"/");
    document.getElementById('statimg').src = fileName;

    
  });
}

function SubmitAddStatus() {
  let filename = document.getElementById('statimg').src;
  filename = filename.replace(/.*\/ui\//,"");
  if (filename === "noimg.png") {
    document.getElementById('errorsgohere').innerHTML = "Please select an image.";
    return;
  }
  document.getElementById('addstatname').value = document.getElementById('addstatname').value.replace(/^\s+/,"");
  document.getElementById('addstatname').value = document.getElementById('addstatname').value.replace(/\s+$/,"");
  if (document.getElementById('addstatname').value === "") {
    document.getElementById('errorsgohere').innerHTML = "Condition needs a name.";
    return;
  }
  if (FindStatusByName(document.getElementById('addstatname').value)) {
    document.getElementById('errorsgohere').innerHTML = "That name is already in use.";
    return;
  }
  let st = new condition(filename, document.getElementById('addstatdesc').value);
  if (document.getElementById('Ability').selected) { userabilities[document.getElementById('addstatname').value] = st; }
  else { userspells[document.getElementById('addstatname').value] = st; }  
  EditStatusLists();
}