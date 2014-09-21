#<< AE/Object

class Graphics3D.Scene extends AE.Object

  constructor: (@_width, @_height) ->
    @_dom = document.createElement 'canvas'

    @_scene = new THREE.Scene()
    @_camera = new THREE.PerspectiveCamera( 75, @_width / @_height, 0.1, 1000 )
    @_renderer = new THREE.WebGLRenderer()

    @resize @_width, @_height

  resize: (width, height) ->
    @_width = width
    @_height = height
    @_renderer.setSize @_width, @_height
    @_camera.aspect = @_width / @_height

  attachTo: (container) ->
    container.appendChild @_dom