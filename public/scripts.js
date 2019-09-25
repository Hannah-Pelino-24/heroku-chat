$(document).ready(function () {
    var username;
    var socket = io();

    $('.ui.mini.modal')
        .modal('setting', 'closable', false)
        .modal('show');

    $('#nickname').keydown(function () {
        $("#error").remove();
        $('#for-nickname').removeClass("error")
    })

    $('#nickname').change(function () {
        $('#for-nickname').removeClass("error")
        username = $('#nickname').val();
        if (username == "") {
            username = "anonymous"
        }
        socket.emit('set-online', { username: username })
        socket.on('register', function (res) {
            if (res == "true") {
                $('.btn-user').removeClass("disabled")

            } else {
                $('#for-nickname').addClass("error")
                $(".err-msg").append('<div class="ui pointing below red basic label error-msg" id="error"> Username already taken!</div>')
            }
        })
    })

    $('#message').keypress(function () {
        socket.emit('typing', username)
    })

    socket.on('typing', function (user) {
        $('#messages').find('#typing').remove();
        if (username != user) {
            $('#messages').append('<i><p id="typing" class="' + user + '">' + user + ' is typing..</p></i>');
        }
        setInterval(function () {
            $('#messages').find('#typing').remove();
        }, 1500);
    })

    $('.btn-user').click(function () {
        socket.emit("save", username)
    })

    $('.btnSend').click(function () {
        socket.emit('chat message', { username: username, message: $('#message').val() });
        $('#messages').append($('<div>', {
            class: "ui compact right pointing green basic big label mes"
        }).css({
            padding: '10px',
            marginTop: '10px',
            float: 'right'
        }).text("Me : " + $('#message').val()))

        $("#messages").append('<br><br><br><br>')
        $('#message').val('');
    });

    socket.on('chatx', function (msg) {
        $('#messages').find('#typing').remove();
        if (msg.username != username) {
            $('#messages').append($('<div>', {
                class: "ui left pointing blue basic big label mes"
            }).css({
                padding: '10px',
                marginTop: '10px'
            }).text(msg.username + " : " + msg.message), "<br>");
        }
    });

    socket.on('onlineUsers', function (msg) {
        $('.onlineUser').empty();
        msg.forEach(user => {
            $('.onlineUser').append(
                $('<p>', {
                    class: " item"
                }).append("<i class = 'green user icon'></i>", $("<span>").text(user))
            );
        });
    })
});