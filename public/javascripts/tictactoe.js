var TicTacToe = {
    gameId: null,
    turn: null,
    i: false,
    interval: null,
    init: function() {
        $(function() {
            // Подключаемся к серверу nodejs с socket.io
            var socket = io.connect(window.location.hostname + ':3000');
            $('#reload').hide().button({
                icons: {
                    primary: 'ui-icon-refresh'
                }
            }).click(function() {
                $('#reload').off('click').click(function() {
                    window.location.reload();
                });
                socket.emit('start');
            });
            socket.on('connect', function() {
                $('#status').html('Успешно подключились к игровому серверу');
                $('#reload').show();
                board.init(function(e) {
                    console.log(e);
                    var x;
                    var y;
                    if (e.pageX != undefined && e.pageY != undefined) {
                        x = Math.floor(e.pageX / board.cellSize);
                        y = Math.floor(e.pageY / board.cellSize);
                        console.log("User clicked on: " + x + ", " + y);
                        console.log(TicTacToe.i);
                        if (TicTacToe.i) {
                            socket.emit('step', TicTacToe.gameId, x + "_" + y);
                        }
                    }
                });
            });
            socket.on('reconnect', function() {
                $('#reload').show();
                $('#connect-status').html('Переподключились, продолжайте игру');
            });
            socket.on('reconnecting', function() {
                $('#reload').hide();
                $('#status').html('Соединение с сервером потеряно, переподключаемся...');
            });
            socket.on('error', function(e) {
                $('#status').html('Ошибка: ' + (e ? e : 'неизвестная ошибка'));
            });
            // Ожидаем соперника
            socket.on('wait', function() {
                $('#status').append('... Ожидаем соперника...');
            });
            // Соперник отлючился
            socket.on('exit', function() {
                TicTacToe.endGame(TicTacToe.turn, 'exit');
            });
            // К нам подключился соперник, начинаем игру
            socket.on('ready', function(gameId, turn, x, y) {
                $('#status').html('К вам подключился соперник! Игра началась! ' + (turn == 'X' ? 'Сейчас Ваш первый ход' : 'Сейчас ходит соперник') + '!');
                TicTacToe.startGame(gameId, turn);
            });
            // Получаем ход
            socket.on('step', function(id, turn, win) {
                console.info('step', id, turn, win);
                TicTacToe.move(id, turn, win);
            });
            // Статистика
            socket.on('stats', function(arr) {
                console.log(arr);
            });
        });
    },

    startGame: function(gameId, turn, x, y) {
        this.gameId = gameId;
        this.turn = turn;
        this.i = (turn == 'X');
        //initial UI
        this.mask(!this.i);
    },

    mask: function(state) {
        console.log(state);
    },

    move: function(id, turn, win) {
        this.i = (turn != this.turn);
        $("#" + id).attr('class', 'ui-state-hover').html(turn);
        if (!win) {
            this.mask(!this.i);
            $('#status').html('Сейчас ' + (this.i ? 'ваш ход' : 'ходит соперник'));
        } else {
            this.endGame(turn, win);
        }
    },

    endGame: function(turn, win) {
        clearInterval(this.interval);
        var text = '';
        switch (win) {
            case 'none':
                text = 'Ничья!';
                break;
            case 'exit':
                text = 'Соперник сбежал с поля боя! Игра закончена';
                break;
            default:
                text = 'Вы ' + (this.i ? 'проиграли! =(' : 'выиграли! =)');
        }
        $("<div/>").html(text).dialog({
            title: 'Конец игры',
            modal: true,
            closeOnEscape: false,
            resizable: false,
            buttons: {
                "Играть снова": function() {
                    $(this).dialog("close");
                    window.location.reload();
                }
            },
            close: function() {
                window.location.reload();
            }
        });
    }
};