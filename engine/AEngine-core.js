var AE = {'MVC':{},'States':{},'Workers':{}};


/*
  Simple Singleton implementation
*/


(function() {
  var AEPhaseStatusEnum,
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

  Function.prototype.property = function(prop, desc) {
    return Object.defineProperty(this.prototype, prop, desc);
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
        if (!this._guid) {
          AE.IdFactory.getInstance().getGUID();
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
        @param {Function} _in : the function to be triggered when when entering the state
        @param {Function} _out : the function to be triggered when when leaving the state
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


    GamePhase.prototype.onStatusChanged = function(sender, args) {
      return console.log("status changed to :" + args.status);
    };

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
        @return {Boolean} (true|false) depending on whether the manager knows about it or not
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
        return console.error("Phase " + name + " already exists");
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
        return console.error("No such phase: " + current);
      }
    };

    /*
        setCurrent:
         gets to the specified state by appliying the transitions (if any were associated with the states)
    
        @param {String} next : the state to be set as the current one
    */


    GamePhasesManager.prototype.transitionTo = function(next) {
      if (this._current === null) {
        return console.error("No current phase was set, can't transit from nowhere");
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

    function Engine() {
      console.log("instantiating new engine");
    }

    return Engine;

  })(AE.Object);

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

}).call(this);
