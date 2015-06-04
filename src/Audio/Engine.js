import Engine from '../Core/Engine';

class AudioEngine extends Engine {

  constructor () {
    super();

    this.context        = null;
    this.effectsSystems = {};
    this.musicSystems   = {};

    AE.log('AE.Audio: start');
  }

  createEffectsSubSystem (name, effectsMap) {
    this.effectsSystems[name] = new AE.Audio.EffectsSubSystem(effectsMap);
    return this.effectsSystems[name];
  }

  createMusicSubSystem (name, musicsMap) {
    this.musicSystems[name] = new AE.Audio.MusicSubSystem(musicsMap);
    return this.musicSystems[name];
  }
}
