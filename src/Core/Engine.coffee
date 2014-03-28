#<< AE/Object
#<< AE/States/GamePhaseManager

class AE.Engine extends AE.Object
	@_gamePhases: null
	@_messageBox: null

	constructor: () ->

	PhasesManager: () ->
		if not @_gamePhases
			@_gamePhases = new AE.States.GamePhasesManager()

		@_gamePhases

