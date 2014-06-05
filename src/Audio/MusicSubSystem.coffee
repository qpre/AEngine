#<< Audio/SubSystem
#<< Audio/Music

class Audio.MusicSubSystem extends Audio.SubSystem
  sounds: {}
  context: null
  length: 0

  loadMap: (names) ->
    for name in names
      @sounds[name] = new AE.Audio.Music name, @
      @length++

  play: (name) ->
    if @sounds[name]
      @sounds[name].play()
    else
      onError()
      
  prepare: (onPrepared) ->
    remainingMusic = @length
    
    onPreparedSound = (() ->
      remainingMusic = remainingMusic  - 1
      if remainingMusic == 0
        onPrepared()
    ).bind @, remainingMusic, onPrepared
      
    for name, sound of @sounds
      sound.prepare(onPreparedSound)