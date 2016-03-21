"use strict";
var GameResources = (function () {
  var resources = {
    tilesets : [
      {name:'tileset_water', width:16, height:12},
      {name:"tileset_floor", width:16, height:12},
      {name:"tileset_exterior_buildings", width:16, height:8},
      {name:"tileset_exterior_general", width:16, height:15},
      {name:"tileset_interior_general", width:16, height:15},
      {name:"tileset_exterior_general2", width:8, height:16},
      {name:"tileset_interior_appartments", width:8, height:16},
      {name:"tileset_exterior_city", width:16, height:16},
      {name:"tileset_interior_modern_appartments", width:16, height:16},
      {name:"tileset_exterior_stairs", width:16, height:16},
      {name:"tileset_interior_office", width:16, height:16},
      {name:"tileset_exterior_window_doors", width:16, height:16},
      {name:"tileset_interior_delapidated", width:16, height:16},
      {name:"tileset_exterior_nature", width:16, height:16},
      {name:"tileset_interior_extra", width:16, height:16},
    ],

    levels : [
      {"name":"Room1","exit":{"x2":580,"x1":520,"y1":580,"y2":690},"width":16,"height":12,"layers":4,"tiles":[[[6,35],[6,35],[6,35],[6,35],[6,35],[6,35],[6,35],[6,35],[6,35],[6,35],[6,35],[6,35],[6,35],[6,35],[6,35],[6,35],[6,43],[6,43],[6,43],[6,43],[6,43],[6,43],[6,43],[7,190],[6,43],[6,43],[6,43],[6,43],[6,43],[6,43],[6,43],[6,43],[6,81],[6,81],[6,81],[6,81],[6,81],[6,81],[6,81],[6,81],[6,81],[6,81],[6,81],[6,86],[6,86],[6,86],[6,86],[6,86],[6,81],[6,81],[6,81],[6,81],[6,81],[6,81],[6,81],[6,81],[6,81],[6,81],[6,81],[6,94],[6,94],[6,94],[6,94],[6,94],[6,81],[6,81],[6,81],[6,81],[6,81],[6,81],[6,81],[6,81],[6,81],[6,81],[6,81],[6,81],[6,81],[6,81],[6,81],[6,81],[6,81],[6,81],[6,81],[6,81],[6,81],[6,81],[6,81],[6,81],[6,81],[6,81],[6,81],[6,81],[6,81],[6,81],[6,81],[6,81],[6,81],[6,81],[6,81],[6,81],[6,81],[6,81],[6,81],[6,81],[6,81],[6,81],[6,81],[6,81],[6,81],[6,81],[6,81],[6,81],[6,81],[6,81],[6,81],[6,81],[6,81],[6,81],[6,81],[6,81],[6,81],[6,81],[6,81],[6,81],[6,81],[6,81],[6,81],[6,48],[6,81],[6,81],[6,81],[6,81],[6,81],[6,81],[6,81],[6,81],[6,81],[6,81],[6,81],[6,81],[6,81],[6,81],[6,81],[6,81],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,81],[6,81],[6,81],[6,81],[6,81],[6,81],[6,81],[6,81],[6,81],[6,81],[6,81],[6,81],[6,81],[6,81],[6,81],[6,81]],[[6,38],[6,38],[6,38],[6,38],[11,5],[11,2],[11,3],[6,35],[6,38],[9,5],[6,38],[6,38],[6,38],[6,38],[8,31],[6,38],[9,20],[9,21],[6,38],[6,38],[11,21],[11,18],[11,19],[6,43],[6,38],[6,38],[6,38],[6,38],[8,14],[8,15],[8,47],[6,38],[9,36],[9,37],[6,38],[6,38],[6,38],[6,38],[6,38],[6,38],[6,38],[6,38],[6,38],[6,38],[8,30],[8,30],[8,63],[6,38],[6,38],[8,192],[8,198],[8,199],[8,193],[6,38],[6,38],[6,38],[6,38],[6,38],[6,38],[6,38],[6,38],[6,38],[6,38],[6,38],[6,38],[8,208],[8,214],[8,215],[8,209],[6,38],[6,38],[6,38],[6,38],[6,38],[6,38],[6,38],[6,38],[6,38],[6,38],[6,38],[6,38],[6,38],[6,38],[9,53],[9,54],[9,54],[9,54],[9,54],[9,55],[6,38],[6,38],[6,38],[8,172],[8,173],[6,38],[6,38],[10,220],[6,38],[6,38],[6,38],[6,38],[6,38],[6,38],[6,38],[6,38],[9,69],[6,38],[6,38],[8,188],[8,189],[6,38],[6,38],[10,236],[6,38],[6,38],[6,38],[6,38],[6,38],[6,38],[6,38],[9,69],[6,38],[9,83],[14,163],[6,38],[6,38],[6,38],[14,133],[10,252],[6,38],[6,38],[6,38],[6,38],[6,38],[6,38],[6,38],[6,38],[6,38],[9,83],[14,179],[6,38],[6,38],[6,38],[14,149],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[13,240],[6,37],[13,240],[6,38],[6,38],[6,38],[6,38],[6,38],[6,38],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[13,240],[13,240],[6,37],[13,240],[6,38],[6,38],[6,38],[6,38],[6,38],[6,38],[6,38],[6,38],[6,38],[6,38],[6,38],[6,38],[6,38],[6,38],[6,38],[6,38],[6,38],[6,38],[6,38],[6,38],[6,38],[6,38]],[[0,102],[0,102],[0,102],[0,102],[0,102],[0,102],[0,102],[0,102],[0,102],[0,102],[0,102],[0,102],[0,102],[0,102],[0,102],[0,102],[0,102],[0,102],[0,102],[0,102],[0,102],[0,102],[0,102],[0,102],[0,102],[0,102],[0,102],[0,102],[0,102],[0,102],[0,102],[0,102],[0,102],[0,102],[0,102],[0,102],[0,102],[0,102],[0,102],[0,102],[0,102],[0,102],[0,102],[0,102],[0,102],[0,102],[0,102],[0,102],[0,102],[0,102],[0,102],[0,102],[0,102],[0,102],[0,102],[0,102],[0,102],[0,102],[0,102],[0,102],[0,102],[0,102],[0,102],[0,102],[0,102],[0,102],[0,102],[0,102],[0,102],[0,102],[0,102],[0,102],[0,102],[0,102],[0,102],[0,102],[0,102],[0,102],[0,102],[0,102],[0,102],[0,102],[0,102],[0,102],[0,102],[0,102],[0,102],[0,102],[0,102],[0,102],[0,102],[0,102],[0,102],[0,102],[0,102],[0,102],[0,102],[0,102],[0,102],[0,102],[0,102],[0,102],[0,102],[0,102],[0,102],[0,102],[0,102],[0,102],[0,102],[0,102],[0,102],[0,102],[0,102],[0,102],[0,102],[0,102],[0,102],[0,102],[0,102],[0,102],[0,102],[0,102],[0,102],[0,102],[0,102],[0,102],[0,102],[0,102],[0,102],[0,102],[0,102],[0,102],[0,102],[0,102],[0,102],[0,102],[0,102],[0,102],[0,102],[0,102],[0,102],[0,102],[0,102],[0,102],[6,35],[6,35],[6,35],[6,35],[6,35],[6,35],[6,35],[6,35],[13,240],[6,35],[6,35],[6,35],[6,35],[6,35],[6,35],[6,35],[6,43],[6,43],[6,43],[6,43],[6,43],[6,43],[6,43],[6,43],[13,240],[6,43],[6,43],[6,43],[6,43],[6,43],[6,43],[6,43],[0,102],[0,102],[0,102],[0,102],[0,102],[0,102],[0,102],[0,102],[0,102],[0,102],[0,102],[0,102],[0,102],[0,102],[0,102],[0,102]],[[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[12,236],[12,237],[12,238],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[12,252],[12,253],[12,254],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37]]]},
      {"name":"House1","door":{"x2":-75,"x1":-125,"y1":276,"y2":381},"width":16,"height":12,"layers":4,"tiles":[[[5,88],[5,88],[5,50],[5,50],[5,50],[5,50],[5,50],[5,50],[6,85],[6,85],[6,85],[5,50],[5,50],[5,50],[5,88],[5,88],[5,88],[5,50],[2,51],[2,51],[2,51],[2,51],[5,62],[5,62],[5,62],[5,62],[5,62],[5,62],[5,62],[5,62],[5,50],[5,50],[5,50],[5,50],[2,55],[2,55],[2,55],[2,55],[2,55],[2,55],[2,55],[2,55],[2,55],[2,55],[2,55],[2,55],[5,88],[5,88],[5,88],[5,88],[2,55],[2,55],[2,55],[2,55],[2,55],[2,55],[2,55],[2,55],[2,55],[2,55],[2,55],[2,55],[5,50],[5,88],[5,88],[5,88],[2,55],[2,55],[2,55],[2,55],[2,55],[2,55],[5,62],[2,55],[2,55],[2,55],[2,55],[2,55],[5,88],[5,88],[5,88],[5,88],[2,55],[2,55],[2,55],[2,55],[2,55],[2,55],[2,55],[2,55],[2,55],[2,55],[2,55],[2,55],[5,88],[8,175],[5,88],[5,88],[5,88],[5,88],[5,88],[5,80],[5,88],[5,88],[5,88],[5,88],[5,88],[5,80],[5,88],[5,88],[5,88],[5,88],[5,21],[5,21],[5,21],[5,21],[5,21],[5,21],[5,21],[5,21],[5,21],[5,21],[5,21],[5,21],[5,21],[5,21],[5,21],[5,21],[5,0],[5,0],[5,0],[5,0],[5,0],[5,0],[5,0],[5,0],[5,0],[5,0],[5,0],[8,12],[8,13],[5,0],[5,0],[5,0],[5,21],[5,21],[5,22],[5,21],[5,21],[5,22],[5,21],[5,21],[5,22],[5,21],[5,21],[5,22],[5,21],[5,21],[5,22],[5,21],[5,0],[5,0],[5,0],[5,0],[5,0],[5,0],[5,0],[5,0],[5,0],[5,0],[5,0],[5,0],[5,0],[5,0],[5,0],[5,0],[5,21],[5,21],[5,21],[5,21],[5,21],[5,21],[5,21],[5,21],[5,21],[5,21],[5,21],[5,21],[5,21],[5,21],[5,21],[5,21]],[[5,88],[5,88],[2,6],[2,35],[2,35],[2,35],[2,35],[2,35],[2,35],[2,35],[2,35],[2,35],[2,35],[2,7],[5,88],[5,88],[5,88],[5,91],[2,50],[2,66],[2,66],[2,66],[2,51],[2,51],[2,51],[2,51],[2,51],[2,51],[2,51],[2,23],[5,91],[5,88],[5,88],[5,88],[6,37],[8,248],[8,248],[8,248],[8,248],[8,248],[8,248],[8,248],[8,248],[8,248],[8,248],[8,248],[5,88],[5,88],[5,91],[5,88],[6,37],[11,134],[11,135],[8,248],[8,248],[8,248],[8,248],[8,248],[6,37],[11,166],[11,167],[8,248],[5,88],[5,82],[5,88],[5,88],[6,37],[11,150],[11,151],[8,248],[8,248],[11,136],[11,137],[11,138],[8,248],[11,182],[11,183],[8,248],[13,39],[5,88],[5,81],[5,88],[6,37],[8,248],[8,248],[8,248],[11,141],[11,152],[11,153],[11,154],[8,248],[8,248],[8,248],[8,248],[5,88],[5,88],[5,88],[5,88],[5,88],[5,83],[5,88],[5,89],[5,88],[5,88],[5,75],[5,88],[5,89],[5,89],[5,83],[5,88],[5,88],[5,90],[5,26],[5,26],[5,26],[5,26],[5,26],[5,26],[5,26],[5,26],[5,26],[5,26],[5,26],[5,26],[5,26],[5,26],[5,26],[5,26],[5,16],[8,248],[8,248],[8,248],[8,248],[8,248],[5,16],[8,248],[8,248],[8,248],[8,248],[5,0],[5,16],[8,248],[8,248],[6,37],[5,2],[5,2],[8,248],[5,2],[5,2],[8,248],[5,2],[5,2],[8,248],[5,2],[5,2],[8,248],[5,2],[5,2],[8,248],[5,2],[14,235],[14,235],[14,235],[14,252],[8,248],[14,250],[8,248],[8,248],[8,248],[8,248],[8,248],[8,248],[8,248],[8,248],[14,75],[6,37],[5,26],[5,26],[5,26],[5,2],[5,2],[5,26],[5,26],[5,26],[5,26],[5,26],[5,26],[5,26],[5,26],[5,26],[5,26],[5,26]],[[2,81],[2,81],[2,81],[2,66],[2,66],[2,66],[2,66],[2,66],[2,66],[2,66],[2,66],[2,66],[2,66],[2,66],[2,66],[2,66],[2,81],[2,81],[2,66],[2,66],[2,66],[2,66],[2,66],[2,66],[2,66],[2,66],[2,66],[2,66],[2,66],[2,66],[2,66],[2,66],[2,81],[2,81],[2,81],[2,81],[2,81],[2,81],[2,81],[2,81],[2,81],[2,81],[2,81],[2,81],[2,81],[2,81],[2,66],[2,81],[2,81],[2,81],[2,81],[2,81],[2,81],[2,81],[2,81],[2,81],[2,81],[2,81],[2,81],[2,81],[2,81],[2,81],[2,81],[2,81],[2,81],[2,81],[2,81],[2,81],[2,81],[2,81],[2,81],[2,81],[2,81],[2,81],[2,81],[2,81],[2,81],[2,81],[2,81],[2,81],[2,81],[2,81],[2,81],[2,81],[2,81],[2,81],[2,81],[2,81],[2,81],[2,81],[2,81],[2,81],[2,81],[2,81],[2,81],[2,81],[2,81],[2,81],[2,81],[2,81],[2,81],[2,81],[2,81],[2,81],[2,81],[2,81],[2,81],[2,81],[2,81],[2,81],[2,81],[2,81],[2,81],[2,81],[2,81],[2,81],[0,102],[2,81],[2,81],[2,81],[2,81],[2,81],[2,81],[2,81],[2,81],[2,81],[2,81],[2,81],[2,81],[7,73],[7,74],[2,81],[2,81],[2,81],[2,81],[2,81],[2,81],[2,81],[2,81],[2,81],[2,81],[2,81],[2,81],[2,81],[2,81],[2,81],[7,90],[2,81],[2,81],[2,81],[2,81],[2,81],[2,81],[2,81],[2,81],[2,81],[2,81],[2,81],[2,81],[2,81],[2,81],[2,81],[7,106],[2,81],[2,81],[2,81],[2,81],[2,81],[0,102],[0,102],[0,102],[0,102],[0,102],[2,81],[2,81],[14,251],[2,81],[2,81],[7,122],[7,48],[7,49],[7,50],[7,51],[7,52],[6,38],[6,38],[6,38],[2,81],[2,81],[2,81],[2,81],[2,81]],[[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37]]]},
     //middle hall
      {"name":"Hall_Middle","exit":{"x2":322,"x1":267,"y1":596,"y2":684},"door":{"x2":322,"x1":267,"y1":338,"y2":427},"width":5,"height":12,"layers":4,"tiles":[[[6,76],[6,76],[6,76],[6,76],[6,76],[6,76],[6,76],[6,76],[6,76],[6,76],[6,76],[6,76],[6,76],[6,76],[6,76],[6,76],[6,76],[6,76],[6,76],[6,76],[6,76],[6,76],[6,76],[6,76],[6,76],[6,35],[6,35],[6,35],[6,35],[6,35],[6,43],[6,43],[6,43],[6,43],[6,43],[6,67],[6,67],[6,67],[6,67],[6,67],[6,67],[6,67],[6,67],[6,67],[6,67],[2,54],[2,54],[6,76],[2,54],[2,54],[2,54],[2,54],[6,76],[2,54],[2,54],[6,76],[6,76],[6,76],[6,76],[6,76]],[[6,45],[6,45],[6,45],[6,45],[6,45],[6,45],[6,45],[6,45],[6,45],[6,45],[6,45],[6,45],[6,45],[6,45],[6,45],[6,45],[6,45],[6,45],[6,45],[6,45],[6,45],[6,45],[6,45],[6,45],[6,45],[11,126],[12,236],[12,237],[12,238],[6,45],[11,126],[12,252],[12,253],[12,254],[6,45],[6,37],[6,37],[6,37],[6,37],[11,126],[6,37],[6,37],[6,37],[6,37],[6,37],[11,126],[11,126],[11,93],[11,126],[11,126],[11,126],[11,126],[11,126],[11,126],[11,126],[6,45],[6,45],[6,45],[6,45],[6,45]],[[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[2,54],[2,54],[11,93],[2,54],[2,54],[2,54],[2,54],[11,109],[2,54],[2,54],[6,37],[6,37],[6,37],[6,37],[6,37]],[[11,240],[11,240],[11,240],[11,240],[11,240],[11,240],[11,240],[11,240],[11,240],[11,240],[11,240],[11,240],[11,240],[11,240],[11,240],[11,240],[11,240],[11,240],[11,240],[11,240],[11,240],[11,240],[11,240],[11,240],[11,240],[11,240],[11,240],[11,240],[11,240],[11,240],[11,240],[11,240],[11,240],[11,240],[11,240],[11,240],[11,240],[11,240],[11,240],[11,240],[11,240],[11,240],[11,240],[11,240],[11,240],[11,240],[11,92],[11,93],[11,94],[11,240],[11,240],[11,108],[11,109],[11,110],[11,240],[11,240],[11,240],[11,240],[11,240],[11,240]]]},
     //hall door
      {"name":"Hall_Door","door":{"x2":322,"x1":267,"y1":338,"y2":427},"width":5,"height":12,"layers":4,"tiles":[[[6,76],[6,76],[6,76],[6,76],[6,76],[6,76],[6,76],[6,76],[6,76],[6,76],[6,76],[6,76],[6,76],[6,76],[6,76],[6,76],[6,76],[6,76],[6,76],[6,76],[6,76],[6,76],[6,76],[6,76],[6,76],[6,35],[6,35],[6,35],[6,35],[6,35],[6,43],[6,43],[6,43],[6,43],[6,43],[6,67],[6,67],[6,67],[6,67],[6,67],[6,67],[6,67],[6,67],[6,67],[6,67],[2,54],[2,54],[6,76],[2,54],[2,54],[2,54],[2,54],[6,76],[2,54],[2,54],[6,76],[6,76],[6,76],[6,76],[6,76]],[[6,45],[6,45],[6,45],[6,45],[6,45],[6,45],[6,45],[6,45],[6,45],[6,45],[6,45],[6,45],[6,45],[6,45],[6,45],[6,45],[6,45],[6,45],[6,45],[6,45],[6,45],[6,45],[6,45],[6,45],[6,45],[11,126],[12,236],[12,237],[12,238],[6,45],[11,126],[12,252],[12,253],[12,254],[6,45],[6,37],[6,37],[6,37],[6,37],[11,126],[6,37],[6,37],[6,37],[6,37],[6,37],[11,126],[11,126],[11,93],[11,126],[11,126],[11,126],[11,126],[11,126],[11,126],[11,126],[6,45],[6,45],[6,45],[6,45],[6,45]],[[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[2,54],[2,54],[11,93],[2,54],[2,54],[2,54],[2,54],[11,109],[2,54],[2,54],[6,37],[6,37],[6,37],[6,37],[6,37]],[[11,240],[11,240],[11,240],[11,240],[11,240],[11,240],[11,240],[11,240],[11,240],[11,240],[11,240],[11,240],[11,240],[11,240],[11,240],[11,240],[11,240],[11,240],[11,240],[11,240],[11,240],[11,240],[11,240],[11,240],[11,240],[11,240],[11,240],[11,240],[11,240],[11,240],[11,240],[11,240],[11,240],[11,240],[11,240],[11,240],[11,240],[11,240],[11,240],[11,240],[11,240],[11,240],[11,240],[11,240],[11,240],[11,240],[5,79],[2,55],[5,79],[11,240],[11,240],[5,79],[2,55],[5,79],[11,240],[11,240],[11,240],[11,240],[11,240],[11,240]]]},
      {"name":"Hall_Left","door":{"x2":322,"x1":267,"y1":338,"y2":427},"width":5,"height":12,"layers":4,"tiles":[[[6,76],[6,76],[6,76],[6,76],[6,76],[6,76],[6,76],[6,76],[6,76],[6,76],[6,76],[6,76],[6,76],[6,76],[6,76],[6,76],[6,76],[6,76],[6,76],[6,76],[6,76],[6,76],[6,76],[6,76],[6,76],[6,35],[6,35],[6,35],[6,35],[6,35],[6,43],[6,43],[6,43],[6,43],[6,43],[6,67],[6,67],[6,67],[6,67],[6,67],[6,67],[6,67],[6,67],[6,67],[6,67],[2,54],[2,54],[6,76],[2,54],[2,54],[2,54],[2,54],[6,76],[2,54],[2,54],[6,76],[6,76],[6,76],[6,76],[6,76]],[[6,45],[6,45],[6,45],[6,45],[6,45],[6,45],[6,45],[6,45],[6,45],[6,45],[6,45],[6,45],[6,45],[6,45],[6,45],[6,45],[6,45],[6,45],[6,45],[6,45],[6,45],[6,45],[6,45],[6,45],[6,45],[6,76],[12,236],[12,237],[12,238],[6,45],[6,76],[12,252],[12,253],[12,254],[6,45],[6,76],[6,37],[6,37],[6,37],[11,126],[6,76],[6,37],[6,37],[6,37],[6,37],[6,76],[11,126],[11,93],[11,126],[11,126],[6,76],[11,126],[11,126],[11,126],[11,126],[6,45],[6,45],[6,45],[6,45],[6,45]],[[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[5,63],[6,37],[6,37],[6,37],[6,37],[5,63],[6,37],[6,37],[6,37],[6,37],[5,63],[6,37],[6,37],[6,37],[6,37],[5,63],[6,37],[6,37],[6,37],[6,37],[5,63],[2,54],[11,93],[2,54],[2,54],[5,63],[2,54],[11,109],[2,54],[2,54],[6,37],[6,37],[6,37],[6,37],[6,37]],[[11,240],[11,240],[11,240],[11,240],[11,240],[11,240],[11,240],[11,240],[11,240],[11,240],[11,240],[11,240],[11,240],[11,240],[11,240],[11,240],[11,240],[11,240],[11,240],[11,240],[11,240],[11,240],[11,240],[11,240],[11,240],[5,63],[11,240],[11,240],[11,240],[11,240],[5,63],[11,240],[11,240],[11,240],[11,240],[5,63],[11,240],[11,240],[11,240],[11,240],[5,63],[11,240],[11,240],[11,240],[11,240],[5,63],[5,79],[2,55],[5,79],[11,240],[5,63],[5,79],[2,55],[5,79],[11,240],[11,240],[11,240],[11,240],[11,240],[11,240]]]},
      {"name":"Hall_Right","door":{"x2":322,"x1":267,"y1":338,"y2":427},"width":5,"height":12,"layers":4,"tiles":[[[6,76],[6,76],[6,76],[6,76],[6,76],[6,76],[6,76],[6,76],[6,76],[6,76],[6,76],[6,76],[6,76],[6,76],[6,76],[6,76],[6,76],[6,76],[6,76],[6,76],[6,76],[6,76],[6,76],[6,76],[6,76],[6,35],[6,35],[6,35],[6,35],[6,35],[6,43],[6,43],[6,43],[6,43],[6,43],[6,67],[6,67],[6,67],[6,67],[6,67],[6,67],[6,67],[6,67],[6,67],[6,67],[2,54],[2,54],[6,76],[2,54],[2,54],[2,54],[2,54],[6,76],[2,54],[2,54],[6,76],[6,76],[6,76],[6,76],[6,76]],[[6,45],[6,45],[6,45],[6,45],[6,45],[6,45],[6,45],[6,45],[6,45],[6,45],[6,45],[6,45],[6,45],[6,45],[6,45],[6,45],[6,45],[6,45],[6,45],[6,45],[6,45],[6,45],[6,45],[6,45],[6,45],[11,126],[12,236],[12,237],[12,238],[6,76],[11,126],[12,252],[12,253],[12,254],[6,76],[6,37],[6,37],[6,37],[6,37],[6,76],[6,37],[6,37],[6,37],[6,37],[6,76],[11,126],[11,126],[11,93],[11,126],[6,76],[11,126],[11,126],[11,126],[11,126],[6,76],[6,45],[6,45],[6,45],[6,45],[6,45]],[[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37],[2,54],[2,54],[11,93],[2,54],[6,37],[2,54],[2,54],[11,109],[2,54],[6,37],[6,37],[6,37],[6,37],[6,37],[6,37]],[[11,240],[11,240],[11,240],[11,240],[11,240],[11,240],[11,240],[11,240],[11,240],[11,240],[11,240],[11,240],[11,240],[11,240],[11,240],[11,240],[11,240],[11,240],[11,240],[11,240],[11,240],[11,240],[11,240],[11,240],[11,240],[11,240],[11,240],[11,240],[11,240],[6,37],[11,240],[11,240],[11,240],[11,240],[6,37],[11,240],[11,240],[11,240],[11,240],[6,37],[11,240],[11,240],[11,240],[11,240],[11,240],[11,240],[5,79],[2,55],[5,79],[6,37],[11,240],[5,79],[2,55],[5,79],[6,37],[11,240],[11,240],[11,240],[11,240],[11,240]]]},
   ]
   
  }

  return resources;
}

)();