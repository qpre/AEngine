#<< AE/Object

#
# Effects are intended to be short sounds, they don't require anything more
# than a fire functionnality
#
# TODO: Handling of 2D and 3D Audio
#

class Audio.Effect extends AE.Object
  name: null
  
  context:  null
  buffer:   null
  context:  null
  
  loaded:   false
  
  constructor: (@name, @context, callback) ->
    
    # You must use an assetmgr before.
    
    file = AE.Assets.Manager.getInstance().get name,\
    AE.FileSystem.getInstance().readBuffer file, (buffer) =>
      @context.decodeAudioData buffer, (b) =>
        @buffer = b
        @loaded = true
        if (callback) then callback()

    loader.load()
  
  fire: () ->
    source = @context.createBufferSource()
    source.buffer = @buffer
    source.connect @context.destination
    source.start(0)