var util = require('util'), 
    EventEmitter = require('events').EventEmitter;

var TicTacToe = module.exports = function() {
    // Инициализируем события
    EventEmitter.call(this);
    // Массив id игры = объект игры
    this.games = [];
    // Массив подключённых пользователей = id игры
    this.users = [];
    // Массив пользователей ожидающих оппонентов для начало игры
    this.free = [];
}
util.inherits(TicTacToe, EventEmitter);

<<<<<<< HEAD
var GameItem = function(user, opponent) {
=======
var GameItem = function(user, opponent, stepsToWin) {
>>>>>>> 7de0621496cc205885825198a758cf60a9049b79
    // Инициализируем события
    EventEmitter.call(this);
    // Ячейки игрового поля
    this.board = [];
    // Игроки
    this.user = user; // X
    this.opponent = opponent; // O
<<<<<<< HEAD
=======
    // Шагов до победы
    this.stepsToWin = stepsToWin;
>>>>>>> 7de0621496cc205885825198a758cf60a9049b79
    // Кол-во сделанных ходов
    this.steps = 0;
    // Кто ходит
    this.turn = 'X';
}
util.inherits(GameItem, EventEmitter);

/**
 * Сделан ход
 */
GameItem.prototype.step = function(x, y, user, cb) {
<<<<<<< HEAD
    if(this.board[x + '_' + y] !== undefined || this.getTurn(user) != this.turn) return;
    this.board[x + '_' + y] = this.getTurn(user);
=======
    if(this.board[x + 'x' + y] !== undefined || this.getTurn(user) != this.turn) return;
    this.board[x + 'x' + y] = this.getTurn(user);
>>>>>>> 7de0621496cc205885825198a758cf60a9049b79
    this.turn = (user != this.user ? 'X' : 'O');
    this.steps++;
    cb(this.checkWinner(x, y, this.getTurn(user)), this.getTurn(user));
}

TicTacToe.prototype.step = function(gameId, x, y, user, cb) {
    console.info('Step');
    console.dir(this.games[gameId]);
    this.games[gameId].step(x, y, user, cb);
}

/**
 * Запускаем игру
 */
TicTacToe.prototype.start = function(user, cb) {
    // Размер игрового поля и кол-во ходов для победы
    // Ищем свободные игры
    if(Object.keys(this.free).length > 0) {
        var opponent = Object.keys(this.free).shift();
        delete this.free[opponent];
        // Если есть ожидающие игру, создаём им игру
        var game = new GameItem(user, opponent);
        var id = [
            Math.random() * 0xffff | 0
            , Math.random() * 0xffff | 0
            , Math.random() * 0xffff | 0
            , Date.now()
        ].join('-');
        // Добавляем игру в список действующих
        this.games[id] = game;
        this.users[user] = id;
        this.users[opponent] = id;
        console.dir(this.games[id]);
        game.emit('timer', 'start', user);
        cb(true, id, opponent);
    } else {
        // Пока нет, значит будем ждать
        this.free[user] = true;
        cb(false);
    }
}

/**
 * Получаем чем ходит игрок
 */
GameItem.prototype.getTurn = function(user) {
    return (user == this.user ? 'X' : 'O');
}

/**
 * Выходим из игры
 */
TicTacToe.prototype.end = function(user, cb) {
    delete this.free[user];
    if(this.users[user] === undefined) return;
    var gameId = this.users[user];
    if(this.games[gameId] === undefined) return;
    var game = this.games[gameId];
    var opponent = (user == game.user ? game.opponent : game.user);
    var turn = game.turn;
    delete this.games[gameId];
    game = null;
    delete this.users[user];
    cb(gameId, opponent, turn);
}

/**
 * Проверяем нет ли победителя
 */
GameItem.prototype.checkWinner = function(x, y, turn) {
<<<<<<< HEAD
    if(false) {
=======
    if(true) {
>>>>>>> 7de0621496cc205885825198a758cf60a9049b79
        // есть победитель
        return true;
    } else {
        // нет победителя
        return false;
    }
}

