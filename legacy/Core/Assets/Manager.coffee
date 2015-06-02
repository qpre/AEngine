#<< AE/Singleton
#<< AE/Assets/URLLoader

###
	TODO: Handle names collisions
###
class AE.Assets.Manager extends AE.Singleton
  assetsOrigin: [] # contains all the assets definitions
  assets: {} # contains all the loaded assets
  length: 0

  register: (filesMap = []) ->
    for assetPath in filesMap
      if @assets[assetPath] is undefined
        @assets[assetPath] = null
        @length++
      else
        AE.debug "ASSETS: #{assetPath} has already been registered"

  load: (onReady, onOneAssetLoaded) ->
    @remaining = @length
    for assetPath, asset of @assets
      if asset is null # Avoiding to reload already loaded filed
        @loadSingleAsset(assetPath, onReady, onOneAssetLoaded)

  loadSingleAsset: (assetPath, onReady, onOneAssetLoaded) ->
    loader = @createURLLoader assetPath, (file) =>
      AE.log "#{assetPath} ready"
      @assets[assetPath] = file
      @remaining = @remaining - 1
      onOneAssetLoaded?(@remaining)
      if @remaining == 0 then onReady()
    loader.load()

  has: (path) ->
    @assets[path] is undefined

  get: (name) ->
    if (@assets[name] == null)
      AE.log "#{name} not loaded yet"
    else if (@assets[name] == undefined)
      AE.error "#{name} not referenced"
    else
      @assets[name]

  getSyncFile: (path) ->
    AE.FileSystem.getInstance().readFileSync @get(path), 'url'


  createURLLoader: (fileURL, onSuccess) ->
    loader = new AE.Assets.URLLoader fileURL, onSuccess
    loader
