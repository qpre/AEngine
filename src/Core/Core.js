let AE = {};

import {log, debug, error} from './Console';
import AEObject from './Object';
import Event from './Event';
import IDFactory from './IDFactory';
import FileSystem from './FileSystem';
import Router from './Router';
import Workers from './Workers/Workers';

import Game from './Game';
import Network from '../Network/Network';
import Assets from '../Assets/Assets';


// Exposing utils
AE['log']   = log;
AE['debug'] = debug;
AE['error'] = error;

// Exposing Core
AE['IDFactory']   = IDFactory;
AE['Object']      = AEObject;
AE['Event']       = Event;
AE['FileSystem']  = FileSystem;
AE['Router']      = Router;
AE['Workers']     = Workers;

// Exposing main engines
AE['Assets']  = Assets;
AE['Game']    = Game;
AE['Network'] = Network;

window.AE = AE;
