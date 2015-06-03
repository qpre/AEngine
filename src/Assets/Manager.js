/*
	TODO: Handle names collisions
 */
class Manager {

  constructor () {
    this.assetsOrigin = [];
    this.assets       = {};
    this.length       = 0;
  }

  register (filesMap=[]) {
    var assetPath
    let i;
    let len;
    let results;

    results = [];

    for (i = 0, len = filesMap.length; i < len; i++) {
      assetPath = filesMap[i];

      if (this.assets[assetPath] === void 0) {
        this.assets[assetPath] = null;
        results.push(this.length++);
      } else {
        results.push(AE.debug("ASSETS: " + assetPath + " has already been registered"));
      }
    }

    return results;
  }

  load (onReady, onOneAssetLoaded) {
    let asset;
    let assetPath;
    let ref;
    let results;

    this.remaining  = this.length;
    ref             = this.assets;
    results         = [];

    for (assetPath in ref) {
      asset = ref[assetPath];

      if (asset === null) {
        results.push(this.loadSingleAsset(assetPath, onReady, onOneAssetLoaded));
      } else {
        results.push(void 0);
      }
    }

    return results;
  }

  loadSingleAsset (assetPath, onReady=null, onOneAssetLoaded=null) {
    let loader;

    loader = this.createURLLoader(assetPath, (file) => {
      AE.log(assetPath + " ready");

      this.assets[assetPath]  = file;
      this.remaining          = this.remaining - 1;

      onOneAssetLoaded && onOneAssetLoaded(_this.remaining);

      if (_this.remaining === 0) {
        onReady && onReady();
      }
    });

    loader.load();
  }

  has (path) {
    return this.assets[path] === void 0;
  }

  get (name) {
    if (this.assets[name] === null) {
      AE.log(name + " not loaded yet");
    } else if (this.assets[name] === void 0) {
      AE.error(name + " not referenced");
    } else {
      return this.assets[name];
    }

    return null;
  }

  getSyncFile (path) {
    return AE.FileSystem.readFileSync(this.get(path), 'url');
  }

  createURLLoader (fileURL, onSuccess) {
    let loader;

    loader = new AE.Assets.URLLoader(fileURL, onSuccess);

    return loader;
  }
}

export default Manager = new Manager();
