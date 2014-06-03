#<< AE/Object

#
# Musics intends to be long-playing sounds
#

class Audio.Music extends AE.Object
  name:     null
  
  context:  null
  buffer:   null
  
  loaded:   false
  
  constructor: (@name, @context, @callback) ->

  prepare: (onPrepared) ->
    file = AE.Assets.Manager.getInstance().get @name
    AE.FileSystem.getInstance().readBuffer file, (buffer) =>
      @context.decodeAudioData buffer, (b) =>
        @buffer = b
        @loaded = true
        if (onPrepared) then onPrepared()
        
  play: () ->
    if @loaded == true
      source = @context.createBufferSource()
      source.buffer = @buffer
      source.connect @context.destination
      source.start(0)
    else
      AE.error "[MUSIC] not loaded yet: #{@name}"