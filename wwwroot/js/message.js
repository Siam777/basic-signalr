"use strict";

var connection = new signalR.HubConnectionBuilder()
    .withUrl("/messages", {
        accessTokenFactory: () => "testing"
    })
    .build();

connection.on("ReceiveMessage", function (message) {
    console.log("message: ", message);
    //var msg = msg.replace(/&/g, "&amp;")?.replace(/</g, "&lt;")?.replace(/>/g, "&gt;");
    var div = document.createElement("div");
    div.innerHTML = message + "<hr/>";
    document.getElementById("messages").appendChild(div);
});

connection.on("UserConnected", function (connectionId) {
    var groupElement = document.getElementById("group");
    var option = document.createElement("option");
    option.text = connectionId;
    option.value = connectionId;
    groupElement.add(option);
});

connection.on("UserDisconnected", function (connectionId) {
    var groupElement = document.getElementById("group");
    for (var i = 0; i < groupElement.length; i++) {
        if (groupElement.options[i].value === connectionId) {
            groupElement.remove(i);
            break;
        }
    }
});

connection.start().then(function () {
    console.log("connection started");
}).catch(function (err) {
    return console.error(err.toString());
});

document.getElementById("sendButton").addEventListener("click", function (event) {
    var message = document.getElementById("message").value;
    var groupElement = document.getElementById("group");
    console.log("group: ", group);
    var groupValue = groupElement.options[groupElement.selectedIndex].value;
    console.log("value: ", groupValue);

    if (groupValue === "All" || groupValue === "Myself") {
        var method = groupValue === "All" ? "SendMessageToAll" : "SendMessageToCaller";
        connection.invoke(method, message).catch(function (err) {
            return console.error(err.toString());
        })
    } else if (groupValue === "PrivateGroup") {
        connection.invoke("SendMessageToGroup", "PrivateGroup", message).catch(function (err) {
            return console.error(err.toString());
        })
    } else {
        connection.invoke("SendMessageToUser", groupValue, message).catch(function (err) {
            return console.error(err.toString());
        })
    }

    event.preventDefault();
})

document.getElementById("joinGroup").addEventListener("click", function (event) {
    connection.invoke("JoinGroup", "PrivateGroup").catch(function (err) {
        return console.error(err.toString());
    })
    event.preventDefault();
})