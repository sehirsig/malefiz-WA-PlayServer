$(document).ready(function () {
        randomUserId()
        connect()
    }
)

let timestamp = "0"

let userID = "";

function randomUserId() {
    userID = Math.floor(Math.random() * 100000).toString();
    userID = "User-" + userID
    $('#userId').get(0).innerText = "Your ID: " + userID
}

function connect() {
    $.ajax({
        type : 'POST',
        url : '/getChat',
        dataType : 'json',
        data : JSON.stringify({'timestamp' : timestamp}),
        contentType: "application/json",
        success : function(response) {
            timestamp = response.timestamp;
            $('#chat-area').append('<p class="dark-bg">' + response.msg + '</p>');
            noerror = true;
        },
        complete : function(response) {
            // send a new ajax request when this request is finished
            if (!self.noerror) {
                // if a connection problem occu0rs, try to reconnect each 5 seconds
                setTimeout(function(){ connect(); }, 500);
            }else {
                // persistent connection
                connect();
            }
            noerror = false;
        }
    });
}


function sendMessage() {
    let message = userID + ": " + $('#send-message-box').get(0).value

    $.ajax({
        type : 'POST',
        url : '/sendChat',
        dataType : 'json',
        data : JSON.stringify({'msg' : message}) ,
        contentType: "application/json",
        success : function(response) {
            timestamp = response.timestamp;
        }
    });

    $('#send-message-box').get(0).value = ""
}