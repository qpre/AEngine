#<< Audio/SubSystem

AE.Audio = Audio

class Audio.Engine extends AE.Engine
  context: null
  
  constructor: () ->
    AE.log 'AE.Audio: start'
  
  createSubSystem: (name, filesMap) ->
    this.systems[name] = new AE.Audio.System(filesMap)