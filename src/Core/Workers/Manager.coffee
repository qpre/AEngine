#<< AE/Singleton

###
    Manager : a JS Workers managing class
        each instance creates it's own Worker with the script passed as an
        argument the AEWorker class is the interface for communicating with
        the Worker
        TODO: fromFile instantiation
        TODO: worker interface
###


###
  new logic:
    - instantiating worker
    - send message "ask for context" from worker
    - on context ready, mark worker as ready
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
    script = "self.onmessage = function(e) {\n\
      var data = e.data;\n\
      switch (data.cmd) {\n\
        case 'start':\n\
          self.postMessage('WORKER STARTED: ' + data.msg);\n\
          break;\n\
        case 'stop':\n\
          self.postMessage('WORKER STOPPED: ' + data.msg +'.\
            (buttons will no longer work)');\n\
          self.close();\n\
          break;\n\
        default:\n\
          self.postMessage('Unknown command: ' + data.msg);\n\
        };\n\
    };\n\
    "
    worker = @createFromScript(script)
    worker.onmessage = @_onWorkerMessage
    worker.postMessage {'cmd': 'start', 'msg': 'Hi'}

  _onWorkerMessage: (event) ->
    console.log event.data