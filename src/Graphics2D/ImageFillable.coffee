class Graphics2D.ImageHandler
  imageDefaults:
    x: 0
    y: 0

  constructor: (opts) ->
    opts = Object.extend @imageDefaults, opts

    {
      @path
      @x
      @y
      @width
      @height
    } = opts

    @img = new Image()
    @img.addEventListener 'load', (e) =>
      @loaded = true

    @img.src = @path

  draw: (ctx) ->
    if @loaded
      ctx.drawImage @img, @x, @y, @width, @height
