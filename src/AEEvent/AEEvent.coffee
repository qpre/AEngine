###
    A simple Observer pattern design implementation
###

class AEEvent
  _subscribers: null
  _sender: null

  ###
      constructor: called on instance creation
      @param {Object} the event's sender
  ###
  constructor: (@_sender) ->
    @_subscribers = []

  ###
      subscribe: adds a new object to the distribution list
      @param {Object} the listener object to be added
  ###
  subscribe: (listener) ->
    @_subscribers.push (listener)

  ###
    notify: distributes args to every subscriber
    @param {Object} args : an object containing the messages' arguments
  ###
  notify: (args) ->
    for i in [0..@_subscribers.length - 1] by 1
      @_subscribers[i](@_sender, args)