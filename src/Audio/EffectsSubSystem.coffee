#<< Audio/SubSystem
#<< Audio/Effect

class Audio.EffectsSubSystem extends Audio.SubSystem
  loadMap: (names) ->
    for name in names
      @sounds[name] = new AE.Audio.Effect name, @context
  
  fire: (name) ->
    if @sounds[name]
      @sounds[name].fire()
    else
      onError()
      
  prepare: () ->
    for name, sound of @sounds
      sound.prepare()