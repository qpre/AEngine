#<< Graphics2D/Drawable

Object.extend = (destination, source) ->
  for property of source
    destination[property] = source[property]
  destination

class Graphics2D.Geometry.Circle extends AE.Object
  @include Graphics2D.Drawable

  defaults: {
    strokeStyle: "#00FF00"
    strokeSize: 1
  }

  constructor: (opts) ->
    opts = Object.extend @defaults, opts
    {
      @x
      @y
      @radius
      @strokeStyle
      @strokeSize
    } = opts

    @squareRadius = @radius * @radius

  draw: (ctx) ->
    ctx.beginPath()
    ctx.arc @x, @y, @radius, 0, 2 * Math.PI, false
    ctx.lineWidth = @strokeSize
    ctx.strokeStyle = @strokeStyle
    ctx.stroke()

    if @imageOpts
      @_drawImage(ctx)

  intersects: (x, y) ->
    if (x - @x)*(x - @x) + (y - @y)*(y - @y) <= @squareRadius
      return true
    false

  fillWithImage: (opts) ->
    @imageOpts = {
      path
      x
      y
      width
      height
    } = opts

    @imageOpts.img = new Image()
    @imageOpts.img.addEventListener 'load', (e) =>
      @imageOpts.loaded = true
    AE.FileSystem.getInstance().readFile @imageOpts.path, (result) =>
      @imageOpts.img.src = result

  _drawImage: (ctx) ->
    if @imageOpts.loaded
      ctx.drawImage @imageOpts.img, @imageOpts.x, @imageOpts.y, \
      @imageOpts.width, @imageOpts.height

  onClick: () ->
    console.log "Baby touch me one more time"
