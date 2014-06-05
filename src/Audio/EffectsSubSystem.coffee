#<< Audio/SubSystem
#<< Audio/Effect

class Audio.EffectsSubSystem extends Audio.SubSystem
  sounds: {}
  context: null
  length: 0
  
  loadMap: (names) ->
    for name in names
      @sounds[name] = new AE.Audio.Effect name, @
      @length++
  
  fire: (name) ->
    if @sounds[name]
      @sounds[name].fire()
    else
      onError()
      
  prepare: (onPrepared) ->
    remainingEffects = @length
    
    onPreparedSound = (() ->
      remainingEffects = remainingEffects - 1
      if remainingEffects == 0
        onPrepared()
    ).bind @, remainingEffects, onPrepared
      
    for name, sound of @sounds
      sound.prepare(onPreparedSound)