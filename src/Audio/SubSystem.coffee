#<< AE/Object
class Audio.SubSystem extends AE.Object
  buffers: {}
  
  constructor: (filesMap)->
    try
      window.AudioContext = window.AudioContext||window.webkitAudioContext
      @context = new AudioContext()
      AE.log 'AE.Audio: start'
    catch e
      AE.error 'AE.Audio : Web Audio API not supported'
      
    @loadMap filesMap
    
  # TODO: make the use of a worker for that
  load: (filePath, name) ->
    loader = AE.Loaders.Manager.getInstance().createURLLoader filePath,\
    (file) =>
      AE.FileSystem.getInstance().readBuffer file, (buffer) =>
        @context.decodeAudioData buffer, (b) =>
          AE.log "AE.Audio: effect #{name} loaded"
          @buffers[name] = b
    loader.load()
    
  loadMap: (filesMap) ->
    for name, file of filesMap
      @load file, name
    
  play: (name) ->
    if @buffers[name]
      source = @context.createBufferSource()
      source.buffer = @buffers[name]
      source.connect @context.destination
      source.start(0)
    else
      onError()