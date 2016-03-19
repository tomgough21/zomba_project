(function($) {

  var extend = function(klass, base) {
    klass.prototype = Object.create(base.prototype);
    klass.prototype.constructor = klass;
  }

  function GameState(scene) {
    GameFramework.State.call(this, scene);

    movemode = 0;
    jQuery('<div/>', {
      id: 'street_frame'
    }).appendTo('#game_frame');
    jQuery('<div/>', {
      id: 'game_terrain',
      class: 'game_terrain'
    }).appendTo('#street_frame');

    var gui = jQuery('<div/>', {
      id: 'game_top_gui'
    }).appendTo('#game_frame');

    jQuery('<div/>', {
      id: 'game_score'
    }).appendTo('#game_top_gui').html('Ammo: 20 &nbsp;&nbsp; Food: 3');

    jQuery('<div/>', {
      id: 'game_active_word'
    }).appendTo('#game_top_gui').html('Score: 2000');

    jQuery('<div/>', {
      id: 'game_lives'
    }).appendTo('#game_top_gui').html('Party: 1');

    for(var i = 0; i < GameResources.tilesets.length; i++) {
      this.scene.loadSprite(GameResources.tilesets[i].name, 1, 0, true);
    }

    this.scene.loadSprite('player', 96, 4, true, 32);
    this.scene.loadSprite('zombie', 96, 4, true, 32);

    this.terrain = undefined;
    this.player = undefined;
    this.x = 0;
    this.y = 0;
    this.moveDelta = 0;
    this.movemode = 0;

    this.world = [1,1,1,1,1,1,1,1] // setup street array
    this.world_width = 0;
    this.active_terrain = undefined;
    this.terrain = []

    var that = this;
    
    this.scene.onLoad = function() {
      for(var i = 0; i < 8; i++) {
        var level = that.world[i];
        that.terrain.push(new SpriteEngine.Terrain(that.scene, "#game_terrain", GameResources.levels[level], that.world_width, 0 ));
        that.world_width += (GameResources.levels[level].width * 64); //64 is the tilewidth
      }
      that.player = new SpriteEngine.GameObject(that.scene, 'player', '#street_frame').setGroup('street').setPosition(450,500).setScale(2.0);
      that.player.spritestate.pause();

      that.updateTerrain();
    }
      
  }
  extend(GameState, GameFramework.State);

  GameState.prototype.playerInRect = function(x1, x2, y1, y2) {
    var x = this.x;
    var y = this.player.position.y;
    if ((x1 <= x) && (x <= x2) && (y1 <= y) && (y <= y2)) {
     return true;
    }
    return false;
  }

  GameState.prototype.getVisibleTerrain = function(x,y) {
    var x_sum = 0;
    for(var i = 0; i < this.world.length; i++) {
      x_sum += (GameResources.levels[this.world[i]].width * 64);
      if(-this.x < x_sum) {
        return i;
      }
    }
  }

  GameState.prototype.updateTerrain = function() {
    var player_chunk = this.getVisibleTerrain(this.x, this.y);
    if(player_chunk === this.active_terrain) {
      return;
    }

    if(this.active_terrain !== undefined) {

      var erase_chunk = undefined;
      if(this.active_terrain < player_chunk){
        erase_chunk = this.active_terrain - 1;
      } else {
        erase_chunk = this.active_terrain + 1;
      }

      if(erase_chunk >= 0 && erase_chunk < this.terrain.length) {
        this.terrain[erase_chunk].clear();
      }

    }

    this.active_terrain = player_chunk;

    var start_terrain = this.active_terrain -1;
    for(var i = 0; i < 3; i++) {
      if((start_terrain + i) >= 0 && (start_terrain + i) < this.terrain.length) {
        if(this.terrain[start_terrain+i].visible !== true) {
          this.terrain[start_terrain+i].draw();
        }
      }
    }
  }

  GameState.prototype.reset = function() {
  }

  GameState.prototype.destroy = function() {
    $("#game_terrain").remove();
    this.player.kill();
  }

  GameState.prototype.update = function(delta) {
    GameFramework.State.prototype.update.call(this, delta);
    if(this.player !== undefined && this.moveDelta !== undefined) {
      var vec = {x : 0, y : 0};
      var moveMagnitude = Math.sqrt(this.moveDelta.x * this.moveDelta.x + this.moveDelta.y * this.moveDelta.y);
      if(moveMagnitude){
        vec = {x: this.moveDelta.x / moveMagnitude, y: this.moveDelta.y / moveMagnitude};
      }

      vec.x = vec.x * 120 * delta;
      vec.y = vec.y * 120 * delta;

      if(Math.abs(vec.x) > Math.abs(this.moveDelta.x)) {
        vec.x = this.moveDelta.x;
      }
      if(Math.abs(vec.y) > Math.abs(this.moveDelta.y)) {
        vec.y = this.moveDelta.y;
      }

      if(vec.x === 0 && vec.y === 0) {
        this.player.spritestate.pause();

        var door = this.terrain[this.active_terrain].data.door;
        var door_offsetx = this.terrain[this.active_terrain].x;
        var door_offsety = this.terrain[this.active_terrain].y;

        if(this.playerInRect(door.x1 - door_offsetx, door.x2 - door_offsetx, door.y1 + door_offsety, door.y2 + door_offsety)) {
          this.framework.pushState(new HouseState(this.scene));
        }

        this.moveDelta = undefined;
      }else {
        if( Math.abs(vec.x) > Math.abs(vec.y) ) {
          if(vec.x > 0) {
            this.player.spritestate.setState(8);
          }else {
            this.player.spritestate.setState(4);
          }
        } else {
          if(vec.y > 0) {
            this.player.spritestate.setState(0);
          }else {
            this.player.spritestate.setState(12);
          }
        }
        this.player.spritestate.play();
      }

      if(this.moveDelta) {
        this.moveDelta.x -= vec.x;
        this.moveDelta.y -= vec.y;
      }

      //stop walking backwards of screen
      this.x -= vec.x
      if(this.x > 0) {
        this.x = 0;
      }

      if(this.x < (-(this.world_width - this.terrain[this.terrain.length-1].width))) {
        this.x = (-(this.world_width - this.terrain[this.terrain.length-1].width));
      }

      this.terrain[0].setPosition(this.x,0);
      this.player.setPosition(this.player.position.x, this.player.position.y + vec.y);
      this.updateTerrain();
    }

    this.scene.draw();
  }

  GameState.prototype.blur = function(dom) {
    GameFramework.State.prototype.blur.call(this, dom);
    $('#street_frame').hide()
  }

  GameState.prototype.focus = function(dom) {
    GameFramework.State.prototype.focus.call(this, dom);
     $('#street_frame').show()
  }

  GameState.prototype.click = function(e) {
    this.moveDelta = { x : e.relative.x - this.player.position.x, y : e.relative.y - this.player.position.y};
  }

  function getRandomInt(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function HouseState(scene) {
    GameFramework.State.call(this, scene);
    jQuery('<div/>', {
      id: 'house_frame'
    }).appendTo("#game_frame");
    
    jQuery('<div/>', {
      id: 'house_terrain',
      class: 'game_terrain'
    }).appendTo('#house_frame');

    this.terrain = undefined;
    this.player = undefined;
    this.x = 0;
    this.y = 0;
    this.moveDelta = 0;
    this.movemode = 0;

    //this.world = [2]
    this.world = [4,3,2,3,5] // setup coridor array
    this.world_width = 0;
    this.active_terrain = undefined;
    this.terrain = []

    var that = this;
    
    this.scene.onLoad = function() {
      for(var i = 0; i < that.world.length; i++) {
        var level = that.world[i];
        that.terrain.push(new SpriteEngine.Terrain(that.scene, "#house_terrain", GameResources.levels[level], that.world_width, 0 ));
        that.world_width += (GameResources.levels[level].width * 64); //64 is the tilewidth
        that.terrain[i].draw();
      }
      that.player = new SpriteEngine.GameObject(that.scene, 'player', '#house_frame').setGroup('active_house').setPosition(450,500).setScale(2.0);

      that.updateTerrain();
    }
  }
  extend(HouseState, GameFramework.State);

  HouseState.prototype.playerInRect = function(x1, x2, y1, y2) {
    var x = this.x;
    var y = this.player.position.y;
    if ((x1 <= x) && (x <= x2) && (y1 <= y) && (y <= y2)) {
     return true;
    }
    return false;
  }

  HouseState.prototype.getVisibleTerrain = function(x,y) {
    var x_sum = 0;
    for(var i = 0; i < this.world.length; i++) {
      var oldsum = x_sum;
      x_sum += (GameResources.levels[this.world[i]].width * 64);
      if(-x < x_sum && -x > oldsum) {
        return i;
      }
    }
  }

  HouseState.prototype.updateTerrain = function() {
    var player_chunk = this.getVisibleTerrain(this.x - this.player.position.x, this.y);
    if(player_chunk === this.active_terrain) {
      return;
    }
    console.log("new chunk " + player_chunk );
    this.active_terrain = player_chunk;
  }

  HouseState.prototype.reset = function() {
  }

  HouseState.prototype.destroy = function() {
    $("#house_frame").remove();
    this.scene.clearGroup("active_house");
  }

  HouseState.prototype.update = function(delta) {
    GameFramework.State.prototype.update.call(this, delta);
    if(this.player !== undefined && this.moveDelta !== undefined) {

      var vec = {x : 0, y : 0};
      var moveMagnitude = Math.sqrt(this.moveDelta.x * this.moveDelta.x + this.moveDelta.y * this.moveDelta.y);
      if(moveMagnitude){
        vec = {x: this.moveDelta.x / moveMagnitude, y: this.moveDelta.y / moveMagnitude};
      }

      vec.x = vec.x * 120 * delta;
      vec.y = vec.y * 120 * delta;

      if(Math.abs(vec.x) > Math.abs(this.moveDelta.x)) {
        vec.x = this.moveDelta.x;
      }
      if(Math.abs(vec.y) > Math.abs(this.moveDelta.y)) {
        vec.y = this.moveDelta.y;
      }

      if(vec.x === 0 && vec.y === 0) {
        this.player.spritestate.pause();

        if(this.terrain[this.active_terrain].data.door != undefined) {
          var door = this.terrain[this.active_terrain].data.door;
          var door_offsetx = this.terrain[this.active_terrain].x;
          var door_offsety = this.terrain[this.active_terrain].y;

          if(this.playerInRect(door.x1 - door_offsetx, door.x2 - door_offsetx, door.y1 + door_offsety, door.y2 + door_offsety)) {
            this.framework.pushState(new RoomState(this.scene));
          }
        }

        if(this.terrain[this.active_terrain].data.exit != undefined) {
          var door = this.terrain[this.active_terrain].data.exit;
          var door_offsetx = this.terrain[this.active_terrain].x;
          var door_offsety = this.terrain[this.active_terrain].y;

          if(this.playerInRect(door.x1 - door_offsetx, door.x2 - door_offsetx, door.y1 + door_offsety, door.y2 + door_offsety)) {
            this.framework.popState();
          }

        }

        this.moveDelta = undefined;
      }else {
        if( Math.abs(vec.x) > Math.abs(vec.y) ) {
          if(vec.x > 0) {
            this.player.spritestate.setState(8);
          }else {
            this.player.spritestate.setState(4);
          }
        } else {
          if(vec.y > 0) {
            this.player.spritestate.setState(0);
          }else {
            this.player.spritestate.setState(12);
          }
        }
        this.player.spritestate.play();
      }

      if(this.moveDelta) {
        this.moveDelta.x -= vec.x;
        this.moveDelta.y -= vec.y;
      }

      
      //stop walking backwards of screen
      this.x -= vec.x
      /*if(this.x > 0) {
        this.x = 0;
      }
      if(this.x < (-(this.world_width - this.terrain[this.terrain.length-1].width))) {
        this.x = (-(this.world_width - this.terrain[this.terrain.length-1].width));
      }
      */

      this.terrain[0].setPosition(this.x, 0);
      this.player.setPosition(this.player.position.x, this.player.position.y + vec.y);
      this.updateTerrain();
    }
    
    this.scene.draw();
  }

  HouseState.prototype.blur = function(dom) {
    GameFramework.State.prototype.blur.call(this, dom);
    $('#house_frame').hide()
  }

  HouseState.prototype.focus = function(dom) {
    GameFramework.State.prototype.focus.call(this, dom);
     $('#house_frame').show()
  }

  HouseState.prototype.click = function(e) {
    this.moveDelta = { x : e.relative.x - this.player.position.x, y : e.relative.y - this.player.position.y};
  }

    function RoomState(scene) {
    GameFramework.State.call(this, scene);
    jQuery('<div/>', {
      id: 'room_frame'
    }).appendTo("#game_frame");
    
    jQuery('<div/>', {
      id: 'room_terrain',
      class: 'game_terrain'
    }).appendTo('#room_frame');

    this.terrain = undefined;
    this.player = undefined;
    this.x = 0;
    this.y = 0;
    this.moveDelta = 0;
    this.movemode = 0;

    //this.world = [2]
    this.world = [0] // setup coridor array
    this.world_width = 0;
    this.active_terrain = undefined;
    this.terrain = []

    var that = this;
    
    this.scene.onLoad = function() {
      for(var i = 0; i < that.world.length; i++) {
        var level = that.world[i];
        that.terrain.push(new SpriteEngine.Terrain(that.scene, "#room_terrain", GameResources.levels[level], that.world_width, 0 ));
        that.world_width += (GameResources.levels[level].width * 64); //64 is the tilewidth
        that.terrain[i].draw();
      }
      that.player = new SpriteEngine.GameObject(that.scene, 'player', '#room_frame').setGroup('active_room').setPosition(450,500).setScale(2.0);

      that.updateTerrain();
    }
  }
  extend(RoomState, GameFramework.State);

  RoomState.prototype.playerInRect = function(x1, x2, y1, y2) {
    var x = this.x;
    var y = this.player.position.y;
    if ((x1 <= x) && (x <= x2) && (y1 <= y) && (y <= y2)) {
     return true;
    }
    return false;
  }

  RoomState.prototype.getVisibleTerrain = function(x,y) {
    var x_sum = 0;
    for(var i = 0; i < this.world.length; i++) {
      var oldsum = x_sum;
      x_sum += (GameResources.levels[this.world[i]].width * 64);
      if(-x <= x_sum && -x > oldsum) {
        return i;
      }
    }
  }

  RoomState.prototype.updateTerrain = function() {
    var player_chunk = this.getVisibleTerrain(this.x - this.player.position.x, this.y);
    if(player_chunk === this.active_terrain) {
      return;
    }
    this.active_terrain = player_chunk;
  }

  RoomState.prototype.reset = function() {
  }

  RoomState.prototype.destroy = function() {
    $("#room_frame").remove();
    this.scene.clearGroup("active_room");
  }

  RoomState.prototype.update = function(delta) {
    GameFramework.State.prototype.update.call(this, delta);
    if(this.player !== undefined && this.moveDelta !== undefined) {

      var vec = {x : 0, y : 0};
      var moveMagnitude = Math.sqrt(this.moveDelta.x * this.moveDelta.x + this.moveDelta.y * this.moveDelta.y);
      if(moveMagnitude){
        vec = {x: this.moveDelta.x / moveMagnitude, y: this.moveDelta.y / moveMagnitude};
      }

      vec.x = vec.x * 120 * delta;
      vec.y = vec.y * 120 * delta;

      if(Math.abs(vec.x) > Math.abs(this.moveDelta.x)) {
        vec.x = this.moveDelta.x;
      }
      if(Math.abs(vec.y) > Math.abs(this.moveDelta.y)) {
        vec.y = this.moveDelta.y;
      }

      if(vec.x === 0 && vec.y === 0) {
        this.player.spritestate.pause();

        if(this.terrain[this.active_terrain].data.door != undefined) {
          var door = this.terrain[this.active_terrain].data.door;
          var door_offsetx = this.terrain[this.active_terrain].x;
          var door_offsety = this.terrain[this.active_terrain].y;

          if(this.playerInRect(door.x1 - door_offsetx, door.x2 - door_offsetx, door.y1 + door_offsety, door.y2 + door_offsety)) {
            this.framework.pushState(new RoomState(this.scene));
          }
        }

        if(this.terrain[this.active_terrain].data.exit != undefined) {
          var door = this.terrain[this.active_terrain].data.exit;
          var door_offsetx = this.terrain[this.active_terrain].x;
          var door_offsety = this.terrain[this.active_terrain].y;

          if(this.playerInRect(door.x1 - door_offsetx, door.x2 - door_offsetx, door.y1 + door_offsety, door.y2 + door_offsety)) {
            this.framework.popState();
          }

        }

        this.moveDelta = undefined;
      }else {
        if( Math.abs(vec.x) > Math.abs(vec.y) ) {
          if(vec.x > 0) {
            this.player.spritestate.setState(8);
          }else {
            this.player.spritestate.setState(4);
          }
        } else {
          if(vec.y > 0) {
            this.player.spritestate.setState(0);
          }else {
            this.player.spritestate.setState(12);
          }
        }
        this.player.spritestate.play();
      }

      if(this.moveDelta) {
        this.moveDelta.x -= vec.x;
        this.moveDelta.y -= vec.y;
      }

      this.x -= vec.x

      this.terrain[0].setPosition(this.x, 0);
      this.player.setPosition(this.player.position.x, this.player.position.y + vec.y);
      this.updateTerrain();
    }
    
    this.scene.draw();
  }

  RoomState.prototype.click = function(e) {
    this.moveDelta = { x : e.relative.x - this.player.position.x, y : e.relative.y - this.player.position.y};
  }

  window.app = {
    init: function() {
      this.scene = new SpriteEngine.Scene("#game_frame");
      this.framework = new GameFramework.Framework("body");
      this.framework.pushState(new GameState(this.scene));
      this.framework.start();
    },
  }

  $(document).ready(function() {
    window.app.init();
  });

})(jQuery);