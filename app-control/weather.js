"use strict;"

function create_weather() {
  console.log("in create weather");
  document.getElementById('controlwindow').innerHTML = `<div id='weatherpane'></div><div id='weathercontrol'></div>`;
  ShowWeatherPatterns();
  CreateWeathervane();
}

function ShowWeatherPatterns() {
  let table = `<h3 style='text-align:center'>Weather Determination (Dragon Magazine #137, pg 36)</h3>
  <table cellpadding='0' cellspacing='3' border='0' style='font-size:small'>
  <tr><th style='font-weight:bold'>Terrain type</th><th style='font-weight:bold'>Where located</th><th style='font-weight:bold'>Latitude range</th><th style='font-weight:bold'>Climate category</th></tr>
  <tr><td>Broken land</td><td>Inland</td><td>0-20&deg;</td><td>Desert</td></tr>
  <tr><td></td><td>Inland</td><td>21-40&deg;</td><td>Warm with dry winter</td></tr>
  <tr><td></td><td>Inland</td><td>41-70&deg;</td><td>Cool &amp; rainy</td></tr>
  <tr><td></td><td>Inland</td><td>71-90&deg;</td><td>Polar</td></tr>
  <tr><td></td><td>Coastal</td><td>0-20&deg;</td><td>Desert</td></tr>
  <tr><td></td><td>Coastal</td><td>21-50&deg;</td><td>Warm &amp rainy, or warm with dry summer</td></tr>
  <tr><td></td><td>Coastal</td><td>51-70&deg;</td><td>Cool with dry winter</td></tr>
  <tr><td></td><td>Coastal</td><td>71-90&deg;</td><td>Tundra</td></tr>
  <tr><td>Desert</td><td>All</td><td>0-30&deg;</td><td>Desert</td></tr>
  <tr><td></td><td>All</td><td>31-90&deg;</td><td>-</td></tr>
  <tr><td>Forest</td><td>All</td><td>0-20&deg;</td><td>Tropical savanna</td></tr>
  <tr><td></td><td>Inland</td><td>21-50&deg;</td><td>Warm with dry winter</td></tr>
  <tr><td></td><td>Inland</td><td>51-70&deg;</td><td>Cool &amp; rainy</td></tr>
  <tr><td></td><td>Coastal</td><td>21-50&deg;</td><td>Warm &amp; rainy, or warm with dry summer</td></tr>
  <tr><td></td><td>Coastal</td><td>51-70&deg;</td><td>Cool with dry winter</td></tr>
  <tr><td></td><td>All</td><td>71-90&deg;</td><td>-</td></tr>
  <tr><td>Grassland</td><td>All</td><td>0-20&deg;</td><td>Tropical savanna</td></tr>
  <tr><td>(also Clear)</td><td>Inland</td><td>21-50&deg;</td><td>Steppe</td></tr>
  <tr><td></td><td>Inland</td><td>51-70&deg;</td><td>Cool &amp; rainy</td></tr>
  <tr><td></td><td>Coastal</td><td>21-50&deg;</td><td>Warm &amp; rainy, or warm with dry summer</td></tr>
  <tr><td></td><td>Coastal</td><td>51-70&deg;</td><td>Cool with dry winter</td></tr>
  <tr><td></td><td>All</td><td>71-90&deg;</td><td>Tundra, or polar</td></tr>
  <tr><td>Hills</td><td>Inland</td><td>0-20&deg;</td><td>Tropical savanna</td></tr>
  <tr><td></td><td>Inland</td><td>21-40&deg;</td><td>Warm with dry winter</td></tr>
  <tr><td></td><td>Inland</td><td>41-70&deg;</td><td>Cool &amp; rainy</td></tr>
  <tr><td></td><td>Inland</td><td>71-90&deg;</td><td>Polar</td></tr>
  <tr><td></td><td>Coastal</td><td>0-20&deg;</td><td>Tropical savanna</td></tr>
  <tr><td></td><td>Coastal</td><td>21-50&deg;</td><td>Warm &amp; rainy, or warm with dry summer</td></tr>
  <tr><td></td><td>Coastal</td><td>51-70&deg;</td><td>Cool with dry winter</td></tr>
  <tr><td></td><td>Coastal</td><td>71-90&deg;</td><td>Tundra</td></tr>
  <tr><td>Jungle</td><td>Inland</td><td>0-20&deg;</td><td>Equatorial</td></tr>
  <tr><td></td><td>Coastal</td><td>0-20&deg;</td><td>Monsoon</td></tr>
  <tr><td></td><td>Coastal</td><td>21-90&deg;</td><td>(Treat as forest)</td></tr>
  <tr><td>Mountains</td><td>All</td><td>0-20&deg;</td><td>Warm with dry summer, or warm &amp; rainy</td></tr>
  <tr><td></td><td>Inland</td><td>21-40&deg;</td><td>Warm with dry winter</td></tr>
  <tr><td></td><td>Inland</td><td>41-70&deg;</td><td>Cool &amp; rainy</td></tr>
  <tr><td></td><td>Inland</td><td>71-90&deg;</td><td>Polar</td></tr>
  <tr><td></td><td>Coastal</td><td>21-40&deg;</td><td>Warm &amp; rainy, or warm with dry summer</td></tr>
  <tr><td></td><td>Coastal</td><td>41-70&deg;</td><td>Cool with dry winter</td></tr>
  <tr><td></td><td>Coastal</td><td>71-90&deg;</td><td>Tundra</td></tr>
  <tr><td>Swamp</td><td>Inland</td><td>0-20&deg;</td><td>Equatorial</td></tr>
  <tr><td></td><td>Inland</td><td>21-40&deg;</td><td>Warm with dry summer</td></tr>
  <tr><td></td><td>Coastal</td><td>0-20&deg;</td><td>Monsoon</td></tr>
  <tr><td></td><td>Coastal</td><td>21-40&deg;</td><td>Warm &amp; rainy</td></tr>
  <tr><td></td><td>All</td><td>41-90&deg;</td><td>(as per surrounding terrain)</td></tr>
  </table>
  `;
  document.getElementById('weatherpane').innerHTML = table;
}

function CreateWeathervane() {
  let html = `<p>Select climate: <select id='climateselect' name='climateselect'>
    <option value='cool and rainy'>Cool &amp; Rainy</option>
    <option value='cool with dry winter'>Cool with Dry Winter</option>
    <option value='desert'>Desert</option>
    <option value='equatorial'>Equatorial</option>
    <option value='monsoon'>Monsoon</option>
    <option value='polar'>Polar</option>
    <option value='steppes'>Steppes</option>
    <option value='tropical savanna'>Tropical Savanna</option>
    <option value='tundra'>Tundra</option>
    <option value='warm and rainy'>Warm &amp; Rainy</option>
    <option value='warm with dry summer'>Warm with Dry Summer</option>
    <option value='warm with dry winter'>Warm with Dry Winter</option>
    </select><br />
    Hemisphere: <select id='hemisphereselect' name='hemisphereselect'><option value='N'>North</option><option value='S'>South</option></select><br />
    Month-equivalent: <select id="monthselect" name="monthselect">
    <option value=1>January</option>
    <option value=2>February</option>
    <option value=3>March</option>
    <option value=4>April</option>
    <option value=5>May</option>
    <option value=6>June</option>
    <option value=7>July</option>
    <option value=8>August</option>
    <option value=9>September</option>
    <option value=10>October</option>
    <option value=11>November</option>
    <option value=12>December</option>
    </select><br />
    <input type="checkbox" name="PotA" id="PotA" /> PotA Elemental Influence<br />
    <input type="button" value="Generate Weather (Day)" onclick="GenWeather()" /> <input type="button" value="Generate Weather (Month)" onclick="GenWeather('month')" /></p>`;

  document.getElementById('weathercontrol').innerHTML = html;
} 

function GenWeather(dur) {  
  if (!dur) {
    // one day
    let weather = CreateWeather();
    console.log(weather);
    let windroll = '1d6';
    if (weather.rain) {
      let raintype = Dice.roll("1d12");
      if ((raintype >= 1) && (raintype <= 2)) {
        let fog = Dice.roll("1d10");
        let fogdesc = "";
        if (fog === 1) { fogdesc = "(Fog if temp greater than 32&deg;)"; }
        weather.raindesc = `Light mist ${fogdesc}/Few flakes`;
        windroll = "1d4";
      } else if ((raintype >= 3) && (raintype <= 5)) {
        let fog = Dice.roll("1d10");
        let fogdesc = "";
        if (fog === 1) { fogdesc = "(Fog if temp greater than 32&deg;)"; }
        weather.raindesc = `Drizzle ${fogdesc}/Dusting`;
        windroll = "1d6";
      } else if ((raintype >=6) && (raintype <= 8)) {
        weather.raindesc = `Steady rainfall/Flurries`;
        windroll = "2d4";
      } else if ((raintype >=9) && (raintype <= 10)) {
        weather.raindesc = `Strong rainfall/Moderate Snowfall`;
        windroll = "2d6";
      } else if (raintype === 11) {
        let roll = Dice.roll("1d100");
        let thunder = "";
        if (roll <= 15) { thunder = " (Thunderstorm)"; }
        weather.raindesc = `Pounding Rain${thunder}/Heavy Snowfall`;
        windroll = "2d8";
      } else if (raintype === 12) {
        let roll = Dice.roll("1d100");
        let thunder = "";
        if (roll <= 15) { thunder = " (Thunderstorm)"; }
        roll = Dice.roll("1d100");
        let hail = "";
        if (roll <= 20) { hail = " (Inc hail)"; }
        weather.raindesc = `Downpour${thunder}/Blizzard${hail}`;
        windroll = "2d10";
      }
    }
    console.log(windroll);
    let winddesc = GetWind(windroll);    
    if (!weather.rain) {
      let roll = Dice.roll("1d12");
      if (roll <= 3) { weather.raindesc = "Clear skies." }
      else if ((roll >= 4) && (roll <= 6)) { weather.raindesc = "A few clouds." }
      else if ((roll >= 7) && (roll <= 8)) { weather.raindesc = "Mostly cloudy." }
      else if ((roll >= 9) && (roll <= 10)) { weather.raindesc = "Gray, lightly overcast." }
      else if (roll === 11) { weather.raindesc = "Gray, heavily overcast." }
      else if (roll === 12) {  
        weather.raindesc = "Dark storm clouds.";
        if (Dice.roll("1d10") === 1) { weather.raindesc += " (Some dry lightning.)"; } 
      }
    }
    let magic = "";
    if (document.getElementById("PotA").checked) {
      if (Dice.roll("1d20") <= 3) {
        if (Dice.roll("1d2") === 1) { magic += "Unseasonably hot. "; }
        else { magic = "Unseasonably cold."; }
      }
      if (Dice.roll("1d20") <= 3) { magic += "Intense storms. "; }
      if (Dice.roll("1d20") <= 3) { magic += "Earthquakes."; }
    }
    document.getElementById("weatherpane").innerHTML = `Temperature: ${weather.mintemp} - ${weather.maxtemp}<br />
                                                        ${weather.raindesc}<br />
                                                        ${winddesc}<br /><span style='color:red'>${magic}</span>`;
  }
}

function GetWind(windroll) {
  windroll = Dice.roll(windroll);
  if (windroll === 1) { return "Calm (<1 mph- smoke rises vertically)"; }
  if ((windroll >= 2) && (windroll <= 3)) { return "Light air (1-3 mph- wind direction shown by smoke but not wind vanes)"; }
  if ((windroll >= 4) && (windroll <= 5)) { return "Light breeze (4-7 mph- wind felt on face, leaves rustles, and ordinary vanes move)"; }
  if ((windroll >= 6) && (windroll <= 7)) { return "Gentle breeze (8-12 mph- leaves and small twigs sway and banners flap)"; }
  if ((windroll >= 8) && (windroll <= 9)) { return "Moderate breeze (13-18 mph- small branches move, and dust and small branches are raised)"; }
  if ((windroll >= 10) && (windroll <= 11)) { return "Fresh breeze (19-24 mph- small trees sway and small waves form on inland waters)"; }
  if ((windroll >= 12) && (windroll <= 13)) { return "Strong breeze (25-31 mph- large branches move)"; }
  if ((windroll >= 14) && (windroll <= 15)) { return "Moderate gale (or near gale) (32-38 mph- whole trees sway and walking against wind is an inconvenience)"; }
  if ((windroll >= 16) && (windroll <= 17)) { return "Fresh gale (or gale) (39-46 mph- twigs break off trees and general progress is impeded)"; }
  if (windroll === 18) { return "Strong gale (47-54 mph- slight structural damage occurs)"; }
  if (windroll === 19) { return "Whole gale (or storm) (55-63 mph- trees are uprooted and considerable structural damage occurs)"; }
  if (windroll === 20) {
    if (Dice.roll("1d10") <= 8) {
      return "Storm (or violent storm) (64-72 mph- widespread damage occurs)";
    } else {
      return "Hurricane (73-136 mph- widespread devastation occurs)";
    }
  }
}

function CreateWeather() {
  let climatesel = document.getElementById('climateselect');
  let climate = climatesel[climatesel.selectedIndex].value;
  let hemisel = document.getElementById('hemisphereselect');
  let hemi = hemisel[hemisel.selectedIndex].value;
  let monthsel = document.getElementById('monthselect');
  let month = monthsel[monthsel.selectedIndex].value;
  console.log(`${climate} ${hemi} ${month}`);

  let mintemp;
  let maxtemp;
  let tempdesc;
  let winds;
  let rain = 0;

  if ((climate === "cool and rainy") || (climate === "cool with dry winter")) {
    if ( (((month >=7) && (month) <=9) && (hemi === "N")) || (((month >=1) && (month) <=3) && (hemi === "S")) ) { 
      // summer
      let roll = Math.floor(Math.random() * 100) + 1;
      if (roll <= 5) {
        mintemp = 60;
        maxtemp = 60;
      } else if (roll <= 50) {
        mintemp = 65;
        maxtemp = 70;
      } else if (roll <= 95) {
        mintemp = 70;
        maxtemp = 75;
      } else {
        mintemp = 85;
        maxtemp = 85;
      }
    } else if ( ((month === 10) && (hemi === "N")) || ((month === 4) && (hemi === "S")) || ((month >= 3) && (month <= 6) && (hemi === "N")) || ((month >= 9) && (month <= 12) && (hemi ==="S")) ) {
      // spring/fall
      let roll = Math.floor(Math.random() * 100) + 1;
      if (roll <= 5) {
        mintemp = 35;
        maxtemp = 35;
      } else if (roll <= 50) {
        mintemp = 40;
        maxtemp = 50;
      } else if (roll <= 95) {
        mintemp = 50;
        maxtemp = 60;
      } else {
        mintemp = 65;
        maxtemp = 65;
      }
    } else {
      // winter
      let roll = Math.floor(Math.random() * 100) + 1;
      if (roll <= 5) {
        mintemp = 5;
        maxtemp = 5;
      } else if (roll <= 50) {
        mintemp = 15;
        maxtemp = 25;
      } else if (roll <= 95) {
        mintemp = 25;
        maxtemp = 32;
      } else {
        mintemp = 40;
        maxtemp = 40;
      }
    }
    roll = Math.floor(Math.random() * 100) + 1;
    if ((roll <= 35) && (climate === "cool and rainy")) {
      rain = 1;
    } else if ( (roll <= 35) && (((month >= 7) && (month <= 9) && (hemi === "N")) || ((month <= 3) && (hemi === "S"))) ) {
      rain = 1;
    } else if ( (roll <= 10) && (((month >= 5) && (month <= 10) && (hemi === "S")) || (((month <= 5) || (month >= 11)) && (hemi === "N"))) ) {
      rain = 1;
    } else if (roll <= 20) {
      rain = 1;
    }
  } else if (climate === "desert") {
    if ( (((month ===1) || (month === 12)) && (hemi ==="N")) || ((month >= 5) && (month <= 6) && (hemi === "S")) ) {
      // winter
      let roll = Math.floor(Math.random() * 100) + 1;
      if (roll <= 5) {
        mintemp = 55;
        maxtemp = 55;
      } else if (roll <= 95) {
        mintemp = 65;
        maxtemp = 65;
      } else {
        mintemp = 70;
        maxtemp = 70;
      }
    } else {
      // fall/spring/summer
      let roll = Math.floor(Math.random() * 100) + 1;
      if (roll <= 5) {
        mintemp = 65;
        maxtemp = 65;
      } else if (roll <= 95) {
        mintemp = 70;
        maxtemp = 90;
      } else {
        mintemp = 110;
        maxtemp = 110;
      }
    }
    roll = Math.floor(Math.random() * 100) + 1;
    if (roll <= 5) {
      rain = 1;
    }
  } else if (climate ==="equatorial") {
    // year-round
    let roll = Math.floor(Math.random() * 100) + 1;
    if (roll <= 5) {
      mintemp = 60;
      maxtemp = 60;
    } else if (roll <= 95) {
      mintemp = 70;
      maxtemp = 85;
    } else {
      mintemp = 100;
      maxtemp = 100;
    }

    roll = Math.floor(Math.random() * 100) + 1;
    if ((roll <= 50) && (month >= 3) && (month <=5)) {
      rain = 1;
    } else if ((roll <= 40) && (month >= 6)) { 
      rain = 1;
    } else if ((roll <= 30) && (month <= 2)) { 
      rain = 1;
    }
  } else if (climate === "monsoon") {
    // year-round
    let roll = Math.floor(Math.random() * 100) + 1;
    if (roll <= 5) {
      mintemp = 70;
      maxtemp = 70;
    } else if (roll <= 50) {
      mintemp = 85;
      maxtemp = 100;
    } else if (roll <= 95) {
      mintemp = 100;
      maxtemp = 110;
    } else {
      mintemp = 120;
      maxtemp = 120;
    }
    roll = Math.floor(Math.random() * 100) + 1;
    if ((month >= 6) && (month <= 10)) {
      if (roll <= 90) { rain = 1; }
    } else {
      if (roll <= 15) { rain = 1; }
    }

  } else if (climate === "polar") {
    let roll = Math.floor(Math.random() * 100) + 1;
    if ( ((month >=6) && (month <= 7) && (hemi = "N")) || (((month === 1) || (month === 12)) && (hemi === "S")) ) {
      // summer
      if (roll <= 5) {
        mintemp = 32;
        maxtemp = 32;
      } else if (roll <= 50) {
        mintemp = 35;
        maxtemp = 40;
      } else if (roll <= 95) {
        mintemp = 40;
        maxtemp = 50;
      }
      else {
        mintemp = 65;
        maxtemp = 65;
      }
    } else if ( ((month >= 8) && (month <= 11)) || ((month >= 2) && (month <= 5)) )  {
    // spring/fall
      if (roll <= 5) {
        mintemp = 25;
        maxtemp = 25;
      } else if (roll <= 50) {
        mintemp = 30;
        maxtemp = 30;
      } else if (roll <= 95) { 
        mintemp = 32;
        maxtemp = 32;
      } else {
        mintemp = 40;
        maxtemp = 40;
      }
    } else {
      //winter
      if (roll <= 5) {
        mintemp = -35;
        maxtemp = -35;
      } else if (roll <= 50) {
        mintemp = -25;
        maxtemp = 0;
      } else if (roll <=95) {
        mintemp = 0;
        maxtemp = 30;
      } else {
        mintemp = 32;
        maxtemp = 32;
      }
    }
    roll = Math.floor(Math.random() * 100) + 1;
    if (roll <= 10) {
      rain = 1;
    }
  } else if (climate === "steppes") {
    let roll = Math.floor(Math.random() * 100) + 1;
    if ( ((month >= 6) && (month <= 8) && (hemi === "N")) || ((month === 12) && (hemi === "S")) || ((month <=2) && (hemi === "S")) ) {
      // summer
      if (roll <= 5) {
        mintemp = 70;
        maxtemp = 70;
      } else if (roll <= 95) {
        mintemp = 85;
        maxtemp = 95;
      } else {
        mintemp = 110;
        maxtemp = 110;
      }
    } else if ( ((month >= 9) && (month <= 11)) || ((month >= 3) && (month <= 5)) ) {
      // spring/fall
      if (roll <= 5) {
        mintemp = 50;
        maxtemp = 50;
      } else if (roll <= 95) {
        mintemp = 60;
        maxtemp = 70;
      } else {
        mintemp = 80;
        maxtemp = 80;
      }
    } else {
      // winter
      if (roll <= 5) {
        mintemp = 35;
        maxtemp = 35;
      } else if (roll <= 95) {
        mintemp = 40;
        maxtemp = 45;
      } else {
        mintemp = 50;
        maxtemp = 50;
      }
    }
    roll = Math.floor(Math.random() * 100) + 1;
    if ( ((month >= 7) && (month <= 9) && (hemi === "N")) || ((month <= 3) && (hemi ==="S")) ) {
      if (roll <= 5) { rain = 1; }
    } else {
      if (roll <= 20) { rain = 1; }
    }
  } else if (climate === "tropical savanna") {
    let roll = Math.floor(Math.random() * 100) + 1;
    if (roll <= 5) {
      mintemp = 75;
      maxtemp = 75;
    } else if (roll <= 95) {
      mintemp = 90;
      maxtemp = 105;
    } else {
      mintemp =  115;
      maxtemp = 115;
    }
    roll = Math.floor(Math.random() * 100) + 1;
    if ((month >= 5) && (month <= 9) && (roll <= 85)) { rain = 1; }
    else if ((month === 4) || (month === 10)) { 
      if (roll <= 35) { rain = 1; }
    } else if ((month >= 11) || (month <= 3)) {
      if (roll <= 10) { rain = 1; }
    }
  } else if (climate === "tundra") {
    let roll = Math.floor(Math.random() * 100) + 1;
    if ( ((month >= 6) && (month <= 7) && (hemi = "N")) || (((month === 12) || (month === 1)) && (hemi === "S"))) {
      // summer
      if (roll <= 5) {
        mintemp = 32;
        maxtemp = 32;
      } else if (roll <= 50) {
        mintemp = 35;
        maxtemp = 40;
      } else if (roll <= 95) {
        mintemp = 40;
        maxtemp = 50;
      } else {
        mintemp = 65;
        maxtemp = 65;
      }
    } else if ( ((month >= 2) && (month <= 5)) || ((month >= 8) && (month <= 11)) ) {
      // spring/fall
      if (roll <= 5) {
        mintemp = 10;
        maxtemp = 10;
      } else if (roll <= 50) {
        mintemp = 15;
        maxtemp = 20;
      } else if (roll <= 95) {
        mintemp = 25;
        maxtemp = 32;
      } else {
        mintemp = 35;
        maxtemp = 35;
      }
    } else {
      // winter
      if (roll <= 5) {
        mintemp = -15;
        maxtemp = -15;
      } else if (roll <= 50) {
        mintemp = -5;
        maxtemp = 15;
      } else if (roll <= 95) {
        mintemp = 15;
        maxtemp = 32;
      } else {
        mintemp = 35;
        maxtemp = 35;
      }
    }
    roll = Math.floor(Math.random() * 100) + 1;
    if (roll <= 10) { rain = 1; }
  } else if (climate === "warm and rainy") {
    let roll = Math.floor(Math.random() * 100) + 1;
    if ( ((month >= 6) && (month <= 9) && (hemi === "N")) || (((month === 12) || (month <= 3)) && (month === "S")) ) {
      // summer
      if (roll <= 5) {
        mintemp = 60;
        maxtemp = 60;
      } else if (roll <= 50) {
        mintemp = 65;
        maxtemp = 70;
      } else if (roll <= 95) {
        mintemp = 70;
        maxtemp = 75;
      } else {
        mintemp = 85;
        maxtemp = 85;
      }
    } else if ( ((month === 10) && (hemi === "N")) || ((month >= 3) && (month <= 5) && (hemi === "N")) || ((month === 4) && (hemi === "S")) || ((month >= 9) && (month <= 11) && (hemi === "S")) ) {
      // spring/fall
      if (roll <= 5) {
        mintemp = 40;
        maxtemp = 40;
      } else if (roll <= 50) {
        mintemp = 50;
        maxtemp = 50;
      } else if (roll <= 95) {
        mintemp = 60;
        maxtemp = 60;
      } else {
        mintemp = 65;
        maxtemp = 65;
      }
    } else { 
      // winter
      if (roll <= 5) {
        mintemp = 10;
        maxtemp = 10;
      } else if (roll <= 50) {
        mintemp = 25;
        maxtemp = 32;
      } else if (roll <= 95) {
        mintemp = 33;
        maxtemp = 45;
      } else {
        mintemp = 50;
        maxtemp = 50;
      }
    }
    roll = Math.floor(Math.random() * 100) + 1;
    if (roll <= 40) { rain = 1; }
  } else if (climate === "warm with dry summer") {
    let roll = Math.floor(Math.random() * 100) + 1;
    if ( ((month >= 5) && (month <= 9) && (hemi === "N")) || ((month >= 11) && (month <= 12) && (hemi === "S")) || ((month <= 3) && (hemi === "S")) ) {
      if (roll <= 5) {
        mintemp = 60;
        maxtemp = 60;
      } else if (roll <= 50) {
        mintemp = 65;
        maxtemp = 70;
      } else if (roll <= 95) {
        mintemp = 70;
        maxtemp = 85;
      } else {
        mintemp = 95;
        maxtemp = 95;
      }
    } else if ( ((month >= 10) && (month <= 11) && (hemi === "N")) || ((month >= 3) && (month <= 4) && (hemi === "N")) || ((month >= 4) && (month <= 5) && (hemi === "S")) || ((month >= 9) && (month <= 10) && (hemi ==="S")) ) {
      if (roll <= 5) {
        mintemp = 50;
        maxtemp = 50;
      } else if (roll <= 50) {
        mintemp = 60;
        maxtemp = 60;
      } else if (roll <= 95) {
        mintemp = 65;
        maxtemp = 65;
      } else {
        mintemp = 70;
        maxtemp = 70;
      }
    } else { 
      if (roll <= 5) {
        mintemp = 10;
        maxtemp = 10;
      } else if (roll <= 50) {
        mintemp = 20;
        maxtemp = 32;
      } else if (roll <= 95) {
        mintemp = 35;
        maxtemp = 50;
      } else {
        mintemp = 60;
        maxtemp = 60;
      }
    }
    roll = Math.floor(Math.random() * 100) + 1;
    if ( ((month >= 6) && (month <= 8) && (hemi === "N")) || ((month === 12) && (hemi === "S")) || ((month <= 2) && (hemi === "S")) ) {
      if (roll <= 10) { rain = 1; }
    } else {
      if (roll <= 30) { rain = 1; }
    }
  } else if (climate === "warm with dry winter") {
    let roll = Math.floor(Math.random() * 100) + 1;
    if ( ((month >= 6) && (month <= 7) && (hemi === "N")) || ((month === 12) && (hemi === "S")) || ((month === 1) && (hemi === "S")) ) {
      if (roll <= 5) { 
        mintemp = 70;
        maxtemp = 70;
      } else if (roll <= 95) {
        mintemp = 85;
        maxtemp = 90;
      } else {
        mintemp = 110;
        maxtemp = 110;
      }
    } else if ( ((month >= 8) && (month <= 10) && (hemi === "N")) || ((month >= 3) && (month <= 5) && (hemi === "N")) || ((month >= 2) && (month <= 4) && (hemi === "S")) || ((month >= 9) && (month <= 11) && (hemi === "S")) ) {
      if (roll <= 5) {
        mintemp = 50;
        maxtemp = 50;
      } else if (roll <= 95) {
        mintemp = 60;
        maxtemp = 65;
      } else {
        mintemp = 70;
        maxtemp = 70;
      }
    } else {
      if (roll <= 5) {
        mintemp = 32;
        maxtemp = 32;
      } else if (roll <= 95) {
        mintemp = 35;
        maxtemp = 45;
      } else {
        mintemp = 50;
        maxtemp = 50;
      }
    }
    roll = Math.floor(Math.random() * 100) + 1;
    if ( ((month >= 7) && (month <= 8) && (hemi === "N")) || ((month <= 2) && (hemi === "S")) ) {
      if (roll <= 45) { rain = 1; }
    } else {
      if (roll <= 15) { rain = 1; }
    }
  } else {
    console.log("Bad climate: " + climate);
    return;
  }

  return {mintemp: mintemp, maxtemp: maxtemp, rain: rain};
}