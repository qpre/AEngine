#<< AE/Console
#<< AE/Singleton

# note: the stacking pattern might not be useful since we got
# rid of the async part implied by the creation of a FileSystem.
# We'll keep it though, 'just in case'

class AE.FileSystem extends AE.Singleton
  _filesMap: null
  _isCreated: null
  _stack: []

  createFileSystem: (callBack) ->
    @_stack.push callBack
    if @_isCreated == null
      @_filesMap = {}
      @onInitFS()

  onInitFS: () ->
    @_isCreated = true
    for callback in @_stack
      callback.call()
    @_stack = []

  # TODO: rename as 'saveFile'
  writeFile: (filePath, file, onWrite) ->
    if @_filesMap
      if @_filesMap[filePath]
        AE.error "A FILE NAMED #{filePath} ALREADY EXISTS"
      else
        blob = new Blob([file]) # TODO: is that really useful ?
        @_filesMap[filePath] = blob
        if onWrite
          onWrite(blob)
    else
      @createFileSystem () =>
        @writeFile filePath, file, onWrite

  readFile: (filePath, onSuccess, returnType='url') ->
    if @_filesMap
      if @_filesMap[filePath]
        file = @_filesMap[filePath]
        fileReader = new FileReader()
        if (onSuccess)
          fileReader.onloadend = () ->
            onSuccess fileReader.result

        switch returnType
          when 'text'
            fileReader.readAsText file
          when 'url'
            fileReader.readAsDataURL file
      else
        AE.error 'FILE NOT FOUND : #{filePath}'
    else
      @createFileSystem () =>
        @readFile filePath, onSuccess

  readBuffer: (filePath, onSuccess) ->
    if @_filesMap
      if @_filesMap[filePath]
        file = @_filesMap[filePath]
        fileReader = new FileReader()
        if (onSuccess)
          fileReader.onloadend = () ->
            onSuccess fileReader.result
          # TODO: detect the kind of read to perform based on the fileName
          fileReader.readAsArrayBuffer file
        else
          AE.error 'FILE NOT FOUND : #{filePath}'
    else
      @createFileSystem () ->
      @readFile filePath, onSuccess
