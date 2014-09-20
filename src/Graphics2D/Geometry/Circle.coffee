#<< Graphics2D/Drawable
class Graphics2D.Geometry.Circle extends AE.Object
  @extend Graphics2D.Drawable
  
  constructor: (@x, @y, @radius, @strokeStyle = '#003300', @strokeSize = 1) ->
    super

  draw: (ctx) ->
    ctx.beginPath()
    ctx.arc @x, @y, @radius, 0, 2 * Math.PI, false
    ctx.lineWidth = @size
    ctx.strokeStyle = '#003300'
    ctx.stroke()