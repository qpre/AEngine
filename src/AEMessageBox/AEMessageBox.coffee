#_require ../AEWorker/AEWorker

###
    AEMessageBox:
        A message box accessible by every object
###

class AEMessageBox extends AEWorker
  _messages: null

  post: (dest, message) ->
    @_messages[dest].push message

  get: (dest) ->
    @_messages[dest]
        
AEngine.AEMessageBox = AEMessageBox