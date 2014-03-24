#<< src/AEWorker/AEWorker

###
  AEMessageBox:
    A message box accessible by every object

  @extend AEngine.AEWorker
###

class AEMessageBox extends AEWorker
  # @private
  _messages: null

  ###
    @param {String} dest : the guid for the message recipient
    @param {String} message : self explanatory
  ###
  post: (dest, message) ->
    @_messages[dest].push message

  ###
    @param {String} dest : the guid for the message recipient
    @return {Array.<String>} an array containing all the messages since the last update
  ###
  get: (dest) ->
    @_messages[dest]

  ###
    @param {string} dest : the guid for the message recipient
  ###
  flush: (dest) ->
    @_messages[dest] = [] # TODO: Avoid garbage collector by finding a smarte approach
