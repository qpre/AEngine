#<< Graphics2D/ImageFillable
#<< Graphics2D/Drawable

class Graphics2D.Geometry.Rectangle extends AE.Object
  @include Graphics2D.Drawable
  constructor: (@x, @y, @width, @height, @color) ->

  draw: (ctx) ->
    ctx.fillStyle = @color
    ctx.fillRect @x, @y, @width, @height

    if @imageOpts
      @drawImage(ctx)
