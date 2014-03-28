#<< AE/Object
#<< AE/States/GamePhasesManager

class AE.Engine extends AE.Object
	PhasesManager: null
	MessageBox: null

	constructor: () ->
		Object.defineProperties @prototype,
			PhasesManager: 
				get: () -> 
					if (!@PhasesManager) then new AE.States.GamePhasesManager()
					@PhasesManager