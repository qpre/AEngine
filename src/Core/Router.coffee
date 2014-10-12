#<< AE/Object
#<< AE/States/GamePhasesManager

###
	AE.Router is the bridge between AE.GamePhase and the window.location

  adapted from:
  krasimirtsonev.com/blog/article/A-modern-JavaScript-router-in-100-lines-history-api-pushState-hash-url
###
class AE.Router extends AE.Singleton
  _routes: []
  _root: '/'
  
  constructor: () ->
    window.onhashchange = () => @listen()
  
  getFragment: () ->
    match = window.location.href.match /#(.*)$/
    frag = @_clearSlashes if match then match[1] else ''
    frag
    
  _clearSlashes: (path) ->
    path.toString().replace(/\$/, '').replace(/^\//, '')
    
  add: (re, handler) ->
    @_routes.push {re: re, handler: handler}
    @
  
  remove: (param) ->
    for route in @_routes
      if route.handler == param or route.re.toString() == param.toString()
        @_routes.splice i, 1
        return @
    @
    
  flush: () ->
    @_routes = []
    @_root = '/'
    
  check: (frag) ->
    fragment = frag || @getFragment()
    for route in @_routes
      match = fragment.match(route.re)
      if match
        match.shift()
        route.handler.apply {}, match
        return @
    AE.log "AE.Router: no such route ##{fragment}"
    @
    
  listen: () ->
    if window.location.hash != @current
      @current = window.location.hash
      @check @current
      
  navigate: (path) ->
    path = path || ''
    window.location.href.match(/#(.*)$/)
    window.location.href = window.location.href.replace(/#(.*)$/, '') + "##{path}"
    @