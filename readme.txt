﻿- Использование сохранений:
	Для сохранения и загрузки количества побед игрока.Происходит в классе Game.
savePlayerWins(): Метод сохраняет количество побед игрока в локальном хранилище браузера с помощью localStorage.setItem().
loadPlayerWins(): Метод загружает количество побед игрока из локального хранилища браузера с помощью localStorage.getItem().
updatePlayerWins(): Метод обновляет содержимое элемента DOM player-wins с отображением количества побед игрока.


- Механики:
	Механика 1: Механика attackMonster отвечает за атаку монстра игроком в игре. Метод attackMonster принимает в качестве аргумента объект monster,
представляющий монстра, которого игрок атакует. Внутри метода attackMonster происходят следующие действия:
Останавливается таймер атаки текущего монстра с помощью вызова метода stopAttackTimer().
Здоровье монстра уменьшается на заданное значение атаки, это реализовано строкой monster.health -= 10;, где 10 - значение урона, наносимого монстру при атаке.
Обновляется состояние монстра вызовом метода monster.update(). Этот метод обновляет отображение здоровья монстра на странице, а также проверяет, умер ли монстр
в результате атаки игрока. Если здоровье монстра становится меньше или равно нулю, вызывается метод killMonster() объекта game. Метод killMonster()
выполняет необходимые действия по уничтожению монстра, останавливает его таймер атаки, удаляет его изображение и полосу здоровья, а также награждает игрока очками
победы. Атака игрока на монстра анимируется. При этом добавляется класс "player-attack" к изображению игрока. Класс "player-attack"
содержит анимацию, которая воспроизводится, чтобы указать на атаку игрока. Когда анимация завершается, класс "player-attack" удаляется из изображения игрока.
	Механика 2: Механика "heal" отвечает за излечение игрока в игре. Метод heal(amount), принимает аргумент amount - количество здоровья,
на которое игрок будет излечен. Когда вызывается метод heal, здоровье игрока увеличивается на указанную величину. Если текущее здоровье превышает максимальное
здоровье игрока, то оно ограничивается максимальным значением и устанавливается равным ему. Данная механика позволяет игроку восстанавливать здоровье и 
повышает его шансы на продолжения игры и ,в целом, на победу.


- Задействованные клавиши и действия:
	Клавиша "Space": Если клавиша "Space" не нажата игрок получает урон,происходит в методе takeDamage(damage).
Когда клавиша "Space" нажата, урон игроку не наносится.
	Левая кнопка мыши "click": Атака игрока на монстра при щелчке на изображении монстра (monsterImage.addEventListener('click', ...)).
При нажатии игрок атакует текущего монстра с помощью this.player.attackMonster(this.currentMonster), проигрывается звук атаки монстра.




