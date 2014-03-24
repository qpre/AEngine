#<< AE/AEObject/AEObject
#<< AE/AEEvent/AEEvent

AEPhaseStatusEnum = Object.freeze({
  ACTIVE: 0,
  PAUSED: 1
})

###
  AEGamePhase :
    represents a single state for the engine
  @extends AEngine.AEObject
###
class AE.AEGamePhase.AEGamePhase extends AE.AEObject.AEObject
  # @private
  _status: AEPhaseStatusEnum.PAUSED
  # @private
  _statusChangedEvent: null

  ###
    Constructor:

    @param {String} _name : A human readable name
    @param {Function} _in : the function to be triggered when when entering the state
    @param {Function} _out : the function to be triggered when when leaving the state
    @param {Function} _run : the function handling the state
  ###
  constructor: (@_name, @_in, @_out, @_run) ->
    @_statusChangedEvent = new AEEvent(@)
    @_statusChangedEvent.subscribe(@onStatusChanged)

  ###
    dispatches a statusChangedEvent

    @event statusChangedEvent
  ###
  notifyStatusChanged: () ->
    @_statusChangedEvent.notify { 'status': @_status }

  ###
    Override me to unleash the kraken
  ###
  onStatusChanged: (sender, args) ->
    console.log "status changed to :" + args.status

  ###
    self explanatory
  ###
  setActive: () ->
    @_status = AEPhaseStatusEnum.ACTIVE
    @notifyStatusChanged()

  ###
    self explanatory
  ###
  setUnactive: () ->
    @_status = AEPhaseStatusEnum.PAUSED
    @notifyStatusChanged()

  ###
    self explanatory
  ###
  in: () ->
    @_in()

  ###
    self explanatory
  ###
  out: () ->
    @_out()

  ###
    self explanatory
  ###
  run: () ->
    @_run()