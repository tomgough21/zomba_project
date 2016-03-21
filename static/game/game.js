(function($) {

  function getRandomInt(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  var extend = function(klass, base) {
    klass.prototype = Object.create(base.prototype);
    klass.prototype.constructor = klass;
  }

  function MenuState(scene) {
    GameFramework.State.call(this, scene);
    //Resource preloading
    for(var i = 0; i < GameResources.tilesets.length; i++) {
      scene.loadSprite(GameResources.tilesets[i].name, 1, 0, true);
    }

    this.scene.loadSprite('player', 96, 4, true, 32);
    this.scene.loadSprite('zombie', 96, 4, true, 32);

    this.scene.remote_state = {}
    this.newgame = false;

    var gui = $("#game_frame");
    var that = this;
    gui.append($('<div/>', {class: 'game_popup', id:'game_start_screen'})
      .text("Zomba")
      .append($('<div/>', {class: 'scorebox', style: 'font-size: 0.4em;'}))
      .append($('<div/>', {class: 'game_popup_button', id: 'game_start_button'}).text("Loading...")
        .click(function(e) {
          if(that.scene.resources_loading === 0) {
            that.framework.pushState(new GameState(that.scene));
          }
        }
    )));

    this.scene.onLoad = function() {
      if(that.newgame == true) {
        $("#game_start_button").text("New Game");
      } else {
        $("#game_start_button").text("Continue");
        $("#game_start_screen").append($('<div/>', {class: 'game_popup_button', id: 'game_start_button'}).text("Restart")
          .click(function() {
            that.scene.sendCommand( { instruction: 'new_game'}, function( response ) {
              if(that.scene.resources_loading === 0) {
                that.scene.remote_state = response.state;
                that.framework.pushState(new GameState(that.scene));
              }
            })
          }));
      }
    }
    this.scene.sendCommand( { instruction: 'load_game'}, function( response ) {
      that.scene.remote_state = response.state;
      if(response.command === "new_game"){
        that.newgame = true;
      }
    } );

  }
  extend(MenuState, GameFramework.State);

  MenuState.prototype.focus = function() {
    $("#game_start_screen").show();
  }

  MenuState.prototype.blur = function() {
    $("#game_start_screen").hide();
  }

  function updateStats(that, state){
    $('#game_score').text("Ammo: "+ state.player.ammo + " Food: " + state.player.food );
    $('#time_left_box').text('Daylight left: ' + state.time_left + "");
    $('#game_lives').text("Party: " + state.player.party );
    $('#day_count_box').text("Day: " + state.player.days)

    if(state.game_state == "DAY_OVER" || state.game_state == "GAME_OVER") {
      while(that.framework.states.length > 2) { //remove all states back to required level
        that.framework.popState();
      }
      if(state.game_state == "DAY_OVER") {
        that.framework.pushState(new EndDayState(that.scene));
      } else {
        that.framework.pushState(new GameOverState(that.scene));
      }
    }

  }

  function GameState(scene) {
    GameFramework.State.call(this, scene);

    movemode = 0;
    $('<div/>', {
      id: 'street_frame'
    }).appendTo('#game_frame');
    $('<div/>', {
      id: 'game_terrain',
      class: 'game_terrain'
    }).appendTo('#street_frame');

    var gui = $('<div/>', {
      id: 'game_top_gui'
    }).appendTo('#game_frame');

    $('<div/>', {
      id: 'game_score'
    }).appendTo('#game_top_gui').text("Ammo: "+ this.scene.remote_state.player.ammo +" Food: " + this.scene.remote_state.player.food );

    $('<div/>', {
      id: 'game_active_word'
    }).appendTo('#game_top_gui')

    $("<div/>", {id:"time_left_box"}).text('Daylight left: ' + this.scene.remote_state.time_left).appendTo("#game_active_word");
    $("<div/>", {id:"day_count_box"}).text('Day: ' + this.scene.remote_state.player.days).appendTo("#game_active_word");  

    var that = this;
    $('<div />', { id: "wait_button", class: "game_button"}).appendTo('#game_active_word').text("Wait?").click( function(e) {
      e.stopPropagation();
      that.scene.sendCommand( { instruction: 'take_turn', turn: 'WAIT', data1: that.active_terrain}, function( response ) {
        that.scene.remote_state = response.state;
        updateStats(that, response.state);
      } );
    });


    $('<div/>', {
      id: 'game_lives'
    }).appendTo('#game_top_gui').text("Party: " + this.scene.remote_state.player.party );

    this.terrain = undefined;
    this.player = undefined;
    this.x = -(this.scene.remote_state.street.current_house * (GameResources.levels[1].width * 64));
    this.y = 0;
    this.moveDelta = 0;
    this.movemode = 0;
    this.world = []

    for( var i = 0; i < this.scene.remote_state.street.num_of_houses; i++) {
      this.world.push(1)
    }

    this.world_width = 0;
    this.active_terrain = undefined;
    this.terrain = []
    
    this.scene.onLoad = function() {
      for(var i = 0; i < that.world.length; i++) {
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
    $("#street_frame").remove();
    $("#game_top_gui").remove();
  }

  GameState.prototype.update = function(delta) {
    GameFramework.State.prototype.update.call(this, delta);
    
    if(this.scene.remote_state.game_state == "GAME_OVER") {
      updateStats(this, this.scene.remote_state);
    }
    //states out of sync
    if(this.scene.remote_state.game_state == "HOUSE") {
      this.framework.pushState(new HouseState(this.scene, this.scene.remote_state.house.num_of_rooms));
    }

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
          var that = this;
          this.scene.sendCommand( { instruction: 'take_turn', turn: 'MOVE', data1: this.active_terrain}, function( response ) { //choice to enter seems redundant
            that.scene.remote_state = response.state;
            that.scene.sendCommand( { instruction: 'take_turn', turn: 'ENTER', data1: that.active_terrain}, function( response ) {
              that.scene.remote_state = response.state;
              that.framework.pushState(new HouseState(that.scene, that.scene.remote_state.house.num_of_rooms));
              updateStats(that, response.state);
            } );
          } );
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

      if(this.x < (-(this.world_width - 450))) {
        this.x = (-(this.world_width - 450));
      }

      var new_y = this.player.position.y + vec.y;
      if(new_y < 340) {
        new_y = 340;
      }
      if(new_y > 700) {
        new_y = 700;
      }

      this.terrain[0].setPosition(this.x,0);
      this.player.setPosition(this.player.position.x, new_y);
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
    if(this.player == undefined) {
      return;
    }
    this.moveDelta = { x : e.relative.x - this.player.position.x, y : e.relative.y - this.player.position.y};
  }

  function HouseState(scene, rooms) {
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
    this.x = -((this.scene.remote_state.house.current_room * (GameResources.levels[2].width * 64)) - 250); //250 is player offset
    this.y = 0;
    this.moveDelta = 0;
    this.movemode = 0;
    rooms = rooms - 2;
    var middle = Math.round(rooms / 2);
    this.world  = [];
    this.world.push(4);
    for(var i = 0; i < rooms; i ++) {
      if(i!=(middle-1)) {
        this.world.push(3);
      } else {
        this.world.push(2);
      }
    }
    this.world.push(5);

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
      console.log("hi")
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

    if(this.scene.remote_state.game_state == "ZOMBIE") {
      this.framework.pushState(new RoomState(this.scene));
    }

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
            var that = this;
            this.scene.sendCommand( { instruction: 'take_turn', turn: 'SEARCH', data1: this.active_terrain}, function( response ) { //choice to enter seems redundant
              that.scene.remote_state = response.state;
              that.framework.pushState(new RoomState(that.scene));
              updateStats(that, response.state);
            });
          }
        }

        if(this.terrain[this.active_terrain].data.exit != undefined) {
          var door = this.terrain[this.active_terrain].data.exit;
          var door_offsetx = this.terrain[this.active_terrain].x;
          var door_offsety = this.terrain[this.active_terrain].y;

          if(this.playerInRect(door.x1 - door_offsetx, door.x2 - door_offsetx, door.y1 + door_offsety, door.y2 + door_offsety)) {
            var that = this;
            this.scene.sendCommand( { instruction: 'take_turn', turn: 'EXIT', data1: this.active_terrain}, function( response ) { //choice to enter seems redundant
              that.scene.remote_state = response.state;
              that.framework.popState();
              updateStats(that, response.state);
            });
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

      var new_y = this.player.position.y + vec.y;
      if(new_y < 404) {
        new_y = 404;
      }
      if(new_y > 600) {
        new_y = 600;
      }

      this.terrain[0].setPosition(this.x, 0);
      this.player.setPosition(this.player.position.x, new_y);
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
      
      for(var i = 0; i < that.scene.remote_state.room.zombies; i++) {
        new SpriteEngine.GameObject(that.scene, 'zombie', '#room_frame').setGroup('active_room_zombies').setPosition(getRandomInt(95,880),getRandomInt(136,480)).setScale(2.0).setState(getRandomInt(0,16));
      }
      for(var i = 0; i < that.scene.remote_state.room.people; i++) {
        new SpriteEngine.GameObject(that.scene, 'player', '#room_frame').setGroup('active_room_zombies').setPosition(getRandomInt(95,880),getRandomInt(136,480)).setScale(2.0).setState(getRandomInt(0,16));
      }

      that.updateTerrain();
    }
  }
  extend(RoomState, GameFramework.State);

  RoomState.prototype.playerInRect = function(x1, x2, y1, y2) {
    var x = this.player.position.x;
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

     if(this.scene.remote_state.game_state == "ZOMBIE") {
       this.framework.pushState(new ZombieState(this.scene));
     }

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
      this.player.position.x += vec.x;
      this.player.position.y += vec.y;

      if(this.player.position.x > 944){
        this.player.position.x = 944;
      }
      if(this.player.position.x < 60){
        this.player.position.x = 60;
      }
      if(this.player.position.y > 590){
        this.player.position.y = 590;
      }
      if(this.player.position.y < 150) {
        this.player.position.y = 150;
      }

      this.terrain[0].setPosition(this.x, 0);
      this.player.setPosition(this.player.position.x,this.player.position.y);
      this.updateTerrain();
    }
    
    this.scene.draw();
  }

  RoomState.prototype.click = function(e) {
    this.moveDelta = { x : e.relative.x - this.player.position.x, y : e.relative.y - this.player.position.y};
  }

  function ZombieState(scene) {
    GameFramework.State.call(this, scene);
    //Resource preloading
    var gui = $("#game_frame");
    var that = this;
    gui.append($('<div/>', {class: 'game_popup', id:'game_zombie_screen'})
      .text("Zombies .. AAAAH!")
      .append($('<div/>', {class: 'scorebox', style: 'font-size: 0.4em;'}))
      .append($('<div/>', {class: 'game_popup_button', id: 'game_attack_button'}).text("Attack!")
        .click(function(e) {
          if(that.scene.resources_loading === 0) {
            that.scene.sendCommand( { instruction: 'take_turn', turn: 'FIGHT', data1: 0}, function( response ) { 
              that.scene.remote_state = response.state;
              that.framework.popState(); //close popup
              updateStats(that, response.state);
            });
          }
        })
      ).append($('<div/>', {class: 'game_popup_button', id: 'game_flee_button'}).text("Flee!")
        .click(function(e) {
          if(that.scene.resources_loading === 0) {
            that.scene.sendCommand( { instruction: 'take_turn', turn: 'RUN', data1: 0}, function( response ) { 
              that.scene.remote_state = response.state;
              that.framework.popState(); //close popup
              that.framework.popState(); //leave room
              that.framework.popState(); //leave house
              updateStats(that, response.state);
            });
          }
        })
      )
    );
  }
  extend(ZombieState, GameFramework.State);

  ZombieState.prototype.destroy = function() {
    $("#game_zombie_screen").remove();
  }

  function EndDayState(scene) {
    GameFramework.State.call(this, scene);

    var gui = $("#game_frame");
    var that = this;
    gui.append($('<div/>', {class: 'game_popup', id:'game_status_screen', style: 'font-size: 2em;'})
      .text("Night has Fallen, You head back to camp and prepare for a new street in the morning")
      .append($('<div/>', {class: 'scorebox', style: 'font-size: 0.4em;'}))
      .append($('<div/>', {class: 'game_popup_button', id: 'game_status_button'}).text("Continue")
        .click(function(e) {
          that.scene.sendCommand( { instruction: 'end_day'}, function( response ) { 
            that.scene.remote_state = response.state;
            that.framework.popState();
            that.framework.pushState(new GameState(that.scene));
            updateStats(that, response.state);
          });
        })
      )
    );
  }
  extend(EndDayState, GameFramework.State);

  EndDayState.prototype.destroy = function() {
    $("#game_status_screen").remove();
  }

  function GameOverState(scene) {
    GameFramework.State.call(this, scene);

    var gui = $("#game_frame");
    var that = this;
    gui.append($('<div/>', {class: 'game_popup', id:'game_over_screen', style: 'font-size: 2em;'})
      .text("You Died, its sad, but everyone else is dead, so oh well")
      .append($('<div/>', {class: 'scorebox', style: 'font-size: 0.4em;'}))
      .append($('<div/>', {class: 'game_popup_button', id: 'game_over_button'}).text("Continue")
        .click(function(e) {
          that.framework.popState();
        })
      )
    );
  }
  extend(GameOverState, GameFramework.State);
  
  GameOverState.prototype.destroy = function() {
    $("#game_over_screen").remove();
  }

  window.app = {
    init: function() {
      this.scene = new SpriteEngine.Scene("#game_frame");
      this.framework = new GameFramework.Framework("body");
      this.framework.pushState(new MenuState(this.scene));
      this.framework.start();
    },
  }

  $(document).ready(function() {
    window.app.init();
  });

})(jQuery);