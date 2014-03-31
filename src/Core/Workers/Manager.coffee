#<< AE/Singleton

###
    Manager : a JS Workers managing class
        each instance creates it's own Worker with the script passed as an
        argument the AEWorker class is the interface for communicating with
        the Worker
        TODO: fromFile instantiation
        TODO: worker interface
###

class AE.Workers.Manager extends AE.Singleton
  _workers: []
  _libBlob: null

  createFromScript: (script) ->
    blob = new Blob([script], { type: 'application/javascript' })
    blobURL = URL.createObjectURL blob
    worker = new Worker blobURL
    @_workers.push worker
    URL.revokeObjectURL blobURL
    worker

  #TODO: pass args
  createFromClass: (className) ->
  	context = JSON.stringify AE # It's so dirty I just can't look at it anymore

  	script = "AE = eval(\"(#{encodeURIComponent(context)})\");\n
  			worker = new #{className}();\n
  			self.onMessage = #{className}.onMessage;"

  	@createFromScript script