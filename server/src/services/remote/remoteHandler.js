const activateAlarmRemote = require("./commands/activateAlarmRemote")
const deactivateAlarmRemote = require("./commands/deactivateAlarmRemote")

exports.remoteHandler = (receiver_id, data) => {
    if (data.command === "deactivate") {
        deactivateAlarmRemote()
    }
    if (data.command === "activate") {
        activateAlarmRemote(data)
    }
}