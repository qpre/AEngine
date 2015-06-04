export default class Music {

  constructor (name, system, callback) {
    this.name     = name;
    this.system   = system;
    this.callback = callback;
    this.buffer   = null;
    this.loaded   = false;
  }

  prepare (onPrepared) {
    let file;

    file = AE.Assets.Manager.get(this.name);

    AE.FileSystem.readBuffer(file, (buffer) => {
      this.system.context.decodeAudioData(buffer, function(b) {
        this.buffer = b;
        this.loaded = true;

        if (onPrepared) {
          return onPrepared();
        }
      });
    }, 'text');
  }

  play () {
    let source;

    if (this.loaded === true) {
      source        = this.system.context.createBufferSource();
      source.buffer = this.buffer;

      source.connect(this.system.gainNode);
      source.loop = true;
      source.start(0);
    } else {
      AE.error("[MUSIC] not loaded yet: " + this.name);
    }
  }
}
