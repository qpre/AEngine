import Engine from './Engine';

import Effect from './Effect';
import Music from './Music';
import EffectsSubSystem from './EffectsSubSystem';
import MusicSubSystem from './MusicSubSystem';

let Audio = {
  'Engine'          : Engine,
  'Effect'          : Effect,
  'Music'           : Music,
  'EffectsSubSystem': EffectsSubSystem,
  'MusicSubSystem'  : MusicSubSystem
};

export default Audio;
