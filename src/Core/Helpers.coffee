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
      console.error 'could\'nt retrieve file: ' + URL
  
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
    console.error 'could\'nt retrieve file: ' + URL

# cacheData = (storageName, data) ->
#   try
#     localStorage.setItem storageName, data
#   catch e
#     console.error 'localStorage: ' + e

# getBlobDataFromServer = (fileURL, onSuccess) ->
#   # Setting up request for file
#   request = new XMLHttpRequest()
#   request.open 'GET', fileURL, true
#   request.responseType = 'blob'

#   # Setting up response handling
#   request.addEventListener 'loadend', () ->
#     if request.status == 200
#       onSuccess request.response
#     else
#       console.error 'could\'nt retrieve file: ' + fileURL
  
#   request.send()
#   request

# getFileDataFromServer = (fileURL, onSuccess) ->
#   # Setting up request for file
#   request = new XMLHttpRequest()
#   request.open 'GET', fileURL, true
#   request.responseType = 'blob'

#   # Setting up response handling
#   request.addEventListener 'loadend', () ->
#     if request.status == 200
#       fileReader = new FileReader()
#       fileReader.onloadend = (e) ->
#         if e.target.error
#           console.error e.target.error
#         onSuccess e.target.result
#       fileReader.readAsDataURL request.response
#     else
#       console.error 'could\'nt retrieve file: ' + fileURL

#    request.send()
#    request


# cacheDataFromServer = (storageName, fileURL) ->
#   getBlobDataFromServer fileURL, (blob) ->
#     cacheData storageName, JSON.stringify blob
#     loadCacheAsFile 'AE_CORE', (file) ->
#       eval file

# loadCacheAsFile = (storageName) ->
#   file = localStorage.getItem storageName
#   file


# clearCache = () ->
#   for key in localStorage
#     localStorage.removeItem key

# FILE_PATHS = []

# getAllEntries = (dirReader) ->
#   entries = dirReader.readEntries()

#   for entry in entries[i]
#     paths.push entry.toURL()

#     if entry.isDirectory
#       getAllEntries entry.createReader()

# sendFilePaths = (worker) ->
#   try
#     fs = requestFileSystemSync TEMPORARY, 1024*1024
#     getAllEntries fs.root.createReader()
#     worker.postMessage {entries: FILE_PATHS}
#   catch e
#     console.error e