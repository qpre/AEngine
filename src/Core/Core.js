let AE = {};

import {log, debug, error} from './Console';
import AEObject from './Object';
import IDFactory from './IDFactory';
import Game from './Game';
import Network from '../Network/Network';


// Exposing utils
AE['log']   = log;
AE['debug'] = debug;
AE['error'] = error;

// Exposing Core
AE['IDFactory'] = IDFactory;
AE['Object']    = AEObject;

// Exposing main engines
AE['Game']    = Game;
AE['Network'] = Network;

window.AE = AE;
