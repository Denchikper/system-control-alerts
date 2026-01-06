const logger = require("../../utils/logger");
const activateAlarmRemote = require("./commands/activateAlarmRemote");
const deactivateAlarmRemote = require("./commands/deactivateAlarmRemote");

let remoteCommandLock = false;

exports.remoteHandler = (receiver_id, data) => {
  if (remoteCommandLock) {
    logger.remote_warn("Remote-команда уже обрабатывается");
    return;
  }

  remoteCommandLock = true;

  try {
    if (data.command === "deactivate") {
      deactivateAlarmRemote();
    }

    if (data.command === "activate") {
      activateAlarmRemote(data);
    }

  } finally {
    setTimeout(() => {
      remoteCommandLock = false;
    }, 700);
  }
};