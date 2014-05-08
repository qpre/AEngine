AE.Audio = Audio

#TODO: implement audiobuffer loading for better efficiency

class Audio.Engine extends AE.Engine
  music: {}
  effects: {}
  context: null
  
  constructor: () ->
    try
      window.AudioContext = window.AudioContext||window.webkitAudioContext
      @context = new AudioContext()
      AE.log 'AE.Audio: start'
    catch e
      AE.error 'AE.Audio : Web Audio API not supported'

  loadMusic: (sourceFile, name) ->
    
  loadEffect: (sourceFile, name) ->
    loader = AE.Loaders.Manager.getInstance().createURLLoader sourceFile, (file) =>
      AE.FileSystem.getInstance().readBuffer file, (buffer) =>
        @context.decodeAudioData buffer, (b) =>
          AE.log "AE.Audio: effect " + name + " loaded"
          @effects[name] = b
    loader.load()
    
  playEffect: (name) ->
    if @effects[name]
      source = @context.createBufferSource()
      source.buffer = @effects[name]
      source.connect @context.destination
      source.start(0)
    else
      AE.error "AE.Audio: no such effect: " + name
    