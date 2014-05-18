#<< AE/Object

#
# Effects are intended to be short sounds, they don't require anything more
# than a fire functionnality
#
# TODO: Handling of 2D and 3D Audio
#

class Audio.Effect extends AE.Object
  context:  null
  buffer:   null
  context:  null
  
  filePath: null
  
  playing:  false
  loaded:   false
  
  constructor: (@filePath, @context) ->
    loader = AE.Loaders.Manager.getInstance().createURLLoader filePath,\
    (file) =>
      AE.FileSystem.getInstance().readBuffer file, (buffer) =>
        @context.decodeAudioData buffer, (b) =>
          @buffer = b
          AE.log "AE.Audio: effect #{name} loaded"

    loader.load()
  
  fire: () ->
    source = @context.createBufferSource()
    source.buffer = @buffer
    source.connect @context.destination
    source.start(0)