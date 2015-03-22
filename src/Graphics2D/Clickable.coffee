#<< AE/Object
#<< AE/Event

Graphics2D.Clickable =
  intersects: (x, y) ->
    false

  onClick: () ->
    console.log "Baby touch me one more time"
