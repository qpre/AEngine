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

  createWithMessagingSystem: () ->
    script = "
    self.requestFileSystemSync = \
      self.webkitRequestFileSystemSync || self.requestFileSystemSync;\n\

    self.resolveLocalFileSystemURL = \
      self.webkitResolveLocalFileSystemURL || self.resolveLocalFileSystemURL;\n\

    self.onmessage = function(e) {\n\
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
        case 'loadContext':\n\
          eval(data.msg);\n\
        case 'loadFile':\n\
          try{\n\
            self.resolveLocalFileSystemURL(data.msg, function(fileEntry) {\n\
              console.log(fileEntry.name);\n\
            });\n\
          } catch (e) {\n\
            console.error(e);\n\
          }\n\
          break;\n\
        case 'importScript':\n\
          console.log(data.msg);\n\
          importScripts(data.msg);\n\
          self;
          break;\n\
        case 'onmessage':\n\
          self.onmessage = data.msg;\n\
          break;\n\
        default:\n\
          self.postMessage('Unknown command: ' + data.msg);\n\
        };\n\
    };\n\
    "
    worker = @createFromScript(script)
    worker.onmessage = @_onWorkerMessage
    mb = new AE.MessageBox()
    core = AE.Assets.Manager.getInstance().createURLLoader AE_CORE_PATH,\
    (filepath) ->
      AE.FileSystem.getInstance().readFile filepath, (file) ->
        worker.postMessage {
          'cmd': 'loadContext',
          'msg': file
        }
    core.load()

  _onWorkerMessage: (event) ->
    console.log event.data

  sendMessageTo: (index, msg) ->
    @_workers[index].postMessage msg
