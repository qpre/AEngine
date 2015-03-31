#<< AE/Object

class Graphics2D.Camera extends AE.Object
  x = 0
  y = 0

  speed: 800
  scaleFactor: 1

  constructor: (@_dom, @scene, @x, @y, @cameraW, @cameraY, @sceneW, @sceneY) ->
    @_initControls()

  update: (step) ->
    step /= 1000 #convert to seconds
    if @goLeft
      if @x > 10 then @x += (20 * step) / @scaleFactor
    if @goUp
      if @y > 10 then @y += (20 * step) / @scaleFactor
    if @goDown
      if @y < @scene.height() then @y -= 20 * step
    if @goRight
      if @x < @scene.width() then @x -= 20 * step

  resize: (width = @cameraW, height = @cameraY) ->
    @_dom.width = width
    @_dom.height = height

  position: (@x = @x, @y = @y) ->
    {x: @x, y: @y}

  scale: (ctx) ->
    ctx.scale @scaleFactor, @scaleFactor

  onMouseWheel: (e) ->
    e = window.event || e
    delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)))
    if @scaleFactor <= 3 and @scaleFactor >= 0.5
      @scaleFactor += delta / 50
      if delta < 0 then @scaleFactor = Math.max @scaleFactor, 0.5
      if delta > 0 then @scaleFactor = Math.min @scaleFactor, 3
    false

  onKeyChange: (e, value) ->
    switch e.keyCode
      when 37
        @goLeft = value
      when 38
        @goUp = value
      when 39
        @goRight = value
      when 40
        @goDown = value
      # when 80:
      #   # pause

  _initControls: () ->
    if window.addEventListener
      window.addEventListener "mousewheel", ((e) => @onMouseWheel(e)), false
      window.addEventListener "DOMMouseScroll", ((e) => @onMouseWheel(e)), false
    else
      window.attachEvent "onmousewheel", ((e) => @onMouseWheel(e))

    window.addEventListener "keyup", (e) => @onKeyChange e, false
    window.addEventListener "keydown", (e) => @onKeyChange e, true
