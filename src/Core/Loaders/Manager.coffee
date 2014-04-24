#<< AE/Singleton
#<< AE/Loaders/URLLoader

###
	TODO: manage already loaded files
###
class AE.Loaders.Manager extends AE.Singleton
  _loaders: []

  createURLLoader: (fileURL, onSuccess) ->
    loader = new AE.Loaders.URLLoader fileURL, onSuccess
    @_loaders.push loader
    loader