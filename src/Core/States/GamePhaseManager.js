class GamePhasesManager {

  constructor () {
    this._phases = {};
    this._current = null;
  }


  /*
    @param {String} phase : the name of the game phase to check for
    @return {Boolean} (true|false) depending on whether the manager knows
    about it or not
   */

  has (phase) {
    if (this._phases.hasOwnProperty(phase)) {
      return true;
    } else {
      return false;
    }
  }


  /*
    addPhase :
      creates a phase for the game, based on the following parameters

    @param {String} name : a name for the phase MUST BE UNIQUE
    @param {Function} actionIn : the action to perform when entering the state
    @param {Function} actionOut : the action to perform when leaving the state
    @param {Function} run : the action to perform when running the state
   */

  addPhase (name, actionIn, actionOut, run) {
    if (this.has(name)) {
      return AE.error("Phase " + name + " already exists");
    } else {
      this._phases[name] = new AE.States.GamePhase(name, actionIn, actionOut, run);
      return AE.Router.add(name, (function() {
        AE.log("applying route");
        return AE.States.GamePhasesManager.setCurrent(name);
      }).bind(name));
    }
  }



  /*
    current: returns the name of the current state
   */

  current () {
    return this._current;
  }


  /*
    setCurrent:
      gets straight to state specified

    @param {String} current : the state to be set as the current one
   */

  setCurrent (current) {
    if (this.has(current.toString())) {
      AE.Router.navigate(current);
      this._current = this._phases[current.toString()];
      this._current.setActive();
      this._current["in"]();
      return this._current.run();
    } else {
      return AE.error("No such phase: " + current);
    }
  }


  /*
    setCurrent:
     gets to the specified state by appliying the transitions
     (if any were associated with the states)

    @param {String} next : the state to be set as the current one
   */

  transitionTo (next) {
    if (this._current === null) {
      return AE.error("No current phase was set, can't transit from nowhere");
    } else {
      this._current.out();
      this._current.setUnactive();
      return this.setCurrent(next);
    }
  }
};

export default GamePhaseManager = new GamePhaseManager();
