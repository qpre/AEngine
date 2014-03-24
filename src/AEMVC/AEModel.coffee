#<< AE/AEObject/AEObject
#<< AE/AEEvent/AEEvent

class AE.AEMVC.AEModel extends AE.AEObject.AEObject
  _propertyChangedEvent: null
	
  init: () ->
    @_propertyChangedEvent = new AEEvent(@)

  ###
    get property value
  ###
  get: (key) ->
    @[key]

  ###
		sets the key property with the value passed
  ###
  set: (key, value) ->
    @[key] = value
    @notifyPropertyChanged key

  ###
    notifyPropertyChanged:
			notifies subscribers that a property was modified
  ###
  notifyPropertyChanged: (property) ->
    @_propertyChangedEvent.notify {'property': property }