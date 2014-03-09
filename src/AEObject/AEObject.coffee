###
    AEObject: a base class for every object in the engine
###

class AEObject
  _guid: null
  
  ###
    Ctor : each gives an object its own unique guid
  ###
  constructor: () ->
    @_guid = AEngine.AEIdFactory.getInstance().getGUID()
  
  ###
    Init: default initializer for object
  ###
  init: () ->
  
  ###
    guid(): a public getter for the object's guid
  ###
  guid: () ->
    @_guid
    
  ###
    create: creates a new instance for the given object
            passes possible arguments to the objects init
            function.
            except for exceptions, EVERY instance should
            be created using this method
  ###
  @create: () ->
    C = @
    inst = new C()
    if (arguments.length > 0)
      inst.init(arguments)
    else
      inst.init()
    inst
    
    
AEngine.AEObject = AEObject
