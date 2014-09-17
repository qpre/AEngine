#<< AE/Object
class Drawable extends AE.Object
	constructor: (@_height, @_width) ->
		@_dom = document.createElement 'canvas'
		@_dom.height = @_height
		@_dom.width  = @_width