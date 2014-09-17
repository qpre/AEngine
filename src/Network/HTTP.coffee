#<< Network/Network

class Network.HTTP
  @postJSON: (url, data) ->
    promise = new Promise (resolve, reject) ->
      xhr = new XMLHttpRequest()
      xhr.open 'POST', url, true
      xhr.responseType = 'json'
      xhr.onreadystatechange = () ->
        if xhr.readyState == 4
          if xhr.status == 200
            resolve && resolve(xhr.response)
          else
            reject && reject(xhr.response)
      xhr.send(data)
    
    
  @getJSON: (url) ->
    promise = new Promise (resolve, reject) ->
      xhr = new XMLHttpRequest()
      xhr.open 'GET', url, true
      xhr.responseType = 'json'
      xhr.onreadystatechange = () ->
        if xhr.readyState == 4
          if xhr.status == 200
            resolve && resolve(xhr.response)
          else
            reject && reject(xhr.response)
      xhr.send()