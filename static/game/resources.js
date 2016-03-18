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
    levels : [{width:8, height:8, layers:4, tiles:[[[5,88],[5,88],[5,88],[5,88],[5,88],[5,88],[5,88],[5,88],[5,88],[5,88],[5,88],[5,88],[5,88],[5,88],[5,88],[5,88],[5,88],[5,88],[5,88],[5,88],[5,88],[5,88],[5,88],[5,88],[5,88],[5,88],[5,88],[5,88],[5,88],[5,88],[5,88],[5,88],[5,88],[5,88],[5,88],[5,88],[5,88],[5,88],[5,88],[5,88],[5,88],[5,88],[5,88],[5,88],[5,88],[5,88],[5,88],[5,88],[5,88],[5,88],[5,88],[5,88],[5,88],[5,88],[5,88],[5,88],[5,88],[5,88],[5,88],[5,88],[5,88],[5,88],[5,88],[5,88]],[[5,88],[5,88],[5,88],[5,88],[5,88],[5,88],[5,88],[5,88],[5,88],[5,88],[5,81],[5,88],[5,88],[5,88],[5,88],[5,88],[5,88],[5,88],[5,88],[5,88],[5,88],[5,82],[5,88],[5,88],[5,88],[5,89],[5,88],[5,88],[5,88],[5,88],[5,88],[5,88],[5,88],[5,88],[5,88],[5,88],[5,88],[5,91],[5,88],[5,88],[5,88],[5,88],[5,88],[5,90],[5,88],[5,88],[5,88],[5,88],[9,69],[9,53],[9,54],[9,54],[9,54],[9,54],[9,54],[9,53],[5,88],[5,88],[5,88],[5,88],[5,88],[5,88],[5,88],[5,88]],[[9,85],[9,85],[9,85],[9,85],[9,85],[7,64],[7,65],[7,66],[9,85],[9,85],[9,85],[9,85],[9,85],[7,80],[7,81],[7,82],[9,85],[9,85],[9,85],[9,85],[9,85],[9,85],[9,85],[9,85],[9,85],[9,85],[9,85],[9,85],[9,85],[9,85],[9,85],[9,85],[9,85],[9,85],[9,85],[9,85],[9,85],[9,85],[9,85],[9,85],[9,85],[9,85],[9,85],[9,85],[9,85],[9,85],[9,85],[9,85],[9,85],[9,85],[9,85],[9,85],[9,85],[9,85],[9,85],[9,85],[9,85],[9,85],[9,85],[9,85],[9,85],[9,85],[9,85],[9,85]],[[7,191],[7,191],[7,191],[7,191],[7,191],[7,191],[7,191],[7,191],[7,191],[7,191],[7,191],[7,191],[7,191],[7,191],[7,191],[7,191],[7,191],[7,191],[7,191],[7,191],[7,191],[7,191],[7,191],[7,191],[7,191],[7,191],[7,191],[7,191],[7,191],[7,191],[7,191],[7,191],[7,191],[7,191],[7,191],[7,191],[7,191],[7,191],[7,191],[7,191],[7,191],[7,191],[7,191],[7,191],[7,191],[7,191],[7,191],[7,191],[7,191],[7,191],[7,191],[7,191],[7,191],[7,191],[7,191],[7,191],[7,191],[7,191],[7,191],[7,191],[7,191],[7,191],[7,191],[7,191]]]}]
    //levels : [{width:16,height:12,layers:3, tiles:[[[5,50],[5,50],[5,50],[5,50],[5,50],[5,50],[5,50],[5,50],[6,85],[6,85],[6,85],[5,50],[5,50],[5,50],[5,50],[5,50],[5,50],[5,50],[5,62],[5,62],[5,62],[5,62],[5,62],[5,62],[5,62],[5,62],[5,62],[5,62],[5,62],[5,62],[5,50],[5,50],[5,50],[5,50],[5,62],[5,62],[5,62],[5,62],[5,62],[5,62],[5,62],[5,62],[5,62],[5,62],[5,62],[5,62],[4,60],[5,50],[5,50],[5,50],[5,62],[5,62],[5,62],[5,62],[5,62],[5,62],[5,62],[5,62],[5,62],[5,62],[5,62],[5,62],[5,50],[5,50],[5,50],[5,50],[5,62],[5,62],[5,62],[5,62],[5,62],[5,62],[5,62],[5,62],[5,62],[5,62],[5,62],[5,62],[5,50],[5,50],[5,80],[5,80],[5,62],[5,62],[5,62],[5,62],[5,62],[5,62],[5,62],[5,62],[5,62],[5,62],[5,62],[5,62],[9,21],[8,175],[5,80],[5,80],[5,80],[5,80],[5,80],[5,80],[5,80],[5,80],[5,80],[5,80],[5,80],[5,80],[5,80],[5,80],[9,22],[8,191],[5,21],[5,21],[5,21],[5,21],[5,21],[5,21],[5,21],[5,21],[5,21],[5,21],[5,21],[5,21],[5,21],[5,21],[5,21],[5,21],[5,0],[5,0],[5,0],[5,0],[5,0],[5,0],[5,0],[5,0],[5,0],[5,0],[5,0],[8,12],[8,13],[5,0],[5,0],[5,0],[5,21],[5,21],[5,22],[5,21],[5,21],[5,22],[5,21],[5,21],[5,22],[5,21],[5,21],[5,22],[5,21],[5,21],[5,22],[5,21],[5,0],[5,0],[5,0],[5,0],[5,0],[5,0],[5,0],[5,0],[5,0],[5,0],[5,0],[5,0],[5,0],[5,0],[5,0],[5,0],[5,21],[5,21],[5,21],[5,21],[5,21],[5,21],[5,21],[5,21],[5,21],[5,21],[5,21],[5,21],[5,21],[5,21],[5,21],[5,21]],[[1,114],[1,114],[1,114],[9,78],[9,78],[9,78],[9,78],[9,78],[9,78],[9,78],[9,78],[2,7],[2,7],[2,7],[1,114],[1,114],[1,114],[1,114],[1,114],[9,78],[9,78],[9,78],[9,78],[9,78],[9,78],[9,78],[9,78],[9,78],[9,78],[9,78],[1,114],[1,114],[1,114],[1,114],[1,114],[8,248],[8,248],[8,248],[8,248],[8,248],[8,248],[8,248],[8,248],[8,248],[8,248],[8,248],[1,114],[1,114],[1,114],[1,114],[1,114],[11,134],[11,135],[8,248],[8,248],[8,248],[8,248],[8,248],[11,140],[11,166],[11,167],[8,248],[1,114],[1,114],[1,114],[1,114],[1,114],[11,150],[11,151],[8,248],[8,248],[11,136],[11,137],[11,138],[8,248],[11,182],[11,183],[8,248],[1,114],[1,114],[1,114],[1,114],[1,114],[8,248],[8,248],[8,248],[11,141],[11,152],[11,153],[11,154],[8,248],[8,248],[8,248],[8,248],[1,114],[1,114],[1,114],[1,114],[1,114],[1,114],[1,114],[1,114],[1,114],[1,114],[1,114],[1,114],[1,114],[1,114],[1,114],[1,114],[1,114],[1,114],[8,248],[8,248],[8,248],[8,248],[8,248],[8,248],[8,248],[8,248],[8,248],[8,248],[8,248],[8,248],[8,248],[8,248],[8,248],[8,248],[8,248],[8,248],[8,248],[8,248],[8,248],[8,248],[8,248],[8,248],[8,248],[8,248],[8,248],[8,248],[8,248],[8,248],[8,248],[8,248],[8,248],[8,248],[8,248],[8,248],[8,248],[8,248],[8,248],[8,248],[8,248],[8,248],[8,248],[8,248],[8,248],[8,248],[8,248],[8,248],[8,248],[8,248],[8,248],[8,248],[8,248],[8,248],[8,248],[8,248],[8,248],[8,248],[8,248],[8,248],[8,248],[8,248],[8,248],[8,248],[8,248],[8,248],[8,248],[8,248],[8,248],[8,248],[8,248],[8,248],[8,248],[8,248],[8,248],[8,248],[8,248],[8,248],[8,248],[8,248]],[[2,81],[2,81],[2,81],[2,6],[2,6],[2,6],[2,6],[2,6],[2,6],[2,6],[2,6],[2,6],[2,6],[2,81],[2,81],[2,81],[2,81],[2,81],[2,81],[2,22],[2,6],[2,6],[2,6],[2,6],[2,6],[2,6],[2,6],[2,6],[2,6],[2,23],[2,81],[2,81],[2,81],[2,81],[2,81],[2,81],[2,81],[2,81],[2,81],[2,81],[2,81],[2,81],[2,81],[2,81],[2,81],[2,81],[2,81],[2,81],[2,81],[2,81],[2,81],[2,81],[2,81],[2,81],[2,81],[2,81],[2,81],[2,81],[2,81],[2,81],[2,81],[2,81],[2,81],[2,81],[2,81],[2,81],[2,81],[2,81],[2,81],[2,81],[2,81],[2,81],[2,81],[2,81],[2,81],[2,81],[2,81],[2,81],[2,81],[2,81],[2,81],[2,81],[2,81],[2,81],[2,81],[2,81],[2,81],[2,81],[2,81],[2,81],[2,81],[2,81],[2,81],[2,81],[2,81],[2,81],[2,81],[2,81],[2,81],[2,81],[2,81],[2,81],[2,81],[2,81],[2,81],[2,81],[2,81],[2,81],[2,81],[2,81],[2,81],[2,81],[2,81],[2,81],[2,81],[2,81],[2,81],[2,81],[2,81],[2,81],[2,81],[2,81],[2,81],[2,81],[2,81],[2,81],[2,81],[2,81],[2,81],[2,81],[2,81],[2,81],[2,81],[2,81],[2,81],[2,81],[2,81],[2,81],[2,81],[2,81],[2,81],[2,81],[2,81],[2,81],[2,81],[2,81],[2,81],[2,81],[2,81],[2,81],[2,81],[2,81],[2,81],[2,81],[2,81],[2,81],[2,81],[2,81],[2,81],[2,81],[2,81],[2,81],[2,81],[2,81],[2,81],[2,81],[2,81],[2,81],[2,81],[2,81],[2,81],[2,81],[2,81],[2,81],[2,81],[2,81],[2,81],[2,81],[2,81],[2,81],[2,81],[2,81],[2,81],[2,81],[2,81],[2,81],[2,81],[2,81],[2,81],[2,81],[2,81],[2,81]]]}]
  }

  return resources;
}

)();