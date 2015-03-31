var AE = {'Assets':{},'MVC':{},'States':{},'Workers':{}};
var Game = {};
var Graphics = {};
var Graphics2D = {'Geometry':{}};
var Graphics3D = {'Geometry':{}};
var Audio = {};
var Network = {};

(function() {
  var AEPhaseStatusEnum, AE_CORE_PATH, asyncRequestURL, currentScript, moduleKeywords, scriptsArray, syncRequestUrl,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  AE.Network = Network;

  /*
    Simple Singleton implementation
  */


  AE.Singleton = (function() {

    function Singleton() {}

    Singleton._instance = null;

    /*
        @return {Object} an instance of the inheritting object
    */


    Singleton.getInstance = function() {
      return this._instance || (this._instance = new this());
    };

    return Singleton;

  })();

  Function.prototype.property = function(prop, desc) {
    return Object.defineProperty(this.prototype, prop, desc);
  };

  asyncRequestURL = function(URL, onSuccess) {
    var request;
    request = new XMLHttpRequest();
    request.open('GET', URL, true);
    request.responseType = 'blob';
    request.addEventListener('loadend', function() {
      if (request.status === 200) {
        return onSuccess(request.response);
      } else {
        return AE.error('could\'nt retrieve file: ' + URL);
      }
    });
    request.send();
    return request;
  };

  syncRequestUrl = function(URL, onSuccess) {
    var request;
    request = new XMLHttpRequest();
    request.open('GET', URL, false);
    request.responseType = 'blob';
    request.send();
    if (request.status === 200) {
      return onSuccess(request.response);
    } else {
      return AE.error('could\'nt retrieve file: ' + URL);
    }
  };

  /*
    AEIdFactory class aims to handle object identification through the engine via
    GUIDs
    This class follows the Singleton design pattern
    @extend AEEngine.AESingleton
  */


  AE.IdFactory = (function(_super) {

    __extends(IdFactory, _super);

    IdFactory.prototype._guids = null;

    /*
          constructor: called on singleton's new instance creation
    */


    function IdFactory() {
      this._guids = [];
    }

    /*
          has: checks if param guid has already been registered
          @param {String} the GUID to be checked
          @return {Boolean} whether the guid was found internally or not
    */


    IdFactory.prototype.has = function(guid) {
      if (this._guids.indexOf(guid.toString()) > -1) {
        return true;
      } else {
        return false;
      }
    };

    /*
        @return {String} a brand new and unique GUID
    */


    IdFactory.prototype.getGUID = function() {
      var newguid;
      newguid = this.guid();
      if (!this.has(newguid)) {
        this._guids.push(newguid);
      } else {
        newguid = this.getGUID();
      }
      return newguid;
    };

    /*
          GUID GENERATION FUNCTIONS
    */


    IdFactory.prototype.s4 = function() {
      return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    };

    IdFactory.prototype.guid = function() {
      return this.s4() + this.s4() + "-" + this.s4() + "-" + this.s4() + "-" + this.s4() + "-" + this.s4() + this.s4() + this.s4();
    };

    return IdFactory;

  })(AE.Singleton);

  moduleKeywords = ['extended', 'included'];

  /*
      AEObject: a base class for every object in the engine
  */


  AE.Object = (function() {

    function Object() {}

    Object.prototype._guid = null;

    Object.property('guid', {
      get: function() {
        if (this._guid === null) {
          this._guid = AE.IdFactory.getInstance().getGUID();
        }
        return this._guid;
      }
    });

    /*
        Init: default initializer for object
        this method is called upon instanciation of a new object of such class
    */


    Object.prototype.init = function() {};

    /*
        create: creates a new instance for the given object
                passes possible arguments to the objects init
                function.
                except for exceptions, EVERY instance should
                be created using this method
    
        @return {Object} an instance of the inherriting class
    */


    Object.create = function() {
      var C, inst;
      C = this;
      inst = new C();
      if (arguments.length > 0) {
        inst.init(arguments);
      } else {
        inst.init();
      }
      return inst;
    };

    /*
        Extension pattern:
        based on http://arcturo.github.io/library/coffeescript/03_classes.html
    */


    Object.extend = function(obj) {
      var key, value, _ref;
      for (key in obj) {
        value = obj[key];
        if (__indexOf.call(moduleKeywords, key) < 0) {
          this[key] = value;
        }
      }
      if ((_ref = obj.extended) != null) {
        _ref.apply(this);
      }
      return this;
    };

    Object.include = function(obj) {
      var key, value, _ref;
      for (key in obj) {
        value = obj[key];
        if (__indexOf.call(moduleKeywords, key) < 0) {
          this.prototype[key] = value;
        }
      }
      if ((_ref = obj.included) != null) {
        _ref.apply(this);
      }
      return this;
    };

    return Object;

  })();

  Graphics2D.ImageHandler = (function() {

    ImageHandler.prototype.imageDefaults = {
      x: 0,
      y: 0
    };

    function ImageHandler(opts) {
      var _this = this;
      opts = Object.extend(this.imageDefaults, opts);
      this.path = opts.path, this.x = opts.x, this.y = opts.y, this.width = opts.width, this.height = opts.height;
      this.img = new Image();
      this.img.addEventListener('load', function(e) {
        return _this.loaded = true;
      });
      this.img.src = this.path;
    }

    ImageHandler.prototype.draw = function(ctx) {
      if (this.loaded) {
        return ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
      }
    };

    return ImageHandler;

  })();

  Audio.SubSystem = (function(_super) {

    __extends(SubSystem, _super);

    SubSystem.prototype.setVolume = function(value) {
      return this.gainNode.gain.value = value / 100;
    };

    function SubSystem(names) {
      try {
        window.AudioContext = window.AudioContext || window.webkitAudioContext;
        this.context = new AudioContext();
        this.gainNode = this.context.createGain();
        this.gainNode.connect(this.context.destination);
      } catch (e) {
        AE.error(e);
        AE.error('AE.Audio : Web Audio API not supported');
      }
      this.loadMap(names);
    }

    return SubSystem;

  })(AE.Object);

  /*
      A simple Observer pattern design implementation
  */


  AE.Event = (function() {

    Event.prototype._subscribers = null;

    Event.prototype._sender = null;

    /*
          constructor: called on instance creation
          @param {Object} the event's sender
    */


    function Event(_sender) {
      this._sender = _sender;
      this._subscribers = [];
    }

    /*
          subscribe: adds a new object to the distribution list
          @param {Object} the listener object to be added
    */


    Event.prototype.subscribe = function(listener) {
      return this._subscribers.push(listener);
    };

    /*
        notify: distributes args to every subscriber
        @param {Object} args : an object containing the messages' arguments
    */


    Event.prototype.notify = function(args) {
      var i, _i, _ref, _results;
      _results = [];
      for (i = _i = 0, _ref = this._subscribers.length - 1; _i <= _ref; i = _i += 1) {
        _results.push(this._subscribers[i](this._sender, args));
      }
      return _results;
    };

    return Event;

  })();

  AE.Config = (function(_super) {

    __extends(Config, _super);

    function Config() {
      return Config.__super__.constructor.apply(this, arguments);
    }

    Config.prototype.setConfig = function(_opts) {
      this._opts = _opts;
      if (this._opts) {
        AE.log('--------------------');
        if (this._opts['name']) {
          AE.log("name: " + this._opts['name']);
        }
        if (this._opts['version']) {
          AE.log("version: " + this._opts['version']);
        }
        return AE.log('--------------------');
      }
    };

    Config.prototype.get = function(key) {
      if (this._opts[key]) {
        return this._opts[key];
      }
      AE.error("AE.Config: no such key \'" + key + "\'");
      return null;
    };

    return Config;

  })(AE.Singleton);

  AE.log = function(message) {
    return console.log(message);
  };

  AE.debug = function(message) {
    return console.debug(message);
  };

  AE.error = function(message) {
    return console.error(message);
  };

  AEPhaseStatusEnum = Object.freeze({
    ACTIVE: 0,
    PAUSED: 1
  });

  /*
    AEGamePhase :
      represents a single state for the engine
    @extends AEngine.AEObject
  */


  AE.States.GamePhase = (function(_super) {

    __extends(GamePhase, _super);

    GamePhase.prototype._status = AEPhaseStatusEnum.PAUSED;

    GamePhase.prototype._statusChangedEvent = null;

    /*
        Constructor:
    
        @param {String} _name : A human readable name
        @param {Function} _in : the function to be triggered when entering the state
        @param {Function} _out : the function to be triggered when leaving the state
        @param {Function} _run : the function handling the state
    */


    function GamePhase(_name, _in, _out, _run) {
      this._name = _name;
      this._in = _in;
      this._out = _out;
      this._run = _run;
      this._statusChangedEvent = new AE.Event(this);
      this._statusChangedEvent.subscribe(this.onStatusChanged);
    }

    /*
        dispatches a statusChangedEvent
    
        @event statusChangedEvent
    */


    GamePhase.prototype.notifyStatusChanged = function() {
      return this._statusChangedEvent.notify({
        'status': this._status
      });
    };

    /*
        Override me to unleash the kraken
    */


    GamePhase.prototype.onStatusChanged = function(sender, args) {};

    /*
        self explanatory
    */


    GamePhase.prototype.setActive = function() {
      this._status = AEPhaseStatusEnum.ACTIVE;
      return this.notifyStatusChanged();
    };

    /*
        self explanatory
    */


    GamePhase.prototype.setUnactive = function() {
      this._status = AEPhaseStatusEnum.PAUSED;
      return this.notifyStatusChanged();
    };

    /*
        self explanatory
    */


    GamePhase.prototype["in"] = function() {
      return this._in();
    };

    /*
        self explanatory
    */


    GamePhase.prototype.out = function() {
      return this._out();
    };

    /*
        self explanatory
    */


    GamePhase.prototype.run = function() {
      return this._run();
    };

    return GamePhase;

  })(AE.Object);

  /*
    AEGamePhasesManager aims to handle game states and their transitions.
  
    @extend AESingleton
    TODO: Add some error checking in case of failing to transit
  */


  AE.States.GamePhasesManager = (function(_super) {

    __extends(GamePhasesManager, _super);

    GamePhasesManager.prototype._phases = null;

    GamePhasesManager.prototype._current = null;

    function GamePhasesManager() {
      this._phases = {};
    }

    /*
        @param {String} phase : the name of the game phase to check for
        @return {Boolean} (true|false) depending on whether the manager knows
        about it or not
    */


    GamePhasesManager.prototype.has = function(phase) {
      if (this._phases.hasOwnProperty(phase)) {
        return true;
      } else {
        return false;
      }
    };

    /*
        addPhase :
          creates a phase for the game, based on the following parameters
    
        @param {String} name : a name for the phase MUST BE UNIQUE
        @param {Function} actionIn : the action to perform when entering the state
        @param {Function} actionOut : the action to perform when leaving the state
        @param {Function} run : the action to perform when running the state
    */


    GamePhasesManager.prototype.addPhase = function(name, actionIn, actionOut, run) {
      if (this.has(name)) {
        return AE.error("Phase " + name + " already exists");
      } else {
        this._phases[name] = new AE.States.GamePhase(name, actionIn, actionOut, run);
        return AE.Router.getInstance().add(name, (function() {
          AE.log("applying route");
          return AE.States.GamePhasesManager.getInstance().setCurrent(name);
        }).bind(name));
      }
    };

    /*
        current: returns the name of the current state
    */


    GamePhasesManager.prototype.current = function() {
      return this._current;
    };

    /*
        setCurrent:
          gets straight to state specified
    
        @param {String} current : the state to be set as the current one
    */


    GamePhasesManager.prototype.setCurrent = function(current) {
      if (this.has(current.toString())) {
        AE.Router.getInstance().navigate(current);
        this._current = this._phases[current.toString()];
        this._current.setActive();
        this._current["in"]();
        return this._current.run();
      } else {
        return AE.error("No such phase: " + current);
      }
    };

    /*
        setCurrent:
         gets to the specified state by appliying the transitions
         (if any were associated with the states)
    
        @param {String} next : the state to be set as the current one
    */


    GamePhasesManager.prototype.transitionTo = function(next) {
      if (this._current === null) {
        return AE.error("No current phase was set, can't transit from nowhere");
      } else {
        this._current.out();
        this._current.setUnactive();
        return this.setCurrent(next);
      }
    };

    return GamePhasesManager;

  })(AE.Singleton);

  AE.Engine = (function(_super) {

    __extends(Engine, _super);

    function Engine(opts) {
      console.log("imma new engine boy!");
    }

    return Engine;

  })(AE.Object);

  AE.FileSystem = (function(_super) {

    __extends(FileSystem, _super);

    function FileSystem() {
      return FileSystem.__super__.constructor.apply(this, arguments);
    }

    FileSystem.prototype._filesMap = null;

    FileSystem.prototype._isCreated = null;

    FileSystem.prototype._stack = [];

    FileSystem.prototype.createFileSystem = function(callBack) {
      this._stack.push(callBack);
      if (this._isCreated === null) {
        this._filesMap = {};
        return this.onInitFS();
      }
    };

    FileSystem.prototype.onInitFS = function() {
      var callback, _i, _len, _ref;
      this._isCreated = true;
      _ref = this._stack;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        callback = _ref[_i];
        callback.call();
      }
      return this._stack = [];
    };

    FileSystem.prototype.writeFile = function(filePath, file, onWrite) {
      var blob,
        _this = this;
      if (this._filesMap) {
        if (this._filesMap[filePath]) {
          return AE.error("A FILE NAMED " + filePath + " ALREADY EXISTS");
        } else {
          blob = new Blob([file]);
          this._filesMap[filePath] = blob;
          if (onWrite) {
            return onWrite(blob);
          }
        }
      } else {
        return this.createFileSystem(function() {
          return _this.writeFile(filePath, file, onWrite);
        });
      }
    };

    FileSystem.prototype.readFile = function(filePath, onSuccess, onError, returnType) {
      var file, fileReader,
        _this = this;
      if (returnType == null) {
        returnType = 'text';
      }
      if (this._filesMap) {
        if (this._filesMap[filePath]) {
          file = this._filesMap[filePath];
          fileReader = new FileReader();
          fileReader.onloadend = function() {
            return typeof onSuccess === "function" ? onSuccess(fileReader.result) : void 0;
          };
          switch (returnType) {
            case 'text':
              return fileReader.readAsText(file);
            case 'url':
              return fileReader.readAsDataURL(file);
          }
        } else {
          AE.error('FILE NOT FOUND : #{filePath}');
          return typeof onError === "function" ? onError() : void 0;
        }
      } else {
        return this.createFileSystem(function() {
          return _this.readFile(filePath, onSuccess);
        });
      }
    };

    FileSystem.prototype.readFileSync = function(filePath, returnType) {
      var loaded, onLoaded, res;
      if (returnType == null) {
        returnType = 'text';
      }
      loaded = false;
      res = null;
      onLoaded = function(result) {
        console.log('loaded');
        loaded = true;
        return res = result;
      };
      this.readFile(filePath, onLoaded, onLoaded, returnType);
      while (!loaded) {
        true;
      }
      return res;
    };

    FileSystem.prototype.readBuffer = function(filePath, onSuccess) {
      var file, fileReader;
      if (this._filesMap) {
        if (this._filesMap[filePath]) {
          file = this._filesMap[filePath];
          fileReader = new FileReader();
          if (onSuccess) {
            fileReader.onloadend = function() {
              return onSuccess(fileReader.result);
            };
            return fileReader.readAsArrayBuffer(file);
          } else {
            return AE.error('FILE NOT FOUND : #{filePath}');
          }
        }
      } else {
        this.createFileSystem(function() {});
        return this.readFile(filePath, onSuccess);
      }
    };

    return FileSystem;

  })(AE.Singleton);

  AE.Assets.URLLoader = (function(_super) {

    __extends(URLLoader, _super);

    URLLoader.prototype.isReady = false;

    URLLoader.prototype._fileURL = null;

    URLLoader.prototype._file = null;

    function URLLoader(_fileURL, _onSuccess, _filepath) {
      this._fileURL = _fileURL;
      this._onSuccess = _onSuccess;
      this._filepath = _filepath;
      if (!this._filepath) {
        this._filepath = this.guid;
      }
      this.guid;
    }

    URLLoader.prototype.load = function() {
      if (this._fileURL) {
        return this.requestURL();
      } else {
        return AE.error('no file URL were specified');
      }
    };

    URLLoader.prototype.requestURL = function() {
      var _this = this;
      return asyncRequestURL(this._fileURL, function(blob) {
        return AE.FileSystem.getInstance().writeFile(_this.guid, blob, function() {
          return _this._onSuccess(_this._filepath);
        });
      });
    };

    return URLLoader;

  })(AE.Object);

  /*
  	TODO: Handle names collisions
  */


  AE.Assets.Manager = (function(_super) {

    __extends(Manager, _super);

    function Manager() {
      return Manager.__super__.constructor.apply(this, arguments);
    }

    Manager.prototype.assetsOrigin = [];

    Manager.prototype.assets = {};

    Manager.prototype.length = 0;

    Manager.prototype.register = function(filesMap) {
      var assetPath, _i, _len, _results;
      if (filesMap == null) {
        filesMap = [];
      }
      _results = [];
      for (_i = 0, _len = filesMap.length; _i < _len; _i++) {
        assetPath = filesMap[_i];
        if (this.assets[assetPath] === void 0) {
          this.assets[assetPath] = null;
          _results.push(this.length++);
        } else {
          _results.push(AE.debug("ASSETS: " + assetPath + " has already been registered"));
        }
      }
      return _results;
    };

    Manager.prototype.load = function(onReady, onOneAssetLoaded) {
      var asset, assetPath, _ref, _results;
      this.remaining = this.length;
      _ref = this.assets;
      _results = [];
      for (assetPath in _ref) {
        asset = _ref[assetPath];
        if (asset === null) {
          _results.push(this.loadSingleAsset(assetPath, onReady, onOneAssetLoaded));
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    Manager.prototype.loadSingleAsset = function(assetPath, onReady, onOneAssetLoaded) {
      var loader,
        _this = this;
      loader = this.createURLLoader(assetPath, function(file) {
        AE.log("" + assetPath + " ready");
        _this.assets[assetPath] = file;
        _this.remaining = _this.remaining - 1;
        if (typeof onOneAssetLoaded === "function") {
          onOneAssetLoaded(_this.remaining);
        }
        if (_this.remaining === 0) {
          return onReady();
        }
      });
      return loader.load();
    };

    Manager.prototype.has = function(path) {
      return this.assets[path] === void 0;
    };

    Manager.prototype.get = function(name) {
      if (this.assets[name] === null) {
        return AE.log("" + name + " not loaded yet");
      } else if (this.assets[name] === void 0) {
        return AE.error("" + name + " not referenced");
      } else {
        return this.assets[name];
      }
    };

    Manager.prototype.getSyncFile = function(path) {
      return AE.FileSystem.getInstance().readFileSync(this.get(path), 'url');
    };

    Manager.prototype.createURLLoader = function(fileURL, onSuccess) {
      var loader;
      loader = new AE.Assets.URLLoader(fileURL, onSuccess);
      return loader;
    };

    return Manager;

  })(AE.Singleton);

  if (self.document) {
    scriptsArray = document.getElementsByTagName('script');
    currentScript = scriptsArray[scriptsArray.length - 1];
    AE_CORE_PATH = currentScript.src.replace(/\/script\.js$/, '/');
  }

  AE.MVC.Controller = (function() {

    function Controller() {}

    Controller.prototype.init = function() {};

    return Controller;

  })();

  AE.MVC.Model = (function(_super) {

    __extends(Model, _super);

    function Model() {
      return Model.__super__.constructor.apply(this, arguments);
    }

    Model.prototype._propertyChangedEvent = null;

    Model.prototype.init = function() {
      return this._propertyChangedEvent = new AE.Event(this);
    };

    /*
        get property value
    */


    Model.prototype.get = function(key) {
      return this[key];
    };

    /*
    		sets the key property with the value passed
    */


    Model.prototype.set = function(key, value) {
      this[key] = value;
      return this.notifyPropertyChanged(key);
    };

    /*
        notifyPropertyChanged:
    			notifies subscribers that a property was modified
    */


    Model.prototype.notifyPropertyChanged = function(property) {
      return this._propertyChangedEvent.notify({
        'property': property
      });
    };

    return Model;

  })(AE.Object);

  AE.MVC.View = (function(_super) {

    __extends(View, _super);

    function View() {
      return View.__super__.constructor.apply(this, arguments);
    }

    View.prototype.init = function() {};

    return View;

  })(AE.Object);

  /*
   MessageBox:
      A message box accessible by every object
  */


  AE.MessageBox = (function() {

    function MessageBox() {}

    MessageBox.prototype._messages = null;

    /*
        @param {String} dest : the guid for the message recipient
        @param {String} message : self explanatory
    */


    MessageBox.prototype.post = function(dest, message) {
      return this._messages[dest].push(message);
    };

    /*
        @param {String} dest : the guid for the message recipient
        @return {Array.<String>} an array containing all the messages since the last
        update
    */


    MessageBox.prototype.get = function(dest) {
      return this._messages[dest];
    };

    /*
        @param {string} dest : the guid for the message recipient
    */


    MessageBox.prototype.flush = function(dest) {
      return this._messages[dest] = [];
    };

    MessageBox.prototype.onMessage = function(e) {
      return self.postMessage('hello from MessageBox !');
    };

    return MessageBox;

  })();

  /*
  	AE.Router is the bridge between AE.GamePhase and the window.location
  
    adapted from:
    krasimirtsonev.com/blog/article/A-modern-JavaScript-router-in-100-lines-\
  history-api-pushState-hash-url
  */


  AE.Router = (function(_super) {

    __extends(Router, _super);

    Router.prototype._routes = [];

    Router.prototype._root = '/';

    function Router() {
      var _this = this;
      window.addEventListener("hashchange", (function() {
        return _this.listen();
      }), false);
      window.addEventListener('load', function(e) {
        return AE.Router.getInstance().check();
      });
    }

    /*
        getFragment:
        gets the current URL fragment from browser
    */


    Router.prototype.getFragment = function() {
      var frag, match;
      match = window.location.href.match(/#(.*)$/);
      frag = this._clearSlashes(match ? match[1] : '');
      return frag;
    };

    /*
        clearSlashes:
        @param {String} path : the path to be cleaned up
    */


    Router.prototype._clearSlashes = function(path) {
      return path.toString().replace(/\$/, '').replace(/^\//, '');
    };

    /*
        add: associates a regexp to a handler
        @param {String} re : a regexp defining the route
        @param {Function} handler: what to do with the route
    */


    Router.prototype.add = function(re, handler, isRoot) {
      this._routes.push({
        re: re,
        handler: handler
      });
      if (isRoot) {
        this._root = re;
      }
      return this;
    };

    /*
        remove:
        @param {Function,String} param a selector for a route to remove
    */


    Router.prototype.remove = function(param) {
      var route, _i, _len, _ref;
      _ref = this._routes;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        route = _ref[_i];
        if (route.handler === param || route.re.toString() === param.toString()) {
          this._routes.splice(i, 1);
          return this;
        }
      }
      return this;
    };

    /*
        flush: reinits the Router
    */


    Router.prototype.flush = function() {
      this._routes = [];
      return this._root = '/';
    };

    /*
        check: applies the handler for a path fragment
        (if any)
    
        @param {frag} the path fragment to be checked
    */


    Router.prototype.check = function(frag) {
      var fragment, match, route, _i, _len, _ref;
      fragment = frag || this.getFragment();
      _ref = this._routes;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        route = _ref[_i];
        match = fragment.match(route.re);
        if (match) {
          match.shift();
          route.handler.apply({}, match);
          return this;
        }
      }
      AE.log("AE.Router: no such route " + fragment + ", redirecting at index");
      return this.navigate(this._root);
    };

    /*
        listen: hashchanged event listener
          retrieves the current path and applies check on it
    */


    Router.prototype.listen = function() {
      if (window.location.hash !== this.current) {
        this.current = window.location.hash;
        return this.check(this.current);
      }
    };

    /*
        navigate: sets up a new hash path in the browser
    
        @param {String} path
    */


    Router.prototype.navigate = function(path) {
      path = path || '';
      window.location.href.match(/#(.*)$/);
      window.location.href = window.location.href.replace(/#(.*)$/, '') + ("#" + path);
      return this;
    };

    return Router;

  })(AE.Singleton);

  /*
      Manager : a JS Workers managing class
          each instance creates it's own Worker with the script passed as an
          argument the AEWorker class is the interface for communicating with
          the Worker
          TODO: fromFile instantiation
          TODO: worker interface
  */


  /*
    new logic:
      - instantiating worker
      - send message "ask for context" from worker
      - on context ready, mark worker as ready
  */


  AE.Workers.Manager = (function(_super) {

    __extends(Manager, _super);

    function Manager() {
      return Manager.__super__.constructor.apply(this, arguments);
    }

    Manager.prototype._workers = [];

    Manager.prototype._libBlob = null;

    Manager.prototype.createFromScript = function(script) {
      var blob, blobURL, worker;
      blob = new Blob([script], {
        type: 'application/javascript'
      });
      blobURL = URL.createObjectURL(blob);
      worker = new Worker(blobURL);
      this._workers.push(worker);
      URL.revokeObjectURL(blobURL);
      return worker;
    };

    Manager.prototype.createWithMessagingSystem = function() {
      var core, mb, script, worker;
      script = "    self.requestFileSystemSync = \      self.webkitRequestFileSystemSync || self.requestFileSystemSync;\n\    self.resolveLocalFileSystemURL = \      self.webkitResolveLocalFileSystemURL || self.resolveLocalFileSystemURL;\n\    self.onmessage = function(e) {\n\      var data = e.data;\n\      switch (data.cmd) {\n\        case 'start':\n\          self.postMessage('WORKER STARTED: ' + data.msg);\n\          break;\n\        case 'stop':\n\          self.postMessage('WORKER STOPPED: ' + data.msg +'.\            (buttons will no longer work)');\n\          self.close();\n\          break;\n\        case 'loadContext':\n\          eval(data.msg);\n\        case 'loadFile':\n\          try{\n\            self.resolveLocalFileSystemURL(data.msg, function(fileEntry) {\n\              console.log(fileEntry.name);\n\            });\n\          } catch (e) {\n\            console.error(e);\n\          }\n\          break;\n\        case 'importScript':\n\          console.log(data.msg);\n\          importScripts(data.msg);\n\          self;          break;\n\        case 'onmessage':\n\          self.onmessage = data.msg;\n\          break;\n\        default:\n\          self.postMessage('Unknown command: ' + data.msg);\n\        };\n\    };\n\    ";
      worker = this.createFromScript(script);
      worker.onmessage = this._onWorkerMessage;
      mb = new AE.MessageBox();
      core = AE.Assets.Manager.getInstance().createURLLoader(AE_CORE_PATH, function(filepath) {
        return AE.FileSystem.getInstance().readFile(filepath, function(file) {
          return worker.postMessage({
            'cmd': 'loadContext',
            'msg': file
          });
        });
      });
      return core.load();
    };

    Manager.prototype._onWorkerMessage = function(event) {
      return console.log(event.data);
    };

    Manager.prototype.sendMessageTo = function(index, msg) {
      return this._workers[index].postMessage(msg);
    };

    return Manager;

  })(AE.Singleton);

  AE.Game = Game;

  Game.Engine = (function(_super) {

    __extends(Engine, _super);

    Engine.prototype.phasesManager = null;

    Engine.prototype._messageBox = null;

    Engine.property('MessageBox', {
      get: function() {
        if (!this._messageBox) {
          this._messageBox = AE.Workers.Manager.getInstance().createWithMessagingSystem();
        }
        return this._messageBox;
      }
    });

    function Engine(opts) {
      AE.Config.getInstance().setConfig(opts);
      this.MessageBox = this.MessageBox;
      this.phasesManager = AE.States.GamePhasesManager.getInstance();
    }

    return Engine;

  })(AE.Engine);

  (function() {
    var lastTime, vendors, x;
    lastTime = 0;
    vendors = ["ms", "moz", "webkit", "o"];
    x = 0;
    while (x < vendors.length && !window.requestAnimationFrame) {
      window.requestAnimationFrame = window[vendors[x] + "RequestAnimationFrame"];
      window.cancelAnimationFrame = window[vendors[x] + "CancelAnimationFrame"] || window[vendors[x] + "CancelRequestAnimationFrame"];
      ++x;
    }
    if (!window.requestAnimationFrame) {
      window.requestAnimationFrame = function(callback, element) {
        var currTime, id, timeToCall;
        currTime = new Date().getTime();
        timeToCall = Math.max(0, 16 - (currTime - lastTime));
        id = window.setTimeout(function() {
          callback(currTime + timeToCall);
        }, timeToCall);
        lastTime = currTime + timeToCall;
        return id;
      };
    }
    if (!window.cancelAnimationFrame) {
      window.cancelAnimationFrame = function(id) {
        clearTimeout(id);
      };
    }
  })();

  Graphics2D.Camera = (function(_super) {
    var x, y;

    __extends(Camera, _super);

    x = 0;

    y = 0;

    Camera.prototype.speed = 800;

    Camera.prototype.scaleFactor = 1;

    function Camera(_dom, scene, x, y, cameraW, cameraY, sceneW, sceneY) {
      this._dom = _dom;
      this.scene = scene;
      this.x = x;
      this.y = y;
      this.cameraW = cameraW;
      this.cameraY = cameraY;
      this.sceneW = sceneW;
      this.sceneY = sceneY;
      this._initControls();
    }

    Camera.prototype.update = function(step) {
      step /= 1000;
      if (this.goLeft) {
        if (this.x > 10) {
          this.x += (20 * step) / this.scaleFactor;
        }
      }
      if (this.goUp) {
        if (this.y > 10) {
          this.y += (20 * step) / this.scaleFactor;
        }
      }
      if (this.goDown) {
        if (this.y < this.scene.height()) {
          this.y -= 20 * step;
        }
      }
      if (this.goRight) {
        if (this.x < this.scene.width()) {
          return this.x -= 20 * step;
        }
      }
    };

    Camera.prototype.resize = function(width, height) {
      if (width == null) {
        width = this.cameraW;
      }
      if (height == null) {
        height = this.cameraY;
      }
      this._dom.width = width;
      return this._dom.height = height;
    };

    Camera.prototype.position = function(x, y) {
      this.x = x != null ? x : this.x;
      this.y = y != null ? y : this.y;
      return {
        x: this.x,
        y: this.y
      };
    };

    Camera.prototype.scale = function(ctx) {
      return ctx.scale(this.scaleFactor, this.scaleFactor);
    };

    Camera.prototype.onMouseWheel = function(e) {
      var delta;
      e = window.event || e;
      delta = Math.max(-1, Math.min(1, e.wheelDelta || -e.detail));
      if (this.scaleFactor <= 3 && this.scaleFactor >= 0.5) {
        this.scaleFactor += delta / 50;
        if (delta < 0) {
          this.scaleFactor = Math.max(this.scaleFactor, 0.5);
        }
        if (delta > 0) {
          this.scaleFactor = Math.min(this.scaleFactor, 3);
        }
      }
      return false;
    };

    Camera.prototype.onKeyChange = function(e, value) {
      switch (e.keyCode) {
        case 37:
          return this.goLeft = value;
        case 38:
          return this.goUp = value;
        case 39:
          return this.goRight = value;
        case 40:
          return this.goDown = value;
      }
    };

    Camera.prototype._initControls = function() {
      var _this = this;
      if (window.addEventListener) {
        window.addEventListener("mousewheel", (function(e) {
          return _this.onMouseWheel(e);
        }), false);
        window.addEventListener("DOMMouseScroll", (function(e) {
          return _this.onMouseWheel(e);
        }), false);
      } else {
        window.attachEvent("onmousewheel", (function(e) {
          return _this.onMouseWheel(e);
        }));
      }
      window.addEventListener("keyup", function(e) {
        return _this.onKeyChange(e, false);
      });
      return window.addEventListener("keydown", function(e) {
        return _this.onKeyChange(e, true);
      });
    };

    return Camera;

  })(AE.Object);

  Graphics2D.Clickable = {
    intersects: function(x, y) {
      return false;
    },
    onClick: function() {
      return console.log("Baby touch me one more time");
    }
  };

  Graphics2D.Drawable = (function(_super) {

    __extends(Drawable, _super);

    function Drawable() {
      return Drawable.__super__.constructor.apply(this, arguments);
    }

    Drawable.prototype.update = function() {};

    Drawable.prototype.draw = function(ctx) {};

    return Drawable;

  })(AE.Object);

  Object.extend = function(destination, source) {
    var property;
    for (property in source) {
      destination[property] = source[property];
    }
    return destination;
  };

  Graphics2D.Geometry.Circle = (function(_super) {

    __extends(Circle, _super);

    Circle.prototype.defaults = {
      strokeStyle: "#00FF00",
      strokeSize: 1
    };

    function Circle(opts) {
      opts = Object.extend(this.defaults, opts);
      this.x = opts.x, this.y = opts.y, this.radius = opts.radius, this.strokeStyle = opts.strokeStyle, this.strokeSize = opts.strokeSize;
      this.squareRadius = this.radius * this.radius;
    }

    Circle.prototype.draw = function(ctx) {
      var _ref;
      ctx.save();
      ctx.translate(this.x, this.y);
      if ((_ref = this.imageHandler) != null) {
        _ref.draw(ctx);
      }
      return ctx.restore();
    };

    Circle.prototype.intersects = function(x, y) {
      if ((x - this.x) * (x - this.x) + (y - this.y) * (y - this.y) <= this.squareRadius) {
        return true;
      }
      return false;
    };

    Circle.prototype.onClick = function() {
      return console.log("Baby touch me one more time");
    };

    Circle.prototype.fillWithImage = function(opts) {
      return this.imageHandler = new Graphics2D.ImageHandler(opts);
    };

    return Circle;

  })(Graphics2D.Drawable);

  Graphics2D.Geometry.Rectangle = (function(_super) {

    __extends(Rectangle, _super);

    Rectangle.include(Graphics2D.Drawable);

    function Rectangle(x, y, width, height, color) {
      this.x = x;
      this.y = y;
      this.width = width;
      this.height = height;
      this.color = color;
    }

    Rectangle.prototype.draw = function(ctx) {
      ctx.fillStyle = this.color;
      ctx.fillRect(this.x, this.y, this.width, this.height);
      if (this.imageOpts) {
        return this.drawImage(ctx);
      }
    };

    return Rectangle;

  })(AE.Object);

  AE.Graphics2D = Graphics2D;

  Graphics2D.Scene = (function(_super) {

    __extends(Scene, _super);

    Scene.prototype._drawables = [];

    function Scene(_width, _height) {
      this._width = _width;
      this._height = _height;
      this._dom = document.createElement('canvas');
      this.resize(this._width, this._height);
      this.fill('black');
      this.camera = new Graphics2D.Camera(this._dom, this, 0, 0, this._width, this._height);
      this.initGestures();
    }

    Scene.prototype.width = function() {
      return this._width;
    };

    Scene.prototype.height = function() {
      return this._height;
    };

    Scene.prototype.resize = function(_width, _height) {
      this._width = _width;
      this._height = _height;
      if (this._fillRect) {
        this._drawables[this._fillRect].width = this._width;
        return this._drawables[this._fillRect].height = this._height;
      }
    };

    Scene.prototype.fill = function(color) {
      var fill;
      if (this._fillRect) {
        this.remove(this._fillRect);
      }
      fill = new Graphics2D.Geometry.Rectangle(0, 0, this._width, this._height, color);
      this._fillRect = fill.guid;
      return this.add(fill);
    };

    Scene.prototype.clearScreen = function() {
      var ctx;
      ctx = this._dom.getContext("2d");
      return ctx.clearRect(0, 0, this._width, this._width);
    };

    Scene.prototype.clearAll = function() {
      var drawable, guid, _ref, _results;
      _ref = this._drawables;
      _results = [];
      for (guid in _ref) {
        if (!__hasProp.call(_ref, guid)) continue;
        drawable = _ref[guid];
        _results.push(delete this._drawables[guid]);
      }
      return _results;
    };

    Scene.prototype.updateAll = function(step) {
      var drawable, guid, _ref, _results;
      this.camera.update(step);
      _ref = this._drawables;
      _results = [];
      for (guid in _ref) {
        if (!__hasProp.call(_ref, guid)) continue;
        drawable = _ref[guid];
        if (drawable.update) {
          _results.push(drawable.update(step));
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    Scene.prototype.renderAll = function() {
      var ctx, drawable, guid, step, _ref;
      step = Date.now() - this.timeStart;
      this.clearScreen();
      this.updateAll(step);
      ctx = this._dom.getContext('2d');
      ctx.save();
      this.camera.scale(ctx);
      ctx.translate(this.camera.x, this.camera.y);
      _ref = this._drawables;
      for (guid in _ref) {
        if (!__hasProp.call(_ref, guid)) continue;
        drawable = _ref[guid];
        drawable.draw(ctx);
      }
      return ctx.restore();
    };

    Scene.prototype.add = function(drawable) {
      return this._drawables[drawable.guid] = drawable;
    };

    Scene.prototype.remove = function(guid) {
      return delete this._drawables[guid];
    };

    Scene.prototype.attachTo = function(container) {
      return container.appendChild(this._dom);
    };

    Scene.prototype.start = function() {
      this.renderAll();
      this.timeStart = Date.now();
      return this._timer = requestAnimationFrame((function() {
        return this.start();
      }).bind(this));
    };

    Scene.prototype.stop = function() {
      if (this._timer) {
        cancelAnimationFrame(this._timer);
      }
      return this._timer = null;
    };

    /*
        Gestures
        This part handles the click events inside a 2D canvas scene.
        todo: move to a different entity
    */


    Scene.prototype.initGestures = function() {
      var _this = this;
      return this._dom.addEventListener('mousedown', (function(event) {
        return _this.onClick(event);
      }), false);
    };

    Scene.prototype.onClick = function(event) {
      var drawable, guid, intersect, intersects, x, y, _i, _len, _ref, _results;
      x = event.pageX;
      y = event.pageY;
      intersects = [];
      _ref = this._drawables;
      for (guid in _ref) {
        if (!__hasProp.call(_ref, guid)) continue;
        drawable = _ref[guid];
        if (drawable.intersects && drawable.intersects(x, y)) {
          intersects.push(drawable);
        }
      }
      _results = [];
      for (_i = 0, _len = intersects.length; _i < _len; _i++) {
        intersect = intersects[_i];
        _results.push(intersect.onClick());
      }
      return _results;
    };

    return Scene;

  })(AE.Object);

  Graphics3D.Drawable = (function(_super) {

    __extends(Drawable, _super);

    function Drawable() {
      return Drawable.__super__.constructor.apply(this, arguments);
    }

    Drawable.prototype.update = function() {};

    Drawable.prototype.draw = function() {};

    return Drawable;

  })(AE.Object);

  Graphics3D.Geometry.Circle = (function(_super) {

    __extends(Circle, _super);

    Circle.extend(Graphics3D.Drawable);

    function Circle(_radius, _segments) {
      this._radius = _radius;
      this._segments = _segments != null ? _segments : 32;
      this.geometry = new THREE.CircleGeometry(this._radius, this._segments);
      this.geometry.vertices.shift();
      this.material = new THREE.LineBasicMaterial({
        color: "cyan"
      });
      this.mesh = new THREE.Line(this.geometry, this.material);
    }

    return Circle;

  })(AE.Object);

  Graphics3D.Geometry.Cube = (function(_super) {

    __extends(Cube, _super);

    Cube.extend(Graphics3D.Drawable);

    function Cube() {
      this.geometry = new THREE.BoxGeometry(1, 1, 1);
      this.material = new THREE.MeshBasicMaterial({
        color: 0x00ff00
      });
      this.mesh = new THREE.Mesh(this.geometry, this.material);
    }

    return Cube;

  })(AE.Object);

  Graphics3D.Geometry.Line = (function(_super) {

    __extends(Line, _super);

    Line.extend(Graphics3D.Drawable);

    function Line(_center, _length, _direction) {
      var center, p1, p2;
      this._center = _center;
      this._length = _length;
      this._direction = _direction;
      this.geometry = new THREE.Geometry();
      center = new THREE.Vector3(this._center.x, this._center.y, this._center.z);
      p1 = new THREE.Vector3(this._center.x + ((this._length / 2) * this._direction.x), this._center.y + ((this._length / 2) * this._direction.y), this._center.z + ((this._length / 2) * this._direction.z));
      p2 = new THREE.Vector3(this._center.x - ((this._length / 2) * this._direction.x), this._center.y - ((this._length / 2) * this._direction.y), this._center.z - ((this._length / 2) * this._direction.z));
      this.geometry.vertices.push(p1);
      this.geometry.vertices.push(center);
      this.geometry.vertices.push(p2);
      this.material = new THREE.LineBasicMaterial({
        color: "cyan"
      });
      this.mesh = new THREE.Line(this.geometry, this.material);
    }

    return Line;

  })(AE.Object);

  AE.Graphics3D = Graphics3D;

  Graphics3D.Scene = (function(_super) {

    __extends(Scene, _super);

    Scene.prototype._drawables = [];

    function Scene(_width, _height) {
      this._width = _width;
      this._height = _height;
      this._scene = new THREE.Scene();
      this._camera = new THREE.PerspectiveCamera(90, this._width / this._height, 0.1, 1000);
      this._renderer = new THREE.WebGLRenderer({
        antialiasing: true
      });
      this._dom = this._renderer.domElement;
      this._camera.position.z = 5;
      this._controls = new THREE.OrbitControls(this._camera, this._dom);
    }

    Scene.prototype.resize = function(width, height) {
      this._width = width;
      this._height = height;
      this._dom.width = this._width;
      this._dom.height = this._height;
      this._renderer.setSize(this._width, this._height);
      this._camera.aspect = this._width / this._height;
      return this._camera.updateProjectionMatrix();
    };

    Scene.prototype.attachTo = function(container) {
      container.appendChild(this._dom);
      this.resize(container.clientWidth, container.clientHeight);
      if (AE.Config.getInstance().get('webgl-stats')) {
        this._stats = new Stats();
        this._stats.setMode(0);
        this._stats.domElement.style.position = 'absolute';
        this._stats.domElement.style.right = '0px';
        this._stats.domElement.style.top = '0px';
        return container.appendChild(this._stats.domElement);
      }
    };

    Scene.prototype.add = function(drawable) {
      this._scene.add(drawable.mesh);
      return this._drawables[drawable.guid] = drawable;
    };

    Scene.prototype.remove = function(guid) {
      this._scene.remove(this._drawables[guid]);
      return delete this._drawables[guid];
    };

    Scene.prototype.update = function() {
      var drawable, guid, _ref, _results;
      _ref = this._drawables;
      _results = [];
      for (guid in _ref) {
        if (!__hasProp.call(_ref, guid)) continue;
        drawable = _ref[guid];
        if (drawable.update) {
          _results.push(drawable.update());
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    Scene.prototype.start = function() {
      return this.render();
    };

    Scene.prototype.stop = function() {
      if (this._timer) {
        cancelAnimationFrame(this._timer);
      }
      return this._timer = null;
    };

    Scene.prototype.render = function() {
      var _this = this;
      this._timer = requestAnimationFrame((function() {
        if (_this._stats) {
          _this._stats.begin();
        }
        _this.render();
        if (_this._stats) {
          return _this._stats.end();
        }
      }));
      this._controls.update();
      this.update();
      return this._renderer.render(this._scene, this._camera);
    };

    return Scene;

  })(AE.Object);

  AE.Audio = Audio;

  Audio.Engine = (function(_super) {

    __extends(Engine, _super);

    Engine.prototype.context = null;

    Engine.prototype.effectsSystems = {};

    Engine.prototype.musicSystems = {};

    function Engine() {
      AE.log('AE.Audio: start');
    }

    Engine.prototype.createEffectsSubSystem = function(name, effectsMap) {
      this.effectsSystems[name] = new AE.Audio.EffectsSubSystem(effectsMap);
      return this.effectsSystems[name];
    };

    Engine.prototype.createMusicSubSystem = function(name, musicsMap) {
      this.musicSystems[name] = new AE.Audio.MusicSubSystem(musicsMap);
      return this.musicSystems[name];
    };

    return Engine;

  })(AE.Engine);

  Audio.Effect = (function(_super) {

    __extends(Effect, _super);

    Effect.prototype.name = null;

    Effect.prototype.system = null;

    Effect.prototype.buffer = null;

    Effect.prototype.loaded = false;

    function Effect(name, system, callback) {
      this.name = name;
      this.system = system;
      this.callback = callback;
    }

    Effect.prototype.prepare = function(onPrepared) {
      var file,
        _this = this;
      file = AE.Assets.Manager.getInstance().get(this.name);
      return AE.FileSystem.getInstance().readBuffer(file, (function(buffer) {
        return _this.system.context.decodeAudioData(buffer, function(b) {
          _this.buffer = b;
          _this.loaded = true;
          if (onPrepared) {
            return onPrepared();
          }
        });
      }), 'text');
    };

    Effect.prototype.fire = function() {
      var source;
      source = this.system.context.createBufferSource();
      source.buffer = this.buffer;
      source.connect(this.system.gainNode);
      return source.start(0);
    };

    return Effect;

  })(AE.Object);

  Audio.EffectsSubSystem = (function(_super) {

    __extends(EffectsSubSystem, _super);

    function EffectsSubSystem() {
      return EffectsSubSystem.__super__.constructor.apply(this, arguments);
    }

    EffectsSubSystem.prototype.sounds = {};

    EffectsSubSystem.prototype.context = null;

    EffectsSubSystem.prototype.length = 0;

    EffectsSubSystem.prototype.loadMap = function(names) {
      var name, _i, _len, _results;
      _results = [];
      for (_i = 0, _len = names.length; _i < _len; _i++) {
        name = names[_i];
        this.sounds[name] = new AE.Audio.Effect(name, this);
        _results.push(this.length++);
      }
      return _results;
    };

    EffectsSubSystem.prototype.fire = function(name) {
      if (this.sounds[name]) {
        return this.sounds[name].fire();
      } else {
        return onError();
      }
    };

    EffectsSubSystem.prototype.prepare = function(onPrepared) {
      var name, onPreparedSound, remainingEffects, sound, _ref, _results;
      remainingEffects = this.length;
      onPreparedSound = (function() {
        remainingEffects = remainingEffects - 1;
        if (remainingEffects === 0) {
          return onPrepared();
        }
      }).bind(this, remainingEffects, onPrepared);
      _ref = this.sounds;
      _results = [];
      for (name in _ref) {
        sound = _ref[name];
        _results.push(sound.prepare(onPreparedSound));
      }
      return _results;
    };

    return EffectsSubSystem;

  })(Audio.SubSystem);

  Audio.Music = (function(_super) {

    __extends(Music, _super);

    Music.prototype.name = null;

    Music.prototype.system = null;

    Music.prototype.buffer = null;

    Music.prototype.loaded = false;

    function Music(name, system, callback) {
      this.name = name;
      this.system = system;
      this.callback = callback;
    }

    Music.prototype.prepare = function(onPrepared) {
      var file,
        _this = this;
      file = AE.Assets.Manager.getInstance().get(this.name);
      return AE.FileSystem.getInstance().readBuffer(file, (function(buffer) {
        return _this.system.context.decodeAudioData(buffer, function(b) {
          _this.buffer = b;
          _this.loaded = true;
          if (onPrepared) {
            return onPrepared();
          }
        });
      }), 'text');
    };

    Music.prototype.play = function() {
      var source;
      if (this.loaded === true) {
        source = this.system.context.createBufferSource();
        source.buffer = this.buffer;
        source.connect(this.system.gainNode);
        source.loop = true;
        return source.start(0);
      } else {
        return AE.error("[MUSIC] not loaded yet: " + this.name);
      }
    };

    return Music;

  })(AE.Object);

  Audio.MusicSubSystem = (function(_super) {

    __extends(MusicSubSystem, _super);

    function MusicSubSystem() {
      return MusicSubSystem.__super__.constructor.apply(this, arguments);
    }

    MusicSubSystem.prototype.sounds = {};

    MusicSubSystem.prototype.context = null;

    MusicSubSystem.prototype.length = 0;

    MusicSubSystem.prototype.loadMap = function(names) {
      var name, _i, _len, _results;
      _results = [];
      for (_i = 0, _len = names.length; _i < _len; _i++) {
        name = names[_i];
        this.sounds[name] = new AE.Audio.Music(name, this);
        _results.push(this.length++);
      }
      return _results;
    };

    MusicSubSystem.prototype.play = function(name) {
      if (this.sounds[name]) {
        return this.sounds[name].play();
      } else {
        return onError();
      }
    };

    MusicSubSystem.prototype.prepare = function(onPrepared) {
      var name, onPreparedSound, remainingMusic, sound, _ref, _results;
      remainingMusic = this.length;
      onPreparedSound = (function() {
        remainingMusic = remainingMusic - 1;
        if (remainingMusic === 0) {
          return onPrepared();
        }
      }).bind(this, remainingMusic, onPrepared);
      _ref = this.sounds;
      _results = [];
      for (name in _ref) {
        sound = _ref[name];
        _results.push(sound.prepare(onPreparedSound));
      }
      return _results;
    };

    return MusicSubSystem;

  })(Audio.SubSystem);

  Network.HTTP = (function() {

    function HTTP() {}

    HTTP.postJSON = function(url, data) {
      var promise;
      return promise = new Promise(function(resolve, reject) {
        var xhr;
        xhr = new XMLHttpRequest();
        xhr.open('POST', url, true);
        xhr.responseType = 'json';
        xhr.onreadystatechange = function() {
          if (xhr.readyState === 4) {
            if (xhr.status === 200) {
              return resolve && resolve(xhr.response);
            } else {
              return reject && reject(xhr.response);
            }
          }
        };
        return xhr.send(data);
      });
    };

    HTTP.getJSON = function(url) {
      var promise;
      return promise = new Promise(function(resolve, reject) {
        var xhr;
        xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.responseType = 'json';
        xhr.onreadystatechange = function() {
          if (xhr.readyState === 4) {
            if (xhr.status === 200) {
              return resolve && resolve(xhr.response);
            } else {
              return reject && reject(xhr.response);
            }
          }
        };
        return xhr.send();
      });
    };

    return HTTP;

  })();

}).call(this);
