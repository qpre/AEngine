#<< AE/Engine
#<< Audio/SubSystem

AE.Audio = Audio

class Audio.Engine extends AE.Engine
  context: null
  systems: {}
  
  constructor: () ->
    AE.log 'AE.Audio: start'
  
  createSubSystem: (name, filesMap) ->
    @systems[name] = new AE.Audio.SubSystem(filesMap)
    @systems[name]