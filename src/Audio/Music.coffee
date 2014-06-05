#<< AE/Object

#
# Musics intends to be long-playing sounds
#

class Audio.Music extends AE.Object
  name:     null
  
  system:  null
  buffer:   null
  
  loaded:   false
  
  constructor: (@name, @system, @callback) ->

  prepare: (onPrepared) ->
    file = AE.Assets.Manager.getInstance().get @name
    AE.FileSystem.getInstance().readBuffer file, (buffer) =>
      @system.context.decodeAudioData buffer, (b) =>
        @buffer = b
        @loaded = true
        if (onPrepared) then onPrepared()
        
  play: () ->
    if @loaded == true
      source = @system.context.createBufferSource()
      source.buffer = @buffer
      source.connect @system.gainNode
      source.loop = true
      source.start(0)
    else
      AE.error "[MUSIC] not loaded yet: #{@name}"