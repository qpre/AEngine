#<< src/AESingleton/AESingleton

###
  AEIdFactory class aims to handle object identification through the engine via
  GUIDs
  This class follows the Singleton design pattern
  @extend AEEngine.AESingleton
###
class src.AEIdFactory.AEIdFactory extends AESingleton
  _guids: null

  ###
      constructor: called on singleton's new instance creation
  ###
  constructor: () ->
    @_guids = []

  ###
      has: checks if param guid has already been registered
      @param {String} the GUID to be checked
  ###
  has: (guid) ->
    if @_guids.indexOf(guid.toString()) > -1 then true else false

  ###
    @return {Boolean} a brand new and unique GUID
  ###
  getGUID: () ->
    newguid = @guid()

    if !@has(newguid)
      @_guids.push newguid
    else
      newguid = @getGUID()

    newguid

  ###
      GUID GENERATION FUNCTIONS
  ###
  s4 : () ->
    Math.floor((1 + Math.random()) * 0x10000).toString(16).substring 1

  guid: () ->
    @s4() + @s4() + "-" + @s4() + "-" + @s4() + "-" + @s4() + "-" + @s4() + @s4() + @s4()

AEngine.AEIdFactory = AEIdFactory