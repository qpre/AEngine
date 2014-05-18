#<< Audio/SubSystem
#<< Audio/Effect

class Audio.EffectsSubSystem extends Audio.SubSystem
  
  loadMap: (filesMap) ->
    for name, file of filesMap
      @effects[name] = new Audio.Effect file, @context
    
  fire: (name) ->
    if @effects[name]
      @effects[name].fire()
    else
      onError()