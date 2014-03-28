#<< AE/Object
#<< AE/States/GamePhaseManager

class AE.Engine extends AE.Object
	PhasesManager: null
	MessageBox: null

	constructor: () ->
		@PhasesManager = new AE.States.GamePhasesManager()
