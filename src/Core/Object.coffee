#<< AE/Helpers
#<< AE/IdFactory

moduleKeywords = ['extended', 'included']

###
    AEObject: a base class for every object in the engine
###

class AE.Object
  # @private
  _guid: null
  
  @property 'guid',
    get: () ->
      if @_guid == null then @_guid = AE.IdFactory.getInstance().getGUID()
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

  ###
    Extension pattern:
    based on http://arcturo.github.io/library/coffeescript/03_classes.html
  ###
  @extend: (obj) ->
    for key, value of obj when key not in moduleKeywords
      @[key] = value

    obj.extended?.apply(@)
    this

  @include: (obj) ->
    for key, value of obj when key not in moduleKeywords
      # Assign properties to the prototype
      @::[key] = value

    obj.included?.apply(@)
    this