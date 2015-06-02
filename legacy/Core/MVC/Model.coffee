#<< AE/Object
#<< AE/Event

class AE.MVC.Model extends AE.Object
  _propertyChangedEvent: null
	
  init: () ->
    @_propertyChangedEvent = new AE.Event(@)

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