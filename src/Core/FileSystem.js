// note: the stacking pattern might not be useful since we got
// rid of the async part implied by the creation of a FileSystem.
// We'll keep it though, 'just in case'

class FileSystem {
  constructor() {
    this._filesMap = null;
    this._isCreated = null;
    this._stack = [];
  }

  createFileSystem (callBack=null) {
    callback && this._stack.push(callBack);

    if (this._isCreated === null) {
      this._filesMap = {};
      this.onInitFS();
    }
  }

  onInitFS () {
    let callback;
    let i;
    let len;
    let ref;

    this._isCreated = true;
    ref             = this._stack;

    for (i = 0, len = ref.length; i < len; i++) {
      callback = ref[i];
      callback.call();
    }

    this._stack = [];
  }

  writeFile (filePath, file, onWrite=null) {
    let blob;

    if (this._filesMap) {
      if (this._filesMap[filePath]) {
        AE.error("A FILE NAMED " + filePath + " ALREADY EXISTS");
      } else {
        blob                      = new Blob([file]);
        this._filesMap[filePath]  = blob;

        onWrite && onWrite(blob);
      }
    } else {
      this.createFileSystem(() => {
        this.writeFile(filePath, file, onWrite);
      });
    }
  }

  readFile (filePath, onSuccess=null, onError=null, returnType='text') {
    let file;
    let fileReader;

    if (returnType == null) {
      returnType = 'text';
    }
    if (this._filesMap) {
      if (this._filesMap[filePath]) {
        file = this._filesMap[filePath];

        fileReader = new FileReader();
        fileReader.onloadend = function () {
          onSuccess && onSuccess(fileReader.result);
        };

        switch (returnType) {
          case 'text':
            fileReader.readAsText(file);
          case 'url':
            fileReader.readAsDataURL(file);
        }
      } else {
        AE.error('FILE NOT FOUND : #{filePath}');
        onError && onError();
      }
    } else {
      return this.createFileSystem((function(_this) {
        return function() {
          return _this.readFile(filePath, onSuccess);
        };
      })(this));
    }
  }

  readFileSync (filePath, returnType='text') {
    let loaded
    let onLoaded;
    let res;

    loaded  = false;
    res     = null;

    onLoaded = function (result) {
      loaded = true;

      return res = result;
    };

    this.readFile(filePath, onLoaded, onLoaded, returnType);

    while (!loaded) {
      true;
    }

    return res;
  }

  readBuffer (filePath, onSuccess=null) {
    let file;
    let fileReader;

    if (this._filesMap) {
      if (this._filesMap[filePath]) {
        file = this._filesMap[filePath];
        fileReader = new FileReader();

        if (fileReader.result) {
          fileReader.onloadend = function () {
            onSuccess && onSuccess(fileReader.result);
          };
          fileReader.readAsArrayBuffer(file);
        } else {
          AE.error('FILE NOT FOUND : #{filePath}');
        }
      }
    } else {
      this.createFileSystem();
      this.readFile(filePath, onSuccess);
    }
  }
}

export default FileSystem = new FileSystem();
