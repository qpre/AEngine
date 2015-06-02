import AEObject from '../Object';

let AEPhaseStatusEnum = Object.freeze({
  ACTIVE: 0,
  PAUSED: 1
});


/*
  AEGamePhase :
    represents a single state for the engine
  @extends AEngine.AEObject
 */

export default class GamePhase extends AEObject {
  /*
    Constructor:

    @param {String} _name : A human readable name
    @param {Function} _in : the function to be triggered when entering the state
    @param {Function} _out : the function to be triggered when leaving the state
    @param {Function} _run : the function handling the state
   */
  constructor (_name, _in, _out, _run) {
    this._status              = AEPhaseStatusEnum.PAUSED;

    this._name                = _name;
    this._in                  = _in;
    this._out                 = _out;
    this._run                 = _run;
    this._statusChangedEvent  = new AE.Event(this);

    this._statusChangedEvent.subscribe(this.onStatusChanged);
  }

  /*
    dispatches a statusChangedEvent

    @event statusChangedEvent
   */

  notifyStatusChanged () {
    this._statusChangedEvent.notify({
      'status': this._status
    });
  }


  /*
    Override me to unleash the kraken
   */

  onStatusChanged (sender, args) {
  }


  /*
    self explanatory
   */

  setActive () {
    this._status = AEPhaseStatusEnum.ACTIVE;
    this.notifyStatusChanged();
  }

  /*
    self explanatory
   */

  setUnactive () {
    this._status = AEPhaseStatusEnum.PAUSED;
    this.notifyStatusChanged();
  }


  /*
    self explanatory
   */

  in () {
    this._in();
  }


  /*
    self explanatory
   */

  out () {
    this._out();
  }


  /*
    self explanatory
   */

  run () {
    this._run();
  }

};
