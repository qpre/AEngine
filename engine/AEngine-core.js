var AE = {'AEEvent':{},'AEGamePhase':{},'AEIdFactory':{},'AEMVC':{},'AEMessageBox':{},'AEObject':{},'AESingleton':{},'AEWorker':{}};


/*
  Simple Singleton implementation
*/


(function() {
  var AEPhaseStatusEnum, AEngine,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  AE.AESingleton.AESingleton = (function() {

    function AESingleton() {}

    AESingleton._instance = null;

    /*
        @return {Object} an instance of the inheritting object
    */


    AESingleton.getInstance = function() {
      return this._instance || (this._instance = new this());
    };

    return AESingleton;

  })();

  /*
    AEIdFactory class aims to handle object identification through the engine via
    GUIDs
    This class follows the Singleton design pattern
    @extend AEEngine.AESingleton
  */


  AE.AEIdFactory.AEIdFactory = (function(_super) {

    __extends(AEIdFactory, _super);

    AEIdFactory.prototype._guids = null;

    /*
          constructor: called on singleton's new instance creation
    */


    function AEIdFactory() {
      this._guids = [];
    }

    /*
          has: checks if param guid has already been registered
          @param {String} the GUID to be checked
    */


    AEIdFactory.prototype.has = function(guid) {
      if (this._guids.indexOf(guid.toString()) > -1) {
        return true;
      } else {
        return false;
      }
    };

    /*
        @return {Boolean} a brand new and unique GUID
    */


    AEIdFactory.prototype.getGUID = function() {
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


    AEIdFactory.prototype.s4 = function() {
      return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    };

    AEIdFactory.prototype.guid = function() {
      return this.s4() + this.s4() + "-" + this.s4() + "-" + this.s4() + "-" + this.s4() + "-" + this.s4() + this.s4() + this.s4();
    };

    return AEIdFactory;

  })(AESingleton);

  /*
      AEObject: a base class for every object in the engine
  */


  AE.AEObject.AEObject = (function() {

    AEObject.prototype._guid = null;

    /*
        Ctor : each gives an object its own unique guid
    */


    function AEObject() {
      this._guid = AEIdFactory.getInstance().getGUID();
    }

    /*
        Init: default initializer for object
        this method is called upon instanciation of a new object of such class
    */


    AEObject.prototype.init = function() {};

    /*
        guid(): a public getter for the object's guid
    */


    AEObject.prototype.guid = function() {
      return this._guid;
    };

    /*
        create: creates a new instance for the given object
                passes possible arguments to the objects init
                function.
                except for exceptions, EVERY instance should
                be created using this method
    
        @return {Object} an instance of the inherriting class
    */


    AEObject.create = function() {
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

    return AEObject;

  })();

  AEngine = window.AEngine = {};

  /*
      A simple Observer pattern design implementation
  */


  AE.AEEvent.AEEvent = (function() {

    AEEvent.prototype._subscribers = null;

    AEEvent.prototype._sender = null;

    /*
          constructor: called on instance creation
          @param {Object} the event's sender
    */


    function AEEvent(_sender) {
      this._sender = _sender;
      this._subscribers = [];
    }

    /*
          subscribe: adds a new object to the distribution list
          @param {Object} the listener object to be added
    */


    AEEvent.prototype.subscribe = function(listener) {
      return this._subscribers.push(listener);
    };

    /*
        notify: distributes args to every subscriber
        @param {Object} args : an object containing the messages' arguments
    */


    AEEvent.prototype.notify = function(args) {
      var i, _i, _ref, _results;
      _results = [];
      for (i = _i = 0, _ref = this._subscribers.length - 1; _i <= _ref; i = _i += 1) {
        _results.push(this._subscribers[i](this._sender, args));
      }
      return _results;
    };

    return AEEvent;

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


  AE.AEGamePhase.AEGamePhase = (function(_super) {

    __extends(AEGamePhase, _super);

    AEGamePhase.prototype._status = AEPhaseStatusEnum.PAUSED;

    AEGamePhase.prototype._statusChangedEvent = null;

    /*
        Constructor:
    
        @param {String} _name : A human readable name
        @param {Function} _in : the function to be triggered when when entering the state
        @param {Function} _out : the function to be triggered when when leaving the state
        @param {Function} _run : the function handling the state
    */


    function AEGamePhase(_name, _in, _out, _run) {
      this._name = _name;
      this._in = _in;
      this._out = _out;
      this._run = _run;
      this._statusChangedEvent = new AEEvent(this);
      this._statusChangedEvent.subscribe(this.onStatusChanged);
    }

    /*
        dispatches a statusChangedEvent
    
        @event statusChangedEvent
    */


    AEGamePhase.prototype.notifyStatusChanged = function() {
      return this._statusChangedEvent.notify({
        'status': this._status
      });
    };

    /*
        Override me to unleash the kraken
    */


    AEGamePhase.prototype.onStatusChanged = function(sender, args) {
      return console.log("status changed to :" + args.status);
    };

    /*
        self explanatory
    */


    AEGamePhase.prototype.setActive = function() {
      this._status = AEPhaseStatusEnum.ACTIVE;
      return this.notifyStatusChanged();
    };

    /*
        self explanatory
    */


    AEGamePhase.prototype.setUnactive = function() {
      this._status = AEPhaseStatusEnum.PAUSED;
      return this.notifyStatusChanged();
    };

    /*
        self explanatory
    */


    AEGamePhase.prototype["in"] = function() {
      return this._in();
    };

    /*
        self explanatory
    */


    AEGamePhase.prototype.out = function() {
      return this._out();
    };

    /*
        self explanatory
    */


    AEGamePhase.prototype.run = function() {
      return this._run();
    };

    return AEGamePhase;

  })(AEObject);

  /*
    AEGamePhaseManager aims to handle game states and their transitions.
  
    @extend AESingleton
    TODO: Add some error checking in case of failing to transit
  */


  AE.AEGamePhase.AEGamePhaseManager = (function(_super) {

    __extends(AEGamePhaseManager, _super);

    AEGamePhaseManager.prototype._phases = null;

    AEGamePhaseManager.prototype._current = null;

    function AEGamePhaseManager() {
      this._phases = {};
    }

    /*
        @param {String} phase : the name of the game phase to check for
        @return {Boolean} (true|false) depending on whether the manager knows about it or not
    */


    AEGamePhaseManager.prototype.has = function(phase) {
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


    AEGamePhaseManager.prototype.addPhase = function(name, actionIn, actionOut, run) {
      if (this.has(name)) {
        return console.error("Phase " + name + " already exists");
      } else {
        return this._phases[name] = new AEGamePhase(name, actionIn, actionOut, run);
      }
    };

    /*
        setCurrent:
          gets straight to state specified
    
        @param {String} current : the state to be set as the current one
    */


    AEGamePhaseManager.prototype.setCurrent = function(current) {
      if (this.has(current.toString())) {
        this._current = this._phases[current];
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


    AEGamePhaseManager.prototype.transitionTo = function(next) {
      if (this._current === null) {
        return console.error("No current phase was set, can't transit from nowhere");
      } else {
        this._current.out();
        this._current.setUnactive();
        return this.setCurrent(next);
      }
    };

    return AEGamePhaseManager;

  })(AESingleton);

  AE.AEMVC.AEController = (function(_super) {

    __extends(AEController, _super);

    function AEController() {
      return AEController.__super__.constructor.apply(this, arguments);
    }

    AEController.prototype.init = function() {};

    return AEController;

  })(AEObject);

  AE.AEMVC.AEModel = (function(_super) {

    __extends(AEModel, _super);

    function AEModel() {
      return AEModel.__super__.constructor.apply(this, arguments);
    }

    AEModel.prototype._propertyChangedEvent = null;

    AEModel.prototype.init = function() {
      return this._propertyChangedEvent = new AEEvent(this);
    };

    /*
        get property value
    */


    AEModel.prototype.get = function(key) {
      return this[key];
    };

    /*
    		sets the key property with the value passed
    */


    AEModel.prototype.set = function(key, value) {
      this[key] = value;
      return this.notifyPropertyChanged(key);
    };

    /*
        notifyPropertyChanged:
    			notifies subscribers that a property was modified
    */


    AEModel.prototype.notifyPropertyChanged = function(property) {
      return this._propertyChangedEvent.notify({
        'property': property
      });
    };

    return AEModel;

  })(AEObject);

  AE.AEMVC.AEView = (function(_super) {

    __extends(AEView, _super);

    function AEView() {
      return AEView.__super__.constructor.apply(this, arguments);
    }

    AEView.prototype.init = function() {};

    return AEView;

  })(AEObject);

}).call(this);
