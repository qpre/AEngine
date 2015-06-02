#<< AE/Engine
AE.Game = Game

class Game.Engine extends AE.Engine
  phasesManager: null
  _messageBox: null

  # Lazy setting Message Box
  @property 'MessageBox',
    get: () ->
      if (!@_messageBox)
        @_messageBox = AE
        .Workers
        .Manager
        .getInstance()
        .createWithMessagingSystem()
      @_messageBox

  constructor: (opts) ->
    AE.Config.getInstance().setConfig opts
    @MessageBox = @MessageBox
    @phasesManager = AE.States.GamePhasesManager.getInstance()