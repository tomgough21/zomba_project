(function($) {

  function add_layer(level, default_tileset, default_tile) {
    level.tiles.push([]);
    level.layers++;
    console.log(default_tileset);
    for ( var i = 0; i < level.width; i++) {
      for (var j = 0; j < level.height; j++) {
        level.tiles[level.tiles.length - 1].push([default_tileset,default_tile]);
      }
    }
    return level;
  }

  function create_level(width, height, default_tileset, default_tile) {
    var level = {width: width, height: height, layers: 0, tiles:[]}
    return add_layer(level, default_tileset, default_tile);
  }

  var extend = function(klass, base) {
    klass.prototype = Object.create(base.prototype);
    klass.prototype.constructor = klass;
  }

  function GameState(scene) {
    GameFramework.State.call(this, scene);

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
    }).appendTo('#game_top_gui').html("<a id='new_level_button' href='#'>New Level</a>&nbsp;<a id='save_level_button' href='#'>save</a><div><span>width<input id='level_width' type='text' name='width'></span><span>height<input id='level_height' type='text' name='height'></span></div>");

    jQuery('<div/>', {
      id: 'game_active_word'
    }).appendTo('#game_top_gui').html('No Selected Tile');

    jQuery('<div/>', {
      id: 'editor_layer_select'
    }).appendTo('#game_top_gui').html("Active Layer: ");

    this.layer_selector = $('<select id="layer_selection"/>').appendTo('#editor_layer_select');
    $('<a />', {id: 'create_new_layer', href: '#', html: "<br />add new layer"}).appendTo('#editor_layer_select');
    $('<a />', {id: 'remove_layer', href: '#', html: "<br />remove layer"}).appendTo('#editor_layer_select');
    var layer_selector = this.layer_selector;

    for(var i = 0; i < GameResources.tilesets.length; i++) {
      this.scene.loadSprite(GameResources.tilesets[i].name, 1, 0, true);
    }

    this.scene.loadSprite('player', 12, 4, true, 4);
    this.terrain = new Terrain('game_house');

    this.dx = 0;
    this.dy = 0;
    this.x = 20;
    this.y = 64;

    this.level = GameResources.levels[0];
    this.active_tile = undefined;
    this.active_tileset_id = undefined;
    this.active_layer = undefined;
    this.layers = []

    var that = this;

    $('#save_level_button').click(function() {
      $('#level_string')[0].value = JSON.stringify(that.level);
    });


    $('#load_level_button').click(function() {
      var text = $('#level_string')[0].value;
      try {
        that.level = JSON.parse(text);
        that.updateLayers(0);
      } catch (e) {
        alert("invalid input string");
        that.level = undefined;
        that.layers.splice(0,that.layers.length);
      }
    });

    $("#new_level_button").click(function(){
      if(that.active_tile === undefined) {
        alert("select a default tile");
        return;
      }
      var width = parseInt($("#level_width")[0].value);
      var height = parseInt($("#level_height")[0].value);
      if(width <= 0 || height <= 0 || isNaN(width) || isNaN(height)) {
        alert("enter level dimensions");
        return;
      }
      that.level = create_level(width, height, that.active_tileset_id, that.active_tile);
      that.active_layer = 0;
      layer_selector.find("option").remove();
      for(var i = 0; i < that.level.layers; i++) {
        $('<option />', {value: i, text: "layer " + i}).appendTo(layer_selector);
      }
      that.reDraw();
    });

    $("#remove_layer").click(function(){
      if(that.active_layer === undefined ) {
        return;
      }
      if(that.level.layers === 1){
        return
      }
      that.level.layers--;
      that.level.tiles.splice(that.active_layer, 1);
      that.layers.splice(that.active_layer, 1);
      if(that.active_layer > 0){
        that.active_layer --;
      }
      that.updateLayers(that.active_layer);
    });

    $("#create_new_layer").click(function(){
      if(that.level !== undefined && that.active_tileset_id != undefined && that.active_tile != undefined) {
        add_layer(that.level, that.active_tileset_id,  that.active_tile)
        that.updateLayers(that.level.layers - 1);
      }
    });

    layer_selector.change(function() {
      $( "select option:selected" ).each(function() {
        that.active_layer = parseInt(($(this)[0].value));
        for(var i = 0; i < that.layers.length; i++) {
          that.layers[i].css('pointer-events','none');
        }
        that.layers[that.active_layer].css('pointer-events', 'auto')
      });
    });

    
    this.scene.onLoad = function() {
      for(var k = 0; k < GameResources.tilesets.length; k++) {
        var layer = jQuery('<div/>', {
        }).appendTo('#tiles_frame');
        for(var i = 0; i < GameResources.tilesets[k].width; i++) {
          var column = jQuery('<div/>', {
            class: 'game_terrain_column'
          }).appendTo(layer);
          for(var j = 0; j < GameResources.tilesets[k].height; j++) {
            var tile = new SpriteEngine.GameObject(that.scene, GameResources.tilesets[k].name, column).setGroup('tilesets').setFrame((j*GameResources.tilesets[k].width)+i).setScale(2.0);
            tile.dom_obj.addClass('mark_grid');
            (function (i_index, j_index, tileset_id) {
              tile.dom_obj.click( function() {
                that.active_tile = (j_index* GameResources.tilesets[tileset_id].width)+i_index;
                that.active_tileset = GameResources.tilesets[tileset_id].name
                that.active_tileset_id = tileset_id;
                $("#game_active_word").text("<" + that.active_tileset + "> tile: " + that.active_tile)
              });
            })(i, j, k);
          }

        }
      }
      that.updateLayers(0);
    }
    
  }
  extend(GameState, GameFramework.State);

  GameState.prototype.updateLayers = function(set_active) {
    if(this.active_layer === undefined) {
      if(this.level === undefined) {
        return;
      }
      this.active_layer = set_active;
    }
    
    this.layer_selector.find("option").remove();
    for(var i = 0; i < this.level.layers; i++) {
      var selected = (i == this.active_layer)
      $('<option />', {value: i, text: "layer " + i, selected: selected}).appendTo(this.layer_selector);
    }
    this.reDraw();

    var that = this;
    $("#layer_selection").find( "option:selected" ).each(function() {
      that.active_layer = set_active;
      for(var i = 0; i < that.layers.length; i++) {
        that.layers[i].css('pointer-events','none');
      }
      console.log(that.active_layer);
      that.layers[that.active_layer].css('pointer-events', 'auto')
    });
  }

  GameState.prototype.reDraw = function() {
    if(this.level === undefined){
      return;
    }
    this.scene.clearGroup("terrain");
    $('#game_terrain').empty();
    this.layers.splice(0,this.layers.length) //odd way of clearing array, seamed the best solution, not sure what setting length to 0 would effect
    var that = this;
      for(var k = 0; k < that.level.layers; k++) {
        var layer = $('<div/>', {
          class: 'game_terrain_layer'
        }).appendTo('#game_terrain');
        for(var i = 0; i < that.level.width; i++) {
          var column = jQuery('<div/>', {
            class: 'game_terrain_column'
          }).appendTo(layer);
          for(var j = 0; j < that.level.height; j++) {
            var tileset_name = GameResources.tilesets[that.level.tiles[k][(j*that.level.width)+i][0]].name;
            var frame_id = that.level.tiles[k][(j*that.level.width)+i][1];
            var tile = new SpriteEngine.GameObject(that.scene, tileset_name, column).setGroup('terrain').setFrame(frame_id).setScale(2.0);
            (function(clicked_tile, tile_index) {
              tile.dom_obj.click(function() {
                if(that.active_tileset_id !== undefined) {
                  that.level.tiles[that.active_layer][tile_index][1] = that.active_tile;
                  that.level.tiles[that.active_layer][tile_index][0] = that.active_tileset_id;
                  clicked_tile.setSprite(GameResources.tilesets[that.active_tileset_id].name);
                  clicked_tile.setFrame(that.active_tile);
                }
              });
            })(tile, (j*that.level.width)+i);
          }
        }
        that.layers.push(layer);
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

    this.x -= this.dx;
    this.dx = 0;
    this.y -= this.dy;
    this.dy = 0;
    $("#game_terrain").css("left", this.x + 'px');
    $("#game_terrain").css("top", this.y + 'px');

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
  }

  GameState.prototype.keyDown = function(e) {
    
    switch(e.keyCode) {
      case 38:
        this.dy = -10;
        e.preventDefault();
        break;
      case 37:
        this.dx = -10;
        e.preventDefault();
        break;
      case 39:
        this.dx = 10;
        e.preventDefault();
        break;
      case 40:
        this.dy = 10;
        e.preventDefault();
        break;
    }

  }

  function getRandomInt(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function Terrain(data) {

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