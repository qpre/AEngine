#<< AE/Console
#<< AE/Object
#<< AE/FileSystem

class AE.Loaders.URLLoader extends AE.Object
  isReady: false
  _fileURL: null
  _file: null

  constructor: (@_fileURL, @_onSuccess, @_filepath) ->
    if !@_filepath
      @_filepath = @guid
    @guid

  load: () ->
    if @_fileURL
      @requestURL()
    else
      AE.Console.error 'no file URL were specified'

  requestURL: () ->
    asyncRequestURL @_fileURL, (blob) =>
      AE.FileSystem.getInstance().writeFile @guid, blob, () =>
        AE.Console.log 'wrote :' + @guid
        @_onSuccess @_filepath
      

