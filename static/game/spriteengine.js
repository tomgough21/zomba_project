"use strict";
var SpriteEngine = (function () {
  var spriteEngine = {};

  function Scene(container) {
    this.container = container;
    this.objects = {
      all: [],
    };
    this.sprites = {};
    this.audio = {
      volume: 1.0,
      speed: 1.0,
      sounds: {},
      channels: []
    };
    this.resources_loading = 0;
  };

  Scene.prototype.getCookie = function(name) {
        var cookieValue = null;
        if (document.cookie && document.cookie != '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = jQuery.trim(cookies[i]);
                if (cookie.substring(0, name.length + 1) == (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }

  Scene.prototype.sendCommand = function(ob, command, func) {
    var that = this;
    that.command_func = func;
    that.ob = ob;
    var command_dict = {
      url: '/engine_update/',
      type: 'post',
      data: JSON.stringify(command),
      headers: {
          "X-CSRFToken": this.getCookie('csrftoken'),
      },
      dataType: 'json'
    }


    command_dict.success = function (data) {
      (function(meh){
        meh.resources_loading --;
        if(meh.command_func !== undefined){
          meh.command_func.bind(meh.ob)(data);
        }
      }(that));
    }

    jQuery.ajax(command_dict);
    this.resources_loading ++;
  }

  Scene.prototype.loadSound = function(name, file) {
    if (!(name in this.audio.sounds)) {
      var sound = new Audio(file);
      sound.load();
      this.audio.sounds[name] = {
        volume: 1.0,
        speed: 1.0,
        file: sound,
        instances: []
      };
    }
  }

  //allow for multichanel audio of the same sound, without creating more dom objects than sound that overlap 
  Scene.prototype.playSound = function(name, volume, speed) {

    var volume = volume || this.audio.sounds[name].volume || this.audio.volume;
    var speed = speed || this.audio.sounds[name].speed || this.audio.speed;

    var sound = this.audio.sounds[name];

    for (var i = sound.instances.length - 1; i >= 0; i--) {
      if (sound.instances[i].ended === true) {
        sound.instances[i].volume = volume;
        sound.instances[i].playbackRate = speed;
        sound.instances[i].play();
        return;
      }
    };

    var newinstance = new Audio(sound.file.src);
    newinstance.volume = volume;
    newinstance.playbackRate = speed;
    newinstance.play();
    sound.instances.push(newinstance);

  }

  Scene.prototype.loadSprite = function(type, frames, fps, repeat, states) {
    this.sprites[type] = new Sprite(type, frames, fps, repeat, states);
    this.resources_loading ++;
    var that = this;
    this.sprites[type].postSetup = function() {
      that.resources_loading --;
    }
  };

  Scene.prototype.getSprite = function(type) {
    if(type in this.sprites) {
      return new SpriteState(this.sprites[type]);
    }
    return undefined;
  };


  Scene.prototype.addGameObject = function(gameobject, group) {
    if(this.objects.all === undefined) {
      this.objects.all = [];
    }
    this.objects.all.push(gameobject);
    if (group !== undefined) {
      this.setGroup(gameobject, group);
    }
    return gameobject;
  };

  Scene.prototype.setGroup = function(object, group) {
    if (object.group !== undefined) {
      index = this.objects[object.group].indexOf(object);
      if (index !== -1) {
        this.objects[object.group].splice(index, 1);
      }
    }
    if (group in this.objects === false) {
      this.objects[group] = [];
    }
    this.objects[group].push(object);
    object.group = group;
  }

  Scene.prototype.killObject = function(object) {
    if(this.objects.kill === undefined) {
      this.objects.kill = [];
    }
    this.objects.kill.push(object);
  };

  Scene.prototype.removeGameObject = function(object) {
    var index = this.objects.all.indexOf(object);
    if (index !== -1) {
      this.objects.all[index].dom_obj.remove();
      this.objects.all.splice(index, 1);
      index = this.objects[object.group].indexOf(object);
      if (index !== -1) {
        this.objects[object.group].splice(index, 1);
      }
    }
  };

  Scene.prototype.clear = function() {
    for( var group in this.objects) {
      while(this.objects[group].length > 0) {
        this.removeGameObject(this.objects[group][0]);
      }
    }
  }

  Scene.prototype.clearGroup = function(group) {
    if(group in this.objects) {
      while(this.objects[group].length > 0) {
        this.removeGameObject(this.objects[group][0]);
      }
    }
  }

  Scene.prototype.update = function(delta) {
    if(this.objects.kill !== undefined) {
      while (this.objects.kill.length > 0) {
        this.removeGameObject(this.objects.kill.shift());
      }
    }

    if(this.objects.all !== undefined) {
      this.objects.all.forEach(function(object) {
        object.update(delta);
      })
    }
  };

  Scene.prototype.draw = function() {
    this.objects.all.forEach(function(object) {
      object.draw();
    })
  };

  function Sprite(type, frames, fps, repeat, states) {

    this.type = type;
    this.fps = fps;
    this.repeat = repeat;

    //force download
    this.dom_obj = jQuery('<div/>', {
      class: type,
      style: 'visibility: hidden;'
    }).appendTo("body");

    this.spritesheet = {};
    this.spritesheet.image = new Image();
    this.spritesheet.image.src = this.dom_obj.css('background-image').replace(/"/g, "").replace(/url\(|\)$/ig, "");
    this.spritesheet.frames = frames;
    this.spritesheet.tile_width = parseInt(this.dom_obj.css('width'));
    this.spritesheet.tile_height = parseInt(this.dom_obj.css('height'));
    this.spritesheet.states = states || 1;
    this.spritesheet.frames_per_state = this.spritesheet.frames / this.spritesheet.states;
    this.spritesheet.loaded = false;
    var that = this;

    this.spritesheet.image.onload = function() {
      that.setup();
    }

  };

  Sprite.prototype.setup = function() {
      this.spritesheet.width = this.spritesheet.image.width;
      this.spritesheet.height = this.spritesheet.image.height;
      this.spritesheet.loaded = true;
      this.spritesheet.frames_x = this.spritesheet.image.width / this.spritesheet.tile_width;
      this.spritesheet.frames_y = this.spritesheet.image.height / this.spritesheet.tile_height;
      this.dom_obj.remove();
      if(this.postSetup !== undefined) {
        this.postSetup();
      }
  }

  Sprite.prototype.isLoaded = function() {
    return this.spritesheet.loaded;
  }

  Sprite.prototype.getWidth = function() {
    return this.spritesheet.tile_width;
  }

  Sprite.prototype.getHeight = function() {
    return this.spritesheet.tile_height;
  }

  function SpriteState(sprite) {
    this.state = 0;
    this.sprite = sprite;
    this.frame = 0;
    this.fps = sprite.fps;
    this.x_offset = 0;
    this.y_offset = 0;
    this.dirty = true;
    this.finished = false;
  };

  SpriteState.prototype.update = function(delta) {
    if (this.finished === true || this.fps === 0 || this.playing === false) {
      return;
    }

    var oldframe = this.frame;
    this.frame = this.frame + (this.fps * delta);

    if (Math.floor(this.frame) >= (this.sprite.spritesheet.frames_per_state * this.state) + this.sprite.spritesheet.frames_per_state) {
      if (this.sprite.repeat == true) {
        this.frame = (this.sprite.spritesheet.frames_per_state * this.state) + (this.frame - (this.sprite.spritesheet.frames_per_state * this.state))  % this.sprite.spritesheet.frames_per_state;
      } else {
        this.finished = true;
      }
    }
    if (Math.floor(this.frame) !== Math.floor(oldframe)) {
      this.x_offset = -Math.floor(this.frame % this.sprite.spritesheet.frames_x) * this.sprite.spritesheet.tile_width;
      this.y_offset = -Math.floor(this.frame / this.sprite.spritesheet.frames_x) * this.sprite.spritesheet.tile_height;
      this.dirty = true;
    }
  }

  SpriteState.prototype.setFrame = function(frame) {
    if(frame !== this.frame) {
      this.frame = frame;
      this.dirty = true;
    }
  }

  SpriteState.prototype.setState = function(state) {
    if(state !== this.state) {
      this.state = state;
      this.frame = this.sprite.spritesheet.frames_per_state * this.state;
      this.dirty = true;
    }
  }

  SpriteState.prototype.pause = function() {
    this.playing = false;
  }

  SpriteState.prototype.play = function() {
    this.playing = true;
  }

  function GameObject(scene, spritename, targetcontainer) {
    this.position = {
      x: 0,
      y: 0,
      dirty: true,
    }
    this.velocity = {
      x: 0,
      y: 0,
    }
    this.scale = {
      x: 1.0,
      y: 1.0,
    }
    this.rotation = {
      degrees: 0,
      dirty: true,
    }

    this.spritestate = scene.getSprite(spritename);
    if(this.spritestate == undefined) {
      return undefined
    }
    this.sprite_width = this.spritestate.sprite.spritesheet.tile_width;
    this.sprite_height = this.spritestate.sprite.spritesheet.tile_height;

    this.size = {
      x: this.sprite_width * this.scale.x,
      y: this.sprite_height * this.scale.y,
      dirty: true,
    }

    this.active = false;
    if (this.velocity.x !== 0 || this.velocity.y !== 0) {
      this.active = true;
    }

    this.frame = 0;
    this.fps = 0;

    this.scene = scene;
    var container = targetcontainer || this.scene.container;
    this.dom_obj = jQuery('<div/>', {
      class: this.spritestate.sprite.type
    }).appendTo(container);
    this.scene.addGameObject(this);
  };

  GameObject.prototype.setSprite = function(spritename) {
    this.spritestate = this.scene.getSprite(spritename);
    this.sprite_width = this.spritestate.sprite.spritesheet.tile_width;
    this.sprite_height = this.spritestate.sprite.spritesheet.tile_height;
    this.size = {
      x: this.sprite_width * this.scale.x,
      y: this.sprite_height * this.scale.y,
      dirty: true,
    }
    this.dom_obj.attr('class', this.spritestate.sprite.type);
    return this;
  }

  GameObject.prototype.setPosition = function(x, y) {
    this.position.x = x;
    this.position.y = y;
    this.position.dirty = true;
    return this;
  };
  GameObject.prototype.setVelocity = function(x, y) {
    this.velocity.x = x;
    this.velocity.y = y;
    return this;
  };
  GameObject.prototype.setScale = function(x, y) {
    this.scale.x = x; 
    if(y === undefined) {
      this.scale.y = x;
    } else {
      this.scale.y = y;    
    }
    
    this.size.x = this.sprite_width * this.scale.x;
    this.size.y = this.sprite_height * this.scale.y;
    this.size.dirty = true;
    return this;
  };
  GameObject.prototype.setSize = function(x, y) {
    return this.setScale(x / this.sprite_width, y / this.sprite_height);
  };
  GameObject.prototype.setRotation = function(deg) {
    this.rotation.degrees = deg;
    this.rotation.dirty = true;
    return this;
  }
  GameObject.prototype.setGroup = function(group) {
    this.scene.setGroup(this, group);
    return this;
  }
  GameObject.prototype.setFrame = function(frame) {
    this.spritestate.setFrame(frame);
    return this;
  }
  GameObject.prototype.setState = function(state) {
    this.spritestate.setState(state);
    return this;
  }
  //TODO: placeholder
  GameObject.prototype.overlap = function(object) {
    return false;
  };

  GameObject.prototype.kill = function() {
    if (this.scene != null) {
      this.scene.killObject(this);
    }
  };

  GameObject.prototype.update = function(delta) {

    this.spritestate.update(delta);

    if (this.velocity.x || this.velocity.y) {
      this.setPosition(this.position.x + (this.velocity.x * delta), this.position.y + (this.velocity.y * delta));
    }

    if (this.spritestate.finished) {
      this.kill();
    }
  };

  //Dom updates
  GameObject.prototype.refreshDomPosition = function() {
    this.dom_obj.css('left', (this.position.x - ((this.spritestate.sprite.spritesheet.tile_width * this.scale.x) / 2)) + 'px');
    this.dom_obj.css('top', (this.position.y - ((this.spritestate.sprite.spritesheet.tile_height * this.scale.y) / 2)) + 'px');
    if(this.layer != undefined) {
      this.dom_obj.css('zIndex', ''+ this.layer);
    }

    this.position.dirty = false;
  };

  GameObject.prototype.refreshDomScale = function() {
    this.dom_obj.css('width', this.size.x + 'px');
    this.dom_obj.css('height', this.size.y + 'px');
    this.dom_obj.css('backgroundSize', this.spritestate.sprite.spritesheet.width * this.scale.x + 'px ' + this.spritestate.sprite.spritesheet.height * this.scale.y + 'px');
    this.size.dirty = false;
  };

  GameObject.prototype.refreshDomRotation = function() {
    //no css2 alternate
    this.dom_obj.css({
      transform: 'rotate(' + this.rotation.degrees + 'deg)'
    });
    this.rotation.dirty = false;
  };

  GameObject.prototype.refreshDomSprite = function() {
    this.spritestate.x_offset = -Math.floor(this.spritestate.frame % this.spritestate.sprite.spritesheet.frames_x) * this.spritestate.sprite.spritesheet.tile_width;
    this.spritestate.y_offset = -Math.floor(this.spritestate.frame / this.spritestate.sprite.spritesheet.frames_x) * this.spritestate.sprite.spritesheet.tile_height;
    this.dom_obj.css('backgroundPosition', this.spritestate.x_offset * this.scale.x + 'px ' + this.spritestate.y_offset * this.scale.y + 'px');
    this.spritestate.dirty = false;
  };

  GameObject.prototype.draw = function() {

    if (this.spritestate.sprite.isLoaded() == true) {
      if (this.size.dirty === true) {
        this.refreshDomScale();
      }

      if (this.position.dirty === true) {
        this.refreshDomPosition();
      }

      if (this.rotation.dirty === true) {
        this.refreshDomRotation();
      }

      if (this.spritestate.dirty === true) {
        this.refreshDomSprite();
      }
    }

  };

  var terrain_id = 0;
  function Terrain(scene, container, data, offset_x, offset_y) {
    this.parent = container
    this.container = $( "<div id = '" + container + '_' + terrain_id + "' />" ).appendTo($(this.parent));
    this.container.css("position", "relative");
    this.container.css("left", offset_x + 'px');
    this.container.css("top", offset_y + 'px');
    this.x = offset_x;
    this.y = offset_y;
    this.scene = scene;
    this.data = data;
    this.group = "terrain_" + terrain_id;
    this.layers = [];
    this.visible = false;
    terrain_id ++ ;
  }

  Terrain.prototype.setPosition = function(x,y) {
    $(this.parent).css( { left : x + 'px', 
                          top  : y + 'px' } );
  }

  Terrain.prototype.clear = function() {
    this.scene.clearGroup("terrain");
    $(this.container).empty();
    this.layers.splice(0,this.layers.length)
    this.visible = false;
  }

  Terrain.prototype.draw = function(clear) {
    if(this.data === undefined){
      return;
    }

    if(clear !== undefined) {
      this.scene.clearGroup(this.group);
      $(this.container).empty();
      this.layers.splice(0,this.layers.length)
    }

    for(var k = 0; k < this.data.layers; k++) {
      var style = "";
      if(k >= this.data.layers -2) {
        style = "z-index:10;";
      }
      var layer = $('<div/>', {
        class: 'game_terrain_layer',
        style: style,
      }).appendTo(this.container);
      this.layers.push(layer);

      for(var i = 0; i < this.data.width; i++) {
        var column = jQuery('<div/>', {
          class: 'game_terrain_column'
        }).appendTo(layer);

        for(var j = 0; j < this.data.height; j++) {
          var tileset_name = GameResources.tilesets[this.data.tiles[k][(j*this.data.width)+i][0]].name;
          var frame_id = this.data.tiles[k][(j*this.data.width)+i][1];
          var tile = new SpriteEngine.GameObject(this.scene, tileset_name, column).setGroup(this.group).setFrame(frame_id).setScale(2.0);
        }
      }
    }
    this.visible = true;
  }


  spriteEngine.Scene = Scene;
  spriteEngine.GameObject = GameObject;
  spriteEngine.Terrain = Terrain;

  return spriteEngine;
})();
