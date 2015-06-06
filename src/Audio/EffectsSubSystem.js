import SubSystem from './SubSystem';

export default class EffectsSubSystem extends SubSystem {
  constructor () {
    super();

    this.sounds    = {};
    this.context  = null;
    this.length   = 0;
  }

  loadMap (names) {
    for (let name in names) {
      this.sounds[name] = new AE.Audio.Effect(name, this);
      this.length++;
    }
  }

  fire (name) {
    if (this.sounds[name]) {
      this.sounds[name].fire();
    } else {
      AE.error(`Unknow effect ${name}`);
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
