###
  Simple Singleton implementation
###
class src.AESingleton.AESingleton
  # @private
  @_instance: null

  ###
    @return {Object} an instance of the inheritting object
  ###
  @getInstance: () ->
    @_instance or= new @()

AEngine.AESingleton = AESingleton