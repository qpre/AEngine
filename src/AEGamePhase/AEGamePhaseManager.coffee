#_require AEGamePhase
#_require ../AESingleton/AESingleton

###
  AEGamePhaseManager aims to handle game states and their transitions.

  TODO: Add some error checking in case of failing to transit
###

class AEGamePhaseManager extends AESingleton
  _phases: null
  _current: null

  constructor: () ->
    @_phases = {}

  has: (phase) ->
    if (@_phases.hasOwnProperty phase) then true else false

  addPhase: (name, actionIn, actionOut, run) ->
    if (@has(name))
      console.error "Phase " + name + " already exists"
    else
      @_phases[name] = new AEGamePhase(name, actionIn, actionOut, run)

  setCurrent: (current) ->
    if (@has(current.toString()))
      @_current = @_phases[current]
      @_current.setActive()
      @_current.in()
      @_current.run()
    else
      console.error "No such phase: " + current

  transitionTo: (next) ->
    if (@_current == null)
      console.error "No current phase was set, can't transit from nowhere"
    else
      @_current.out()
      @_current.setUnactive()
      @setCurrent(next)
      
AEngine.AEGamePhaseManager = AEGamePhaseManager