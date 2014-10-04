#<< Graphics/Animate
#<< AE/Object

class Graphics3D.Scene extends AE.Object
  _drawables: []
  
  constructor: (@_width, @_height) ->
    @_scene = new THREE.Scene()
    @_camera = new THREE.PerspectiveCamera( 90, @_width / @_height, 0.1, 1000 )
    @_renderer = new THREE.WebGLRenderer({ antialiasing: true })
    @_dom = @_renderer.domElement
    @_camera.position.z = 5
    @_controls = new THREE.OrbitControls @_camera, @_dom

  resize: (width, height) ->
    @_width = width
    @_height = height
    @_dom.width = @_width
    @_dom.height = @_height
    @_renderer.setSize @_width, @_height
    @_camera.aspect = @_width / @_height
    @_camera.updateProjectionMatrix()

  attachTo: (container) ->
    container.appendChild @_dom
    @resize container.clientWidth, container.clientHeight

    if AE.Config.getInstance().get 'webgl-stats'
      @_stats = new Stats()
      @_stats.setMode 0

      # Align top-left
      @_stats.domElement.style.position = 'absolute'
      @_stats.domElement.style.right = '0px'
      @_stats.domElement.style.top = '0px'
      container.appendChild @_stats.domElement

  add: (drawable) ->
    @_scene.add drawable.mesh
    @_drawables[drawable.guid] = drawable

  remove: (guid) ->
    @_scene.remove @_drawables[guid]
    delete @_drawables[guid]

  update: () ->
    for own guid, drawable of @_drawables
      if drawable.update then drawable.update()

  start: () ->
    @render()

  stop: () ->
    if @_timer then cancelAnimationFrame @_timer
    @_timer = null

  render: () ->
    @_timer = requestAnimationFrame (() =>
      if @_stats then @_stats.begin()
      @render()
      if @_stats then @_stats.end()
      )

    @_controls.update()
    @update()

    @_renderer.render @_scene, @_camera