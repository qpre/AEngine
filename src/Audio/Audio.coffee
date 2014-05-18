#<< AE/Engine
#<< Audio/SubSystem

AE.Audio = Audio

class Audio.Engine extends AE.Engine
  context: null
  effectsSystems: {}
  musicSystems: {}
  
  constructor: () ->
    AE.log 'AE.Audio: start'
  
  createEffectsSubSystem: (name, filesMap) ->
    @effectsSystems[name] = new AE.Audio.EffectsSubSystem(filesMap)
    @effectsSystems[name]