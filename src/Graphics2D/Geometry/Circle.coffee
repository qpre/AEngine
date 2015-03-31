#<< Graphics2D/ImageFillable
#<< Graphics2D/Drawable

Object.extend = (destination, source) ->
  for property of source
    destination[property] = source[property]
  destination

class Graphics2D.Geometry.Circle extends Graphics2D.Drawable

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
    # ctx.lineWidth = @strokeSize
    # ctx.strokeStyle = @strokeStyle
    #
    # ctx.beginPath()
    # ctx.arc @x, @y, @radius, 0, 2 * Math.PI, false
    # ctx.stroke()
    # ctx.clip()
    # ctx.closePath()

    ctx.save()
    ctx.translate @x, @y
    @imageHandler?.draw ctx
    ctx.restore()

  intersects: (x, y) ->
    if (x - @x)*(x - @x) + (y - @y)*(y - @y) <= @squareRadius
      return true
    false

  onClick: () ->
    console.log "Baby touch me one more time"


  fillWithImage: (opts) ->
    @imageHandler = new Graphics2D.ImageHandler opts
