#<< Graphics3D/Drawable
class Graphics3D.Geometry.Line extends AE.Object
  @extend Graphics3D.Drawable

  constructor: (@_center, @_length, @_direction) ->
    @geometry = new THREE.Geometry()

    center = new THREE.Vector3 @_center.x, @_center.y, @_center.z

    p1 = new THREE.Vector3(
      @_center.x + ((@_length / 2) * @_direction.x),
      @_center.y + ((@_length / 2) * @_direction.y),
      @_center.z + ((@_length / 2) * @_direction.z))

    p2 = new THREE.Vector3(
      @_center.x - ((@_length / 2) * @_direction.x),
      @_center.y - ((@_length / 2) * @_direction.y),
      @_center.z - ((@_length / 2) * @_direction.z))

    @geometry.vertices.push(p1)
    @geometry.vertices.push(center)
    @geometry.vertices.push(p2)
    # Remove center vertex
    @material = new THREE.LineBasicMaterial { color: "cyan" }
    @mesh = new THREE.Line @geometry, @material