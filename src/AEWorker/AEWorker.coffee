#_require ../AEObject/AEObject

###
    AEWorker : a JS Worker superclass
        each instance creates it's own Worker with the script passed as an
        argument the AEWorker class is the interface for communicating with
        the Worker
        TODO: fromFile instantiation
###

class AEWorker extends AEObject
  _worker: null

  init: (script) ->
    blob = new Blob([script], { type: 'application/javascript' })
    blobURL = URL.createObjectURL blob
    @_worker = new Worker blobURL
    URL.revokeObjectURL blobURL
	
   onMessage: (callback) ->
    @_worker.onmessage = callback
		
   postMessage: (message) ->
    @_worker.postMessage(message)

AEngine.AEWorker = AEWorker