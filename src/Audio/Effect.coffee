#<< AE/Object

#
# Effects are intended to be short sounds, they don't require anything more
# than a fire functionnality
#
# TODO: Handling of 2D and 3D Audio
#

class Audio.Effect extends AE.Object
  name:     null

  system:  null
  buffer:   null

  loaded:   false

  constructor: (@name, @system, @callback) ->

  prepare: (onPrepared) ->
    file = AE.Assets.Manager.getInstance().get @name
    AE.FileSystem.getInstance().readBuffer file, ((buffer) =>
      @system.context.decodeAudioData buffer, (b) =>
        @buffer = b
        @loaded = true
        if (onPrepared) then onPrepared()
    ), 'text'

  fire: () ->
    source = @system.context.createBufferSource()
    source.buffer = @buffer
    source.connect @system.gainNode
    source.start(0)
