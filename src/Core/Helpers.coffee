Function::property = (prop, desc) ->
  Object.defineProperty @prototype, prop, desc

asyncRequestURL = (URL, onSuccess) ->
  # Setting up request for file
  request = new XMLHttpRequest()
  request.open 'GET', URL, true
  request.responseType = 'blob'

  # Setting up response handling
  request.addEventListener 'loadend', () ->
    if request.status == 200
      onSuccess request.response
    else
      AE.error 'could\'nt retrieve file: ' + URL
  
  request.send()
  request

syncRequestUrl = (URL, onSuccess) ->
  # Setting up request for file
  request = new XMLHttpRequest()
  request.open 'GET', URL, false
  request.responseType = 'blob'

  request.send()

  if request.status == 200
    onSuccess request.response
  else
    AE.error 'could\'nt retrieve file: ' + URL