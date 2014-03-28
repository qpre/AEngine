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

    Object.prototype._guid = null;

    /*
        Ctor : each gives an object its own unique guid
    */


    function Object() {
      this._guid = IdFactory.getInstance().getGUID();
    }

    /*
        Init: default initializer for object
        this method is called upon instanciation of a new object of such class
    */


    Object.prototype.init = function() {};

    /*
        guid(): a public getter for the object's guid
    */


    Object.prototype.guid = function() {
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

  AE.Engine = (function(_super) {

    __extends(Engine, _super);

    Engine.prototype.PhasesManager = null;

    Engine.prototype.MessageBox = null;

    function Engine() {
      this.PhasesManager = new AE.States.GamePhasesManager();
    }

    return Engine;

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

    function GamePhase() {
      return GamePhase.__super__.constructor.apply(this, arguments);
    }

    GamePhase.prototype._status = AEPhaseStatusEnum.PAUSED;

    GamePhase.prototype._statusChangedEvent = null;

    /*
        Constructor:
    
        @param {String} _name : A human readable name
        @param {Function} _in : the function to be triggered when when entering the state
        @param {Function} _out : the function to be triggered when when leaving the state
        @param {Function} _run : the function handling the state
    */


    GamePhase.prototype.init = function(_name, _in, _out, _run) {
      this._name = _name;
      this._in = _in;
      this._out = _out;
      this._run = _run;
      this._statusChangedEvent = new AE.Event(this);
      return this._statusChangedEvent.subscribe(this.onStatusChanged);
    };

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

}).call(this);
