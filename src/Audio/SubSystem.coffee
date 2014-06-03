#<< AE/Object

class Audio.SubSystem extends AE.Object
  constructor: (names) ->
    try
      window.AudioContext = window.AudioContext||window.webkitAudioContext
      @context = new AudioContext()
    catch e
      AE.error 'AE.Audio : Web Audio API not supported'
      
    @loadMap names