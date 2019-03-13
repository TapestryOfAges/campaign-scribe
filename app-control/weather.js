"use strict;"

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
  <tr><td>(also Clear)</td><td>Inland</td><td>21-50&amp;</td><td>Steppe</td></tr>
  <tr><td></td><td>Inland</td><td>51-70&amp;</td><td>Cool &amp; rainy</td></tr>
  <tr><td></td><td>Coastal</td><td>21-50&amp;</td><td>Warm &amp; rainy, or warm with dry summer</td></tr>
  <tr><td></td><td>Coastal</td><td>51-70&amp;</td><td>Cool with dry winter</td></tr>
  <tr><td></td><td>All</td><td>71-90&amp;</td><td>Tundra, or polar</td></tr>
  <tr><td>Hills</td><td>Inland</td><td>0-20&amp;</td><td>Tropical savanna</td></tr>
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
    Hemisphere: <select id='hemisphereselect' name='hemisphereselect'><option value='n'>North</option><option value='s'>South</option></select><br />
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
    <input type="button" onclick="CreateWeather()" /></p>`;

  document.getElementById('weathercontrol').innerHTML = html;
} 

function CreateWeather() {
  let climatesel = document.getElementById('climateselect');
  let climate = climatesel[climatesel.selectedIndex].value;
  let hemisel = document.getElementById('hemisphereselect');
  let hemi = hemisel[hemisel.selectedIndex].value;
  let monthsel = document.getElementById('monthselect');
  let month = monthsel[monthsel.selectedIndex].value;

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
  }
}