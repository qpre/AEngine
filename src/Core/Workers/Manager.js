/*
    Manager : a JS Workers managing class
        each instance creates it's own Worker with the script passed as an
        argument the AEWorker class is the interface for communicating with
        the Worker
        TODO: fromFile instantiation
        TODO: worker interface
 */

/*
  new logic:
    - instantiating worker
    - send message "ask for context" from worker
    - on context ready, mark worker as ready
 */
class Manager {

  constructor () {
    this._workers = [];
    this._libBlob = null;
  }

  createFromScript (script) {
    var blob, blobURL, worker;
    blob = new Blob([script], {
      type: 'application/javascript'
    });
    blobURL = URL.createObjectURL(blob);
    worker = new Worker(blobURL);
    this._workers.push(worker);
    URL.revokeObjectURL(blobURL);
    return worker;
  }

  createWithMessagingSystem () {
    var core, mb, script, worker;
    script = "self.requestFileSystemSync = self.webkitRequestFileSystemSync || self.requestFileSystemSync;\nself.resolveLocalFileSystemURL = self.webkitResolveLocalFileSystemURL || self.resolveLocalFileSystemURL;\nself.onmessage (e) {\nvar data = e.data;\nswitch (data.cmd) {\ncase 'start':\nself.postMessage('WORKER STARTED: ' + data.msg);\nbreak;\ncase 'stop':\nself.postMessage('WORKER STOPPED: ' + data.msg +'.(buttons will no longer work)');\nself.close();\nbreak;\ncase 'loadContext':\neval(data.msg);\ncase 'loadFile':\ntry{\nself.resolveLocalFileSystemURL(data.msg, function(fileEntry) {\nconsole.log(fileEntry.name);\n});\n} catch (e) {\nconsole.error(e);\n}\nbreak;\ncase 'importScript':\nconsole.log(data.msg);\nimportScripts(data.msg);\nself; break;\ncase 'onmessage':\nself.onmessage = data.msg;\nbreak;\ndefault:\nself.postMessage('Unknown command: ' + data.msg);\n};\n};\n";
    worker = this.createFromScript(script);
    worker.onmessage = this._onWorkerMessage;
    mb = new AE.MessageBox();
    core = AE.Assets.Manager.createURLLoader(AE_CORE_PATH, (filepath) => {
      return AE.FileSystem.readFile(filepath, (file) => {
        return worker.postMessage({
          'cmd': 'loadContext',
          'msg': file
        });
      });
    });
    return core.load();
  }

  _onWorkerMessage (event) {
    return console.log(event.data);
  }

  sendMessageTo (index, msg) {
    return this._workers[index].postMessage(msg);
  }

}
