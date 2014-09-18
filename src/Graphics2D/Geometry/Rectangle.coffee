#<< Graphics2D/Drawable
class Graphics2D.Geometry.Rectangle extends Graphics2D.Drawable
  constructor: (@x, @y, @width, @height, @color) ->
    super

  draw: (ctx) ->
    ctx.fillStyle = @color
    ctx.fillRect @x, @y, @width, @height