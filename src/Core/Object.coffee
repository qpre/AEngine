#<< AE/IdFactory

###
    AEObject: a base class for every object in the engine
###

class AE.Object
  # @private
  _guid: null
  
  @property 'guid',
    get: () ->
      if not @_guid then AE.IdFactory.getInstance().getGUID()
      @_guid

  ###
    Init: default initializer for object
    this method is called upon instanciation of a new object of such class
  ###
  init: () ->

  ###
    create: creates a new instance for the given object
            passes possible arguments to the objects init
            function.
            except for exceptions, EVERY instance should
            be created using this method

    @return {Object} an instance of the inherriting class
  ###
  @create: () ->
    C = @
    inst = new C()
    if (arguments.length > 0)
      inst.init(arguments)
    else
      inst.init()
    inst

