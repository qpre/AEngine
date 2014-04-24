#<< AE/Console
#<< AE/Singleton

self.requestFileSystem = \
  self.requestFileSystem || self.webkitRequestFileSystem

self.requestFileSystemAsync = \
  self.requestFileSystem || self.webkitRequestFileSystem

self.resolveLocalFileSystemURL = \
  self.webkitResolveLocalFileSystemURL || self.resolveLocalFileSystemURL;

class AE.FileSystem extends AE.Singleton
  _isCreated: null
  _stack: []

  createFileSystem: (callBack) ->
    if @_isCreated == null
      requestFileSystem TEMPORARY, 10 * 1024 * 1024, ((fs) ->
        AE.FileSystem.getInstance().onInitFS fs
        return
      ),(e) ->
        AE.FileSystem.getInstance().onErrorFSHandler e
        return
      @_isCreated = false
    @_stack.push callBack

  writeFile: (filePath, file, onWrite) ->
    if @_filesystem
      @_filesystem.root.getFile filePath, {create: true}, (fileEntry) ->
        fileEntry.createWriter (fileWriter) ->
					# setting up writers callbacks
          fileWriter.onerror = (e) -> console.error e
          if (onWrite)
            fileWriter.onwrite = onWrite
          blob = new Blob([file])
          fileWriter.write blob
    else
      @createFileSystem () =>
        @writeFile filePath, file, onWrite

  readFile: (filePath, onSuccess) ->
    if @_filesystem
      @_filesystem.root.getFile filePath, {}, (fileEntry) ->
        fileEntry.file (file) ->
          fileReader = new FileReader()
          if (onSuccess)
            fileReader.onloadend = () ->
              onSuccess fileReader.result
          # TODO: detect the kind of read to perform based on the fileName
          fileReader.readAsText(file)
    else
      @createFileSystem () =>
        @readFile filePath, onSuccess

  onInitFS: (fs) ->
    @_filesystem = fs
    @_isCreated = true
    for callback in @_stack
      callback.call()
    @_stack = []

  onErrorFSHandler: (error) ->
    switch error.code
      when FileError.QUOTA_EXCEEDED_ERR
        msg = "QUOTA_EXCEEDED_ERR"
      when FileError.NOT_FOUND_ERR
        msg = "NOT_FOUND_ERR"
      when FileError.SECURITY_ERR
        msg = "SECURITY_ERR"
      when FileError.INVALID_MODIFICATION_ERR
        msg = "INVALID_MODIFICATION_ERR"
      when FileError.INVALID_STATE_ERR
        msg = "INVALID_STATE_ERR"
      else
        msg = "Unknown Error"
    AE.error 'AE.FILESYSTEM failed with ' + msg