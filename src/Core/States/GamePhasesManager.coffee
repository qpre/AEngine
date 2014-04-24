#<< AE/Console
#<< AE/States/GamePhase
#<< AE/Singleton

###
  AEGamePhasesManager aims to handle game states and their transitions.

  @extend AESingleton
  TODO: Add some error checking in case of failing to transit
###

class AE.States.GamePhasesManager extends AE.Singleton
  # @private
  _phases: null
  # @private
  _current: null

  # sinple constructor
  constructor: () ->
    @_phases = {}

  ###
    @param {String} phase : the name of the game phase to check for
    @return {Boolean} (true|false) depending on whether the manager knows
    about it or not
  ###
  has: (phase) ->
    if (@_phases.hasOwnProperty phase) then true else false

  ###
    addPhase :
      creates a phase for the game, based on the following parameters

    @param {String} name : a name for the phase MUST BE UNIQUE
    @param {Function} actionIn : the action to perform when entering the state
    @param {Function} actionOut : the action to perform when leaving the state
    @param {Function} run : the action to perform when running the state
  ###
  addPhase: (name, actionIn, actionOut, run) ->
    if (@has(name))
      AE.error "Phase " + name + " already exists"
    else
      @_phases[name] = new AE.States.GamePhase(name, actionIn, actionOut, run)

  ###
    current: returns the name of the current state
  ###
  current: () ->
    @_current

  ###
    setCurrent:
      gets straight to state specified

    @param {String} current : the state to be set as the current one
  ###
  setCurrent: (current) ->
    if (@has(current.toString()))
      @_current = @_phases[current.toString()]
      @_current.setActive()
      @_current.in()
      @_current.run()
    else
      AE.error "No such phase: " + current

  ###
    setCurrent:
     gets to the specified state by appliying the transitions
     (if any were associated with the states)

    @param {String} next : the state to be set as the current one
  ###

  transitionTo: (next) ->
    if (@_current == null)
      AE.error "No current phase was set, can't transit from nowhere"
    else
      @_current.out()
      @_current.setUnactive()
      @setCurrent(next)