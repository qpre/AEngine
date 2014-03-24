###
  Simple Singleton implementation
###
class AE.AESingleton.AESingleton
  # @private
  @_instance: null

  ###
    @return {Object} an instance of the inheritting object
  ###
  @getInstance: () ->
    @_instance or= new @()
