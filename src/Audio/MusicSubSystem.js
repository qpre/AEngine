import SubSystem from './SubSystem';

export default class MusicSubSystem extends SubSystem {
  constructor () {
    super();

    this.sounds    = {};
    this.context  = null;
    this.length   = 0;
  }

  loadMap (names) {
    for (let name in names) {
      this.sounds[name] = new AE.Audio.Music(name, this);
      this.length++;
    }
  }

  fire (name) {
    if (this.sounds[name]) {
      this.sounds[name].play();
    } else {
      AE.error(`Unknow music ${name}`);
    }
  }

  prepare (onPrepared=null) {
    let remainingEffects = this.length;

    let onSoundPrepared = () => {
      remainingEffects--;

      if (remainingEffects === 0) {
        onPrepared && onPrepared();
      }
    }

    for (name of this.sounds) {
      this.sounds[name].prepare(onSoundPrepared);
    }
  }
}
