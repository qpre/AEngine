#<< AE/Singleton
#<< AE/Assets/URLLoader

###
	TODO: Handle names collisions
###
class AE.Assets.Manager extends AE.Singleton
  assetsOrigin: [] # contains all the assets definitions
  assets: {} # contains all the loaded assets
  manifest: {}
  
  register: (filesMap) ->
    for assetName, assetPath of filesMap
      @assetsOrigin.push {name: assetName, path: assetPath}
      @assets[assetName] = null

  load: (onReady, onOneAssetLoaded) ->
    @remaining = @assetsOrigin.length
    for asset in @assetsOrigin
      @loadSingleAsset(asset, onReady, onOneAssetLoaded)

  loadSingleAsset: (asset, onReady, onOneAssetLoaded) ->
    loader = @createURLLoader asset.path, (file) =>
      console.log "#{asset.name} ready"
      @assets[asset.name] = file
      @remaining = @remaining - 1
      onOneAssetLoaded()
      if @remaining == 0 then onReady()
    loader.load()

  get: (name) ->
    if (@assets[name] == null)
      AE.log "#{name} not loaded yet"
    else if (@assets[name] == undefined)
      AE.error "#{name} not referenced"
    else
      @assets[name]

  createURLLoader: (fileURL, onSuccess) ->
    loader = new AE.Assets.URLLoader fileURL, onSuccess
    loader