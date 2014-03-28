#<< AE/Object
#<< AE/States/GamePhasesManager

class AE.Engine extends AE.Object
	_phasesManager: null
	_messageBox: null

	constructor: () ->

	Object.defineProperty @PhasesManager,
		get: () -> 
			if (!@_phasesManager) then new AE.States.GamePhasesManager()
			@_phasesManager