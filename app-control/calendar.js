"use strict";
let calendar = {};
calendar.currentYear = "1491";
calendar.currentMonth = "6";
let showyear;  
let showmonth;
const maxmonths = 12; // for when I allow custom calendars

let moonphases = [];
// 0 is a leap year
moonphases[0] = [[0,1,2,2,3,3,4,4,5,6,6,7,7,7,8,8,9,10,10,11,11,12,12,13,14,14,14,15,15,16,16,16,0],
  [1,2,2,3,3,4,4,5,6,6,7,7,8,8,9,10,10,11,11,11,12,12,13,14,14,15,15,16,16,1,0,0],
  [2,2,3,3,3,4,4,5,6,6,7,7,7,8,8,9,10,10,11,11,12,12,13,14,14,15,15,15,16,16,0,0],
  [1,2,2,3,3,4,4,5,6,6,7,7,7,8,8,9,10,10,11,11,11,12,12,13,14,14,15,15,15,16,16,0],
  [1,2,2,3,3,4,4,5,6,6,7,7,8,8,9,10,10,11,11,11,12,12,13,14,14,15,15,15,16,16,0,0],
  [1,2,2,3,3,4,4,5,6,6,7,7,7,8,8,9,10,10,11,11,11,12,12,13,14,14,15,15,16,16,0,0],
  [1,2,2,3,3,4,4,4,5,6,6,7,7,8,8,9,10,10,11,11,11,12,12,13,14,14,14,15,15,16,16,16],
  [1,2,2,3,4,4,5,6,6,7,7,7,8,8,9,10,10,11,11,12,12,13,14,14,15,15,15,16,16,1,0,0],
  [2,2,3,3,3,4,4,5,6,6,7,7,8,8,9,10,10,11,11,11,12,12,13,14,14,15,15,16,16,1,2,0],
  [2,3,3,3,4,4,5,6,6,7,7,7,8,8,9,10,10,11,11,12,12,13,14,14,15,15,15,16,16,1,0,0],
  [2,2,3,3,4,4,5,6,6,7,7,7,8,8,9,10,10,11,11,11,12,12,13,14,14,15,15,16,16,1,2,0],
  [2,2,3,3,4,4,5,6,6,7,7,7,8,8,9,10,10,11,11,12,12,13,14,14,15,15,15,16,16,1,0,0]];
  
  moonphases[1] = [[0,2,2,3,3,4,4,5,6,6,7,7,7,8,8,9,10,10,11,11,11,12,12,13,14,14,15,15,16,16,1,2,0],
  [2,3,3,3,4,4,5,6,6,7,7,8,8,9,10,10,11,11,11,12,12,13,14,14,15,15,15,16,16,1,0,0],
  [2,2,3,3,4,4,5,6,6,7,7,7,8,8,9,10,10,11,11,12,12,13,14,14,15,15,15,16,16,1,0,0],
  [2,2,3,3,3,4,4,5,6,6,7,7,8,8,9,10,10,11,11,11,12,12,13,14,14,14,15,15,16,16,16,0],
  [1,2,2,3,4,4,5,6,6,7,7,7,8,8,9,10,10,11,11,12,12,13,14,14,15,15,15,16,16,1,0,0],
  [2,2,3,3,3,4,4,5,6,6,7,7,8,8,9,10,10,11,11,11,12,12,13,14,14,15,15,16,16,1,0,0],
  [2,2,3,3,3,4,4,5,6,6,7,7,7,8,8,9,10,10,11,11,12,12,13,14,14,14,15,15,16,16,16,0],
  [1,2,2,3,4,4,5,6,6,7,7,7,8,8,9,10,10,11,11,11,12,12,13,14,14,15,15,16,16,1,0,0],
  [2,2,3,3,3,4,4,5,6,6,7,7,8,8,9,10,10,11,11,11,12,12,13,14,14,14,15,15,16,16,16,0],
  [1,2,2,3,4,4,5,6,6,7,7,7,8,8,9,10,10,11,11,11,12,12,13,14,14,15,15,16,16,1,0,0],
  [2,2,3,3,3,4,4,5,6,6,7,7,8,8,9,10,10,11,11,11,12,12,13,14,14,14,15,15,16,16,16,0],
  [1,2,2,3,4,4,5,6,6,7,7,7,8,8,9,10,10,11,11,12,12,13,14,14,15,15,15,16,16,1,0,0]];
  
  moonphases[2] = [[0,2,2,3,3,3,4,4,5,6,6,7,7,8,8,9,10,10,11,11,11,12,12,13,14,14,15,15,16,16,1,2,0],
  [2,3,3,3,4,4,5,6,6,7,7,7,8,8,9,10,10,11,11,12,12,13,14,14,15,15,15,16,16,1,0,0],
  [2,2,3,3,4,4,5,6,6,7,7,7,8,8,9,10,10,11,11,11,12,12,13,14,14,15,15,16,16,1,0,0],
  [2,2,3,3,3,4,4,5,6,6,7,7,7,8,8,9,10,10,11,11,12,12,13,14,14,14,15,15,16,16,16,0],
  [1,2,2,3,4,4,5,6,6,7,7,7,8,8,9,10,10,11,11,11,12,12,13,14,14,15,15,16,16,1,0,0],
  [2,2,3,3,3,4,4,5,6,6,7,7,8,8,9,10,10,11,11,11,12,12,13,14,14,15,15,15,16,16,0,0],
  [1,2,2,3,3,4,4,5,6,6,7,7,7,8,8,9,10,10,11,11,12,12,13,14,14,14,15,15,16,16,16,0],
  [1,2,2,3,3,4,4,5,6,6,7,7,8,8,9,10,10,11,11,11,12,12,13,14,14,15,15,15,16,16,0,0],
  [1,2,2,3,3,4,4,5,6,6,7,7,7,8,8,9,10,10,11,11,12,12,13,14,14,14,15,15,16,16,16,0],
  [1,2,2,3,3,4,4,5,6,6,7,7,8,8,9,10,10,11,11,11,12,12,13,14,14,15,15,16,16,1,0,0],
  [2,2,3,3,3,4,4,5,6,6,7,7,7,8,8,9,10,10,11,11,12,12,13,14,14,14,15,15,16,16,16,0],
  [1,2,2,3,4,4,5,6,6,7,7,7,8,8,9,10,10,11,11,11,12,12,13,14,14,15,15,16,16,1,0,0]];
  
  moonphases[3] = [[0,2,2,3,3,3,4,4,5,6,6,7,7,8,8,9,10,10,11,11,11,12,12,13,14,14,14,15,15,16,16,16,0],
  [1,2,2,3,4,4,5,6,6,7,7,7,8,8,9,10,10,11,11,11,12,12,13,14,14,15,15,16,16,1,0,0],
  [2,2,3,3,3,4,4,5,6,6,7,7,8,8,9,10,10,11,11,11,12,12,13,14,14,15,15,15,16,16,0,0],
  [1,2,2,3,3,4,4,5,6,6,7,7,7,8,8,9,10,10,11,11,12,12,13,14,14,14,15,15,16,16,16,0],
  [1,2,2,3,3,4,4,5,6,6,7,7,8,8,9,10,10,11,11,11,12,12,13,14,14,15,15,16,16,1,0,0],
  [2,2,2,3,3,4,4,5,6,6,7,7,7,8,8,9,10,10,11,11,12,12,13,14,14,15,15,15,16,16,0,0],
  [1,2,2,3,3,4,4,5,6,6,7,7,7,8,8,9,10,10,11,11,11,12,12,13,14,14,15,15,15,16,16,0],
  [1,2,2,3,3,4,4,5,6,6,7,7,7,8,8,9,10,10,11,11,12,12,13,14,14,15,15,15,16,16,0,0],
  [1,2,2,3,3,4,4,5,6,6,7,7,7,8,8,9,10,10,11,11,11,12,12,13,14,14,15,15,15,16,16,0],
  [1,2,2,3,3,4,4,5,6,6,7,7,8,8,9,10,10,11,11,11,12,12,13,14,14,15,15,15,16,16,0,0],
  [1,2,2,3,3,4,4,5,6,6,7,7,7,8,8,9,10,10,11,11,12,12,13,14,14,14,15,15,16,16,16,0],
  [1,2,2,3,3,4,4,5,6,6,7,7,8,8,9,10,10,11,11,11,12,12,13,14,14,15,15,15,16,16,0,0]];

let monthnames = ["","Hammer","Alturiak","Ches","Tarsahk","Mirtul","Kythorn","Flamerule","Eleasis","Elient","Marpenoth","Uktar","Nightal"];
let commonmonthnames = ["","Deepwinter","The Claw of Winter","The Claw of Sunsets","The Claw of Storms","The Melting","The Time of Flowers","Summertide","Highsun","The Fading","Leaffall","The Rotting","The Drawing Down"];

function CheckLeap(year) {
  year = parseInt(year);
  if (Math.round(year/4) === (year/4)) { 
    return 1;
  }
}  

function GetMoonPhase(year,month,day) {
  let yr = year % 4;
  return moonphases[yr][month][day];
}

function ShowCalendar() {
  showmonth = calendar.currentMonth;
  showyear = calendar.currentYear;
  DisplayCalendar();
}

function DisplayCalendar() {
  let calhtml = `<p style='text-align: center;width:90%'><img src='../ui/Square-Button-Left.png' width='32' onClick='ChangeMonth(-1)' style='float:left' /><img src='../ui/Square-Button-Play.png' width='32' onClick='ChangeMonth(1)' style='float:right' /><span style='font-size:larger;font-weight:bold'>${monthnames[showmonth]} (${commonmonthnames[showmonth]}): ${showyear}</span><br /><span style='font-style:italic'>${yearNames[showyear]}</span></p>`;
  calhtml += `<table style='width:95%' cellpadding='1' cellspacing='0' border='1'>`;
  for (let i=0;i<=2;i++) {
    calhtml += `<tr>`;
    for (let j=1;j<=10;j++) {
      let day = 10*i+j;
      let content = "";
      if (calendar[showyear]) {
        if (calendar[showyear][showmonth]) {
          if (calendar[showyear][showmonth][day]){
            if (calendar[showyear][showmonth][day]["notes"]) { content = "X"; }
          }
        }
      }
      calhtml += `<td style='width:9%; text-align:center' onClick='ExpandDay(${day},${showmonth},${showyear})'>${day}<br />${content}</td>`
    }
    calhtml += '</tr>'
  }
  calhtml += '</table>';
  document.getElementById('controlwindow').innerHTML = calhtml;
}

function ChangeMonth(cv) {
  showmonth += cv;
  if (showmonth === 0) {
    showmonth = maxmonths;
    showyear--;
  } else if (showmonth > maxmonths) {
    showmonth = 1; 
    showyear++;
  }
  DisplayCalendar();
}

function ExpandDay(day,month,year) {
  document.getElementById('othermod').style.display = "block";
  window.addEventListener('click', WindowOnclickGeneric);

  let mp = GetMoonPhase(year,month,day);
  let wea = ""  // will be weather

  let notes = "";
  if (calendar[year]) {
    if (calendar[year][month]) {
      if (calendar[year][month][day]) {
        notes = calendar[year][month][day]["notes"];
      }
    }
  }
  document.getElementById('othermodcontent').innerHTML = `
  <p style='font-weight:bold;font-size: large'>${day} <img src='../ui/moons/moon_${mp}.jpg' style='float:right' /></p>
  <textarea style='text-align:center' name='daynotes' id='daynotes' width='45' height='20'>${notes}</textarea>
  `;
  
}

function WindowOnclickGeneric(e) {
  if (e.target === document.getElementById('othermod')) { 
    CancelCalendar();
  }
}


function CancelCalendar() {
  window.removeEventListener('click', WindowOnclickGeneric);
  document.getElementById('othermod').style.display = "none";
  document.getElementById('othermodcontent').innerHTML = '';
}
