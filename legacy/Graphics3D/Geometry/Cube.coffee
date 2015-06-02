#<< Graphics3D/Drawable
class Graphics3D.Geometry.Cube extends AE.Object
  @extend Graphics3D.Drawable

  constructor: () ->
    @geometry = new THREE.BoxGeometry(1,1,1)
    @material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } )
    @mesh = new THREE.Mesh(@geometry, @material)