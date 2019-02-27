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