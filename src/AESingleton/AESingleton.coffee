###
  Simple Singleton implementation
###
class AESingleton
  # @private
  @_instance: null

  ###
    @return {Object} an instance of the inheritting object
  ###
  @getInstance: () ->
    @_instance or= new @()
