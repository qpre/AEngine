AE.Game = Game

class Game.Engine extends AE.Engine
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
        .createWithMessagingSystem()
      @_messageBox

  constructor: (opts) ->
    AE.Config.getInstance().setConfig opts
    @MessageBox = @MessageBox