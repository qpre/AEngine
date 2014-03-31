#<< AE/Object
#<< AE/States/GamePhasesManager
#<< AE/Helpers

class AE.Engine extends AE.Object
  _phasesManager: null
  _messageBox: null

  @property 'PhasesManager',
    get: () ->
      if (!@_phasesManager)
        @_phasesManager = new AE.States.GamePhasesManager()
      @_phasesManager

  @property 'MessageBox',
    get: () ->
      if (!@_messageBox)
        @_messageBox = AE
        .Workers
        .Manager
        .getInstance()
        .createFromClass('AE.MessageBox')
      @_messageBox

  constructor: () ->
    console.log "instantiating new engine"
    @MessageBox = @MessageBox