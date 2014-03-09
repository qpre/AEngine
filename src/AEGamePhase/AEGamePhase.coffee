#_require ../AEObject/AEObject
#_require ../AEEvent/AEEvent

StatusEnum = Object.freeze({
  ACTIVE: 0,
  PAUSED: 1
})

class AEGamePhase extends AEObject
  _status: StatusEnum.PAUSED
  _statusChangedEvent: null

  constructor: (@_name, @_in, @_out, @_run) ->
    @_statusChangedEvent = new AEEvent(@)
    @_statusChangedEvent.subscribe(@onStatusChanged)

  notifyStatusChanged: () ->
    @_statusChangedEvent.notify { 'status': @_status }

  ###
    Override me to unleash the kraken
  ###
  onStatusChanged: (sender, args) ->
    console.log "status changed to :" + args.status

  setActive: () ->
    @_status = StatusEnum.ACTIVE
    @notifyStatusChanged()

  setUnactive: () ->
    @_status = StatusEnum.PAUSED
    @notifyStatusChanged()

  in: () ->
    @_in()

  out: () ->
    @_out()

  run: () ->
    @_run()

AEngine.AEGamePhase = AEGamePhase
AEngine.AEGamePhase.StatusEnum = StatusEnum