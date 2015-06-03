import AEObject from '../Core/Object';

export default class URLLoader extends AEObject {

  constructor (_fileURL=null, _onSuccess=null, _filepath=null) {
    super();

    this.isReady    = false;
    this._file      = null;
    this._fileURL   = _fileURL;
    this._onSuccess = _onSuccess;
    this._filepath  = _filepath;

    if (!this._filepath) {
      this._filepath = this.guid;
    }

    this.guid;
  }

  load () {
    if (this._fileURL) {
      return this.requestURL();
    } else {
      return AE.error('no file URL were specified');
    }
  }

  requestURL () {
    return asyncRequestURL(this._fileURL, (blob) => {
      AE.FileSystem.writeFile(this.guid, blob, () => {
        this._onSuccess(this._filepath);
      });
    });
  }


}
