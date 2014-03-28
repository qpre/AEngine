#<< AE/Object
#<< AE/States/GamePhasesManager
#<< AE/Helpers

class AE.Engine extends AE.Object
	_phasesManager: null
	_messageBox: null

	@property 'PhasesManager',
		get: () -> 
			if (!@_phasesManager) then new AE.States.GamePhasesManager()
			@_phasesManager

	constructor: () ->
		console.log "instantiating new engine"