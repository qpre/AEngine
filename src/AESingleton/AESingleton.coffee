
class AESingleton
  @_instance: null
  
  @getInstance: () ->
    @_instance or= new @()
        
AEngine.AESingleton = AESingleton