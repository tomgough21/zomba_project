(function($) {
  var level_house = {width : 10, height : 7, tiles : [28, 29, 29, 29, 29, 29, 29, 29, 29, 30,
                                                      35, 6, 6, 6, 6, 6, 6, 6, 32, 37,
                                                      35, 6, 0 , 1 , 2 , 54, 55, 6, 39, 37,
                                                      35, 6, 7 , 8 , 9 , 61, 62, 6, 6, 37,
                                                      35, 6, 6, 6, 6, 6, 6, 6, 6, 37,
                                                      35, 6, 6, 6, 6, 6, 6, 6, 6, 37,
                                                      42, 43, 43, 43, 36, 43, 43, 43, 43, 44]};


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
    this.terrain = new Terrain('game_terrain');
    this.player = undefined;
    this.x = 43;
    this.y = -48;
    this.moveDelta = 0;
    this.movemode = 0;

    var that = this;
    
    this.scene.onLoad = function() {
      for(var i = 0; i < 25; i++) {
        var column = jQuery('<div/>', {
          class: 'game_terrain_column'
        }).appendTo('#game_terrain');
        for(var j = 0; j < 14; j++) {
          new SpriteEngine.GameObject(that.scene, GameResources.tilesets[0].name, column).setGroup('terrain').setFrame((j*GameResources.tilesets[0].width)+i).setScale(2.0);
        }
      }
      that.player = new SpriteEngine.GameObject(that.scene, 'player', '#street_frame').setGroup('street').setPosition(400,200).setScale(2.0);     
      that.player.spritestate.pause();
    }
      
  }
  extend(GameState, GameFramework.State);

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
      
      if(this.movemode === 0) {
        this.x -= vec.x;
        this.y -= vec.y;
        $("#game_terrain").css("left", this.x + 'px');
        $("#game_terrain").css("top", this.y + 'px');
      } else if(this.movemode === 1) {
        this.player.setPosition(this.player.position.x + vec.x, this.player.position.y + vec.y);
      }
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

    this.scene.loadSprite('tileset', 1, 0, true);
    this.scene.loadSprite('tileset_indoor', 1, 0, true);
    this.scene.loadSprite('player', 12, 4, true, 4);
    this.scene.loadSprite('zombie', 18, 4, true, 9);
    this.terrain = new Terrain('house_terrain');
    this.player = undefined;
    this.moveDelta = 0;
    this.movemode = 1;

    var that = this;

    this.scene.onLoad = function() {
      for(var i = 0; i < level_house.width; i++) {
        var column = jQuery('<div/>', {
          class: 'game_terrain_column'
        }).appendTo('#game_house');
        for(var j = 0; j < level_house.height; j++) {
          new SpriteEngine.GameObject(that.scene, 'tileset_indoor', column).setGroup('terrain').setFrame(level_house.tiles[(j*level_house.width)+i]).setScale(3.0);
        }
      }
      that.player = new SpriteEngine.GameObject(that.scene, 'player', '#game_house').setGroup('active_house').setPosition(220,260).setScale(1.5).setState(3);     
      for(var i = 0; i < getRandomInt(0, 5); i++) {
        new SpriteEngine.GameObject(that.scene, 'zombie', '#game_house').setGroup('active_house').setPosition(getRandomInt(31,381),getRandomInt(35,234)).setScale(1.5); 
      }
      that.player.spritestate.pause();
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
            this.player.spritestate.setState(2);
          }else {
            this.player.spritestate.setState(1);
          }
        } else {
          if(vec.y > 0) {
            this.player.spritestate.setState(0);
          }else {
            this.player.spritestate.setState(3);
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

  function Terrain(res) {}

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