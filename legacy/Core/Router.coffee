#<< AE/Object
#<< AE/States/GamePhasesManager

###
	AE.Router is the bridge between AE.GamePhase and the window.location

  adapted from:
  krasimirtsonev.com/blog/article/A-modern-JavaScript-router-in-100-lines-\
history-api-pushState-hash-url
###
class AE.Router extends AE.Singleton
  _routes: []
  _root: '/'

  # simple constructor
  constructor: () ->
    # registering to URL hash changes for this window
    window.addEventListener "hashchange", (() => @listen()), false
    # this will allow us to apply current route after load
    window.addEventListener 'load', (e) -> AE.Router.getInstance().check()

  ###
    getFragment:
    gets the current URL fragment from browser
  ###
  getFragment: () ->
    match = window.location.href.match /#(.*)$/
    frag = @_clearSlashes if match then match[1] else ''
    frag

  ###
    clearSlashes:
    @param {String} path : the path to be cleaned up
  ###
  _clearSlashes: (path) ->
    path.toString().replace(/\$/, '').replace(/^\//, '')

  ###
    add: associates a regexp to a handler
    @param {String} re : a regexp defining the route
    @param {Function} handler: what to do with the route
  ###
  add: (re, handler, isRoot) ->
    @_routes.push {re: re, handler: handler}
    if isRoot then @_root = re
    @

  ###
    remove:
    @param {Function,String} param a selector for a route to remove
  ###
  remove: (param) ->
    for route in @_routes
      if route.handler == param or route.re.toString() == param.toString()
        @_routes.splice i, 1
        return @
    @

  ###
    flush: reinits the Router
  ###
  flush: () ->
    @_routes = []
    @_root = '/'

  ###
    check: applies the handler for a path fragment
    (if any)

    @param {frag} the path fragment to be checked
  ###
  check: (frag) ->
    fragment = frag || @getFragment()

    for route in @_routes
      match = fragment.match(route.re)
      if match
        match.shift()
        route.handler.apply {}, match
        return @

    AE.log "AE.Router: no such route #{fragment}, redirecting at index"
    @navigate @_root

  ###
    listen: hashchanged event listener
      retrieves the current path and applies check on it
  ###
  listen: () ->
    if window.location.hash != @current
      @current = window.location.hash
      @check @current

  ###
    navigate: sets up a new hash path in the browser

    @param {String} path
  ###

  navigate: (path) ->
    path = path || ''
    window.location.href.match(/#(.*)$/)
    window.location.href = window.location.href.replace(/#(.*)$/, '')+"##{path}"
    @
