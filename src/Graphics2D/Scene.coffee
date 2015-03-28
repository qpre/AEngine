#<< AE/Object
#<< Graphics/Animate
#<< Graphics2D/Drawable

class Graphics2D.Scene extends AE.Object
  _drawables: []

  constructor: (@_width, @_height) ->
    @_dom = document.createElement 'canvas'
    @resize @_width, @_height
    @initGestures()

  resize: (@_width, @_height) ->
    @_dom.height = @_height
    @_dom.width  = @_width
    if @_fillRect
      @_drawables[@_fillRect].width = @_width
      @_drawables[@_fillRect].height = @_height

  fill: (color) ->
    if (@_fillRect) then @remove @_fillRect
    fill = new Graphics2D.Geometry.Rectangle 0, 0, @_width, @_height, color
    @_fillRect = fill.guid
    @add fill

  clearScreen: () ->
    ctx = @_dom.getContext "2d"
    ctx.clearRect 0, 0, @_width, @_width

  clearAll: () ->
    for own guid, drawable of @_drawables
      delete @_drawables[guid]

  updateAll: () ->
    for own guid, drawable of @_drawables
      if drawable.update then drawable.update()

  renderAll: () ->
    @clearScreen()
    @updateAll()

    ctx = @_dom.getContext '2d'
    ctx.save()
    for own guid, drawable of @_drawables
      drawable.draw(ctx)
    ctx.restore()

  add: (drawable) ->
    @_drawables[drawable.guid] = drawable

  remove: (guid) ->
    delete @_drawables[guid]

  attachTo: (container) ->
    container.appendChild @_dom

  start: () ->
    @renderAll()
    @_timer = requestAnimationFrame (() -> @start()).bind @

  stop: () ->
    if @_timer then cancelAnimationFrame @_timer
    @_timer = null

  ###
    Gestures
    This part handles the click events inside a 2D canvas scene.
    todo: move to a different entity
  ###
  initGestures: () ->
    # click event
    @_dom.addEventListener 'mousedown', ((event) => @onClick(event)), false

  onClick: (event) ->
    x = event.pageX
    y = event.pageY
    intersects = []
    for own guid, drawable of @_drawables
      if drawable.intersects and drawable.intersects(x, y)
        intersects.push drawable

    #FIXME: resolve z-index

    for intersect in intersects
      intersect.onClick()
