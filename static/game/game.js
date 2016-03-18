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

    this.world = [1,1,1,1,1,1,1,1]
    this.active_terrain = undefined;
    this.terrain = []

    var that = this;
    
    this.scene.onLoad = function() {
      for(var i = 0; i < 8; i++) {
        var level = that.world[i];
        that.terrain.push(new SpriteEngine.Terrain(that.scene, "#game_terrain", GameResources.levels[level], GameResources.levels[level].width * (i) * 64, 0 ));
      }
      that.player = new SpriteEngine.GameObject(that.scene, 'player', '#street_frame').setGroup('street').setPosition(450,500).setScale(2.0);
      that.player.spritestate.pause();

      that.updateTerrain();
    }
      
  }
  extend(GameState, GameFramework.State);

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
        //house hack
        if(this.x < 226 && this.x > 187 && this.y < -43 && this.y > -86) {
          this.framework.pushState(new HouseState(this.scene));
        }
        if(this.x < -63 && this.x > -96 && this.y < -44 && this.y > - 80) {
          this.framework.pushState(new HouseState(this.scene));
        }
        if(this.x < -348 && this.x > -385 && this.y < -45 && this.y > - 77) {
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
      /*
      if(this.movemode === 0) {
        if(this.terrain !== undefined) {
          this.terrain.setPosition(this.x -= vec.x, this.y -= vec.y);
        }
      } else if(this.movemode === 1) {
        this.player.setPosition(this.player.position.x + vec.x, this.player.position.y + vec.y);
      }*/

      this.terrain[0].setPosition(this.x -= vec.x,0);
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
      id: 'game_house'
    }).appendTo("#game_frame");

    this.terrain = undefined;
    this.player = undefined;
    this.moveDelta = 0;
    this.movemode = 1;

    this.terrain = new SpriteEngine.Terrain(this.scene, "#game_house", GameResources.levels[0], "active_house");
    this.player = new SpriteEngine.GameObject(this.scene, 'player', '#game_house').setGroup('active_house').setPosition(220,260).setScale(2).setState(3);
    this.player.spritestate.pause();
    for(var i = 0; i < getRandomInt(1, 5); i++) {
      new SpriteEngine.GameObject(this.scene, 'zombie', '#game_house').setGroup('active_house').setPosition(getRandomInt(31,381),getRandomInt(35,234)).setScale(2); 
    }
  }
  extend(HouseState, GameFramework.State);

  HouseState.prototype.reset = function() {
  }

  HouseState.prototype.destroy = function() {
    $("#game_house").remove();
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
        if(this.player.position.x > 202 && this.player.position.x < 233 && this.player.position.y >298 && this.player.position.y < 328) {
          this.framework.popState();
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
      
      if(this.movemode === 0) {
        x -= vec.x;
        y -= vec.y;
        $("#game_terrain").css("left", x + 'px');
        $("#game_terrain").css("top", y + 'px');
      } else if(this.movemode === 1) {
        this.player.setPosition(this.player.position.x + vec.x, this.player.position.y + vec.y);
      }
    }
    
    this.scene.draw();
  }

  HouseState.prototype.click = function(e) {
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