#_require AE/Object

###
    WorkerManager : a JS Workers managing class
        each instance creates it's own Worker with the script passed as an
        argument the AEWorker class is the interface for communicating with
        the Worker
        TODO: fromFile instantiation
        TODO: worker interface
###

class AE.Workers.WorkersManager extends AE.Object
  _workers: []

  createFromScript: (script) ->
    blob = new Blob([script], { type: 'application/javascript' })
    blobURL = URL.createObjectURL blob
    worker = new Worker blobURL
    @_workers.push worker
    URL.revokeObjectURL blobURL
    worker

  #TODO: pass args
  createFromClass: (className, callbackName) ->
  	script = "worker = new " + className + "();"+ callback +"();self.onMessage = "+className+".onMessage;"

  	@createFromScript script