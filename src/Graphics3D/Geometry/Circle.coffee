#<< Graphics3D/Drawable
class Graphics3D.Geometry.Circle extends AE.Object
  @extend Graphics3D.Drawable

  constructor: (@_radius, @_segments=32) ->
    @geometry = new THREE.CircleGeometry @_radius, @_segments
    # Remove center vertex
    @geometry.vertices.shift()
    @material = new THREE.LineBasicMaterial { color: "cyan" }
    @mesh = new THREE.Line @geometry, @material