import AEObject from '../Core/Object';

export default class SubSystem extends AEObject {
  constructor (names) {
    super();
    try {
      window.AudioContext = window.AudioContext || window.webkitAudioContext;

      this.context  = new AudioContext();
      this.gainNode = this.context.createGain();
      this.gainNode.connect(this.context.destination);
    } catch (err) {
      AE.error(e);
      AE.error('AE.Audio : Web Audio API not supported');
    }

    this.loadMap(names);
  }

  setVolume (value) {
    this.gainNode.gain.value = value / 100;
  }
}
