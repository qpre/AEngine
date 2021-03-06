#<< AE/Object

class Audio.SubSystem extends AE.Object
  setVolume: (value) ->
    this.gainNode.gain.value = value / 100

  constructor: (names) ->
    try
      window.AudioContext = window.AudioContext||window.webkitAudioContext
      @context = new AudioContext()
      @gainNode = @context.createGain()
      @gainNode.connect @context.destination
    catch e
      AE.error e
      AE.error 'AE.Audio : Web Audio API not supported'
      
    @loadMap names