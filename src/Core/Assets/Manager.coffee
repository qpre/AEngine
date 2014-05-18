#<< AE/Singleton
#<< AE/Loaders/URLLoader

###
	TODO: Handle names collisions
###
class AE.Assets.Manager extends AE.Singleton
  _assetsOrigin: [] # contains all the assets definitions
  _assets: {} # contains all the loaded assets 
  
  register: (filesMap) ->
    for assetName, assetPath of filesMap
      @_assetsOrigin.push {name: assetName, path: assetPath}
      @_assets[name] = null

  load: (onReady, onOneAssetLoaded) ->
    @remaining = @_assetsOrigin.length
    for asset in @_assetsOrigin
      loader = @createURLLoader asset.path, (file) =>
        @_assets[asset.name] = file
        @remaining--
        onOneAssetLoaded(@remaining)
        if @remaining == 0 then onReady()
      loader.load()
        
  get: (name) ->
    if (@_assets[name] == null)
      AE.log "#{name} not loaded yet"
    else if (@_assets[name] == undefined)
      AE.error "#{name} not referenced"
    else
      @_assets[name]

  createURLLoader: (fileURL, onSuccess) ->
    loader = new AE.Assets.URLLoader fileURL, onSuccess
    loader
