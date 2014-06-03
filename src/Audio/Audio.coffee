#<< AE/Engine
#<< Audio/SubSystem

AE.Audio = Audio

class Audio.Engine extends AE.Engine
  context: null
  effectsSystems: {}
  musicSystems: {}
  
  constructor: () ->
    AE.log 'AE.Audio: start'
  
  createEffectsSubSystem: (name, effectsMap) ->
    @effectsSystems[name] = new AE.Audio.EffectsSubSystem(effectsMap)
    @effectsSystems[name]
    
  createMusicSubSystem: (name, musicsMap) ->
    @musicSystems[name] = new AE.Audio.MusicSubSystem(musicsMap)
    @musicSystems[name]