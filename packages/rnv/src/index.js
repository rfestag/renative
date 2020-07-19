import Common, { initializeBuilder } from './core/common';
import Logger, { logComplete, logError } from './core/systemManager/logger';
import CLI from './cli';
import * as Constants from './core/constants';
import Exec from './core/systemManager/exec';
import FileUtils from './core/systemManager/fileutils';
import Doctor from './core/systemManager/doctor';
import PluginTools from './core/pluginManager';
import SetupTools from './core/setupManager';
import Config from './core/configManager/config';
import { doResolve, doResolvePath } from './core/resolve';
import Analytics from './core/systemManager/analytics';

import 'source-map-support/register';

Analytics.initialize();

const run = (cmd, subCmd, program, process) => {
    initializeBuilder(cmd, subCmd, process, program)
        .then(c => Config.initializeConfig(c))
        .then(c => CLI(c))
        .then(() => logComplete(true))
        .catch(e => logError(e, true));
};

export {
    Constants,
    Common,
    Exec,
    FileUtils,
    Doctor,
    PluginTools,
    SetupTools,
    Logger,
    run,
    CLI,
    doResolve,
    doResolvePath
};

export default { run, Config };
