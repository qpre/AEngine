var AE = {'Assets':{},'MVC':{},'States':{},'Workers':{}};
var Game = {};
var Audio = {};


/*
  Simple Singleton implementation
*/


(function() {
  var AEPhaseStatusEnum, AE_CORE_PATH, asyncRequestURL, currentScript, scriptsArray, syncRequestUrl,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

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

    return Object;

  })();

  Audio.SubSystem = (function(_super) {

    __extends(SubSystem, _super);

    SubSystem.prototype.sounds = {};

    SubSystem.prototype.context = null;

    function SubSystem(names) {
      try {
        window.AudioContext = window.AudioContext || window.webkitAudioContext;
        this.context = new AudioContext();
      } catch (e) {
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
        return this._phases[name] = new AE.States.GamePhase(name, actionIn, actionOut, run);
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

  self.requestFileSystem = self.requestFileSystem || self.webkitRequestFileSystem;

  self.requestFileSystemAsync = self.requestFileSystem || self.webkitRequestFileSystem;

  self.resolveLocalFileSystemURL = self.webkitResolveLocalFileSystemURL || self.resolveLocalFileSystemURL;

  AE.FileSystem = (function(_super) {

    __extends(FileSystem, _super);

    function FileSystem() {
      return FileSystem.__super__.constructor.apply(this, arguments);
    }

    FileSystem.prototype._isCreated = null;

    FileSystem.prototype._stack = [];

    FileSystem.prototype.createFileSystem = function(callBack) {
      if (this._isCreated === null) {
        requestFileSystem(TEMPORARY, 10 * 1024 * 1024, (function(fs) {
          AE.FileSystem.getInstance().onInitFS(fs);
        }), function(e) {
          AE.FileSystem.getInstance().onErrorFSHandler(e);
        });
        this._isCreated = false;
      }
      return this._stack.push(callBack);
    };

    FileSystem.prototype.writeFile = function(filePath, file, onWrite) {
      var _this = this;
      if (this._filesystem) {
        return this._filesystem.root.getFile(filePath, {
          create: true
        }, function(fileEntry) {
          return fileEntry.createWriter(function(fileWriter) {
            var blob;
            fileWriter.onerror = function(e) {
              return console.error(e);
            };
            if (onWrite) {
              fileWriter.onwrite = onWrite;
            }
            blob = new Blob([file]);
            return fileWriter.write(blob);
          });
        });
      } else {
        return this.createFileSystem(function() {
          return _this.writeFile(filePath, file, onWrite);
        });
      }
    };

    FileSystem.prototype.readFile = function(filePath, onSuccess) {
      var _this = this;
      if (this._filesystem) {
        return this._filesystem.root.getFile(filePath, {}, function(fileEntry) {
          return fileEntry.file(function(file) {
            var fileReader;
            fileReader = new FileReader();
            if (onSuccess) {
              fileReader.onloadend = function() {
                return onSuccess(fileReader.result);
              };
            }
            return fileReader.readAsText(file);
          });
        });
      } else {
        return this.createFileSystem(function() {
          return _this.readFile(filePath, onSuccess);
        });
      }
    };

    FileSystem.prototype.readBuffer = function(filePath, onSuccess) {
      var _this = this;
      if (this._filesystem) {
        return this._filesystem.root.getFile(filePath, {}, function(fileEntry) {
          return fileEntry.file(function(file) {
            var fileReader;
            fileReader = new FileReader();
            if (onSuccess) {
              fileReader.onloadend = function() {
                return onSuccess(fileReader.result);
              };
            }
            return fileReader.readAsArrayBuffer(file);
          });
        });
      } else {
        return this.createFileSystem(function() {
          return _this.readBuffer(filePath, onSuccess);
        });
      }
    };

    FileSystem.prototype.onInitFS = function(fs) {
      var callback, _i, _len, _ref;
      this._filesystem = fs;
      this._isCreated = true;
      _ref = this._stack;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        callback = _ref[_i];
        callback.call();
      }
      return this._stack = [];
    };

    FileSystem.prototype.onErrorFSHandler = function(error) {
      var msg;
      switch (error.code) {
        case FileError.QUOTA_EXCEEDED_ERR:
          msg = "QUOTA_EXCEEDED_ERR";
          break;
        case FileError.NOT_FOUND_ERR:
          msg = "NOT_FOUND_ERR";
          break;
        case FileError.SECURITY_ERR:
          msg = "SECURITY_ERR";
          break;
        case FileError.INVALID_MODIFICATION_ERR:
          msg = "INVALID_MODIFICATION_ERR";
          break;
        case FileError.INVALID_STATE_ERR:
          msg = "INVALID_STATE_ERR";
          break;
        default:
          msg = "Unknown Error";
      }
      return AE.error('AE.FILESYSTEM failed with ' + msg);
    };

    return FileSystem;

  })(AE.Singleton);

  /*
  	TODO: Handle names collisions
  */


  AE.Assets.Manager = (function(_super) {

    __extends(Manager, _super);

    function Manager() {
      return Manager.__super__.constructor.apply(this, arguments);
    }

    Manager.prototype._assetsOrigin = [];

    Manager.prototype._assets = {};

    Manager.prototype.register = function(filesMap) {
      var assetName, assetPath, _results;
      _results = [];
      for (assetName in filesMap) {
        assetPath = filesMap[assetName];
        this._assetsOrigin.push({
          name: assetName,
          path: assetPath
        });
        _results.push(this._assets[name] = null);
      }
      return _results;
    };

    Manager.prototype.load = function(onReady, onOneAssetLoaded) {
      var asset, loader, _i, _len, _ref, _results,
        _this = this;
      this.remaining = this._assetsOrigin.length;
      _ref = this._assetsOrigin;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        asset = _ref[_i];
        loader = this.createURLLoader(asset.path, function(file) {
          _this._assets[asset.name] = file;
          _this.remaining--;
          onOneAssetLoaded(_this.remaining);
          if (_this.remaining === 0) {
            return onReady();
          }
        });
        _results.push(loader.load());
      }
      return _results;
    };

    Manager.prototype.get = function(name) {
      if (this._assets[name] === null) {
        return AE.log("" + name + " not loaded yet");
      } else if (this._assets[name] === void 0) {
        return AE.error("" + name + " not referenced");
      } else {
        return this._assets[name];
      }
    };

    Manager.prototype.createURLLoader = function(fileURL, onSuccess) {
      var loader;
      loader = new AE.Assets.URLLoader(fileURL, onSuccess);
      return loader;
    };

    return Manager;

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

    Engine.prototype._phasesManager = null;

    Engine.prototype._messageBox = null;

    Engine.property('PhasesManager', {
      get: function() {
        if (!this._phasesManager) {
          this._phasesManager = new AE.States.GamePhasesManager();
        }
        return this._phasesManager;
      }
    });

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
    }

    return Engine;

  })(AE.Engine);

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

    return Engine;

  })(AE.Engine);

  Audio.Effect = (function(_super) {

    __extends(Effect, _super);

    Effect.prototype.name = null;

    Effect.prototype.context = null;

    Effect.prototype.buffer = null;

    Effect.prototype.context = null;

    Effect.prototype.loaded = false;

    function Effect(name, context, callback) {
      this.name = name;
      this.context = context;
      this.callback = callback;
    }

    Effect.prototype.prepare = function() {
      var file,
        _this = this;
      file = AE.Assets.Manager.getInstance().get(this.name);
      return AE.FileSystem.getInstance().readBuffer(file, function(buffer) {
        return _this.context.decodeAudioData(buffer, function(b) {
          _this.buffer = b;
          _this.loaded = true;
          if (_this.callback) {
            return _this.callback();
          }
        });
      });
    };

    Effect.prototype.fire = function() {
      var source;
      source = this.context.createBufferSource();
      source.buffer = this.buffer;
      source.connect(this.context.destination);
      return source.start(0);
    };

    return Effect;

  })(AE.Object);

  Audio.EffectsSubSystem = (function(_super) {

    __extends(EffectsSubSystem, _super);

    function EffectsSubSystem() {
      return EffectsSubSystem.__super__.constructor.apply(this, arguments);
    }

    EffectsSubSystem.prototype.loadMap = function(names) {
      var name, _i, _len, _results;
      _results = [];
      for (_i = 0, _len = names.length; _i < _len; _i++) {
        name = names[_i];
        _results.push(this.sounds[name] = new AE.Audio.Effect(name, this.context));
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

    EffectsSubSystem.prototype.prepare = function() {
      var name, sound, _ref, _results;
      _ref = this.sounds;
      _results = [];
      for (name in _ref) {
        sound = _ref[name];
        _results.push(sound.prepare());
      }
      return _results;
    };

    return EffectsSubSystem;

  })(Audio.SubSystem);

}).call(this);
