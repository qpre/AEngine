#<< Graphics2D/Drawable
class Graphics2D.Geometry.Circle extends AE.Object
  @include Graphics2D.Drawable
  @include Graphics2D.Clickable

  constructor: (@x, @y, @radius, @strokeStyle="#00FF00", @strokeSize=1) ->
    @squareRadius = @radius * @radius

  draw: (ctx) ->
    ctx.beginPath()
    ctx.arc @x, @y, @radius, 0, 2 * Math.PI, false
    ctx.lineWidth = @strokeSize
    ctx.strokeStyle = @strokeStyle
    ctx.stroke()

  intersects: (x, y) ->
    if (x - @x)*(x - @x) + (y - @y)*(y - @y) <= @squareRadius
      return true
    false

  onClick: () ->
    console.log "Baby touch me one more time"