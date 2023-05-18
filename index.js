'use strict';

const music = new Audio('./sounds/bgmusic.mp3');
const splashScreen = document.getElementById('splash-screen');
const playButton = document.getElementById('play-button');
const gameContainer = document.querySelector('.game-container');

playButton.addEventListener('click', () => {
splashScreen.style.display = 'none';
gameContainer.style.display = 'block';
music.loop = true;
music.play();
const game = new Game();
const observer = new Observer();
observer.addObserver(game);
game.update();
});

class Observer {
    constructor() {
      this.observers = [];
    }

    subscribe(observer) {
      this.observers.push(observer);
    }

    removeObserver(observer) {
      this.observers = this.observers.filter((obs) => obs !== observer);
    }

    broadcast(data) {
      this.observers.forEach((observer) => observer.update(data));
    }
}

class Game {
    constructor(imagePath) {
      this.player = new Player('Player', 100, this, imagePath);
      this.monsterFactory = new MonsterFactory();
      this.currentMonster = null;
      this.observer = new Observer();
      this.observer.subscribe(this.player);
      this.playerWins = 0;
      this.loadPlayerWins();
      this.init();
      this.currentLocation = 'location1';
    }

    init() {
      this.showLocation('location1');
      this.playerWinsElement = document.getElementById('player-wins');
      this.loadPlayerWins();
      this.updatePlayerWins();
      this.player.update();
    }

    showLocation(location) {
        const locationElements = document.querySelectorAll('.game-container > div:not(.player-container):not(#player-wins)');
        for (let i = 0; i < locationElements.length; i++) {
        locationElements[i].style.display = 'none';
        }
    
        if (location === 'location1' || location === 'location2' || location === 'location3') {
        document.querySelector(`.${location}`).style.display = 'block';
        const monsterContainer = document.querySelector(`.${location} .monster-container`);
        if (monsterContainer) {
        if (this.currentMonster === null || this.currentMonster.isDead)
        {        
        const monster = this.monsterFactory.createMonster(location);
        if (monster) {
        let monsterImage = document.createElement('img');
        monsterImage.classList.add('monster-image');
        monsterImage.src = monster.image;
        let healthBar = document.createElement('div');
        healthBar.classList.add('health-bar');
        let healthBarValue = document.createElement('div');
        healthBarValue.classList.add('health-bar-value');
        healthBarValue.style.width = '100%';
        healthBar.appendChild(healthBarValue);
        monsterContainer.appendChild(monsterImage);
        monsterContainer.appendChild(healthBar);
    
        monsterImage.addEventListener('click', () => {
        if (this.currentMonster && !this.currentMonster.isDead) {
            this.player.attackMonster(this.currentMonster);
            const monsterAttackSound = new Audio('./sounds/attack.mp3');
            monsterAttackSound.play();
            }
        });
    
            this.currentMonster = monster;
            this.currentMonster.startAttackTimer(this.player);
        }
        }else {
            this.currentMonster.startAttackTimer(this.player);
        }
        }
            this.currentLocation = location;
        }
        }

    savePlayerWins() {
        localStorage.setItem('playerWins', this.playerWins.toString());
    }

    loadPlayerWins() {
        const playerWins = localStorage.getItem('playerWins');
        if (playerWins) {
        this.playerWins = parseInt(playerWins);
        } 
    }

    updatePlayerWins() {
        if (this.playerWinsElement) {
          this.playerWinsElement.textContent = `Player Wins: ${this.playerWins}`;
        }
    }

    killMonster() {
        if (this.currentMonster) {
        this.currentMonster.stopAttackTimer();
        this.currentMonster.isDead = true;
  
        const monsterContainer = document.querySelector(`.${this.currentLocation} .monster-container`);
        if (monsterContainer) {
        const monsterImage = monsterContainer.querySelector('.monster-image');
        const healthBar = monsterContainer.querySelector('.health-bar');
  
        if (monsterImage) {
          monsterImage.remove();
        }
  
        if (healthBar) {
          healthBar.remove();
        }
        }
        this.player.heal(20);
        this.player.update();
        this.observer.broadcast();
        this.currentMonster = null;
        this.playerWins++;
        this.savePlayerWins();
        this.updatePlayerWins();
        const locations = ['location1','location2', 'location3'];
        const nextLocationIndex = locations.indexOf(this.currentLocation) + 1;
        if (nextLocationIndex >= locations.length) {
        this.gameOver();
        } else {
        const nextLocation = locations[nextLocationIndex];
        this.showLocation(nextLocation);
        }
        }
    }
            
    gameOver() {
      const gameOverElement = document.getElementById('game-over');
      gameOverElement.style.display = 'block';
      gameOverElement.textContent = 'Player wins';
      const splashScreen = document.getElementById('splash-screen');
      const h1 = document.querySelector('h1');
      splashScreen.style.backgroundImage = 'url("./img/gameoverbg.jpg")';
      h1.textContent = 'That is all';
      const playButton = document.getElementById('play-button');
      if (playButton) {
        playButton.remove();
      }
    
    setTimeout(() => {
        const playerContainer = document.querySelector('.player-container');
        if (playerContainer) {
          playerContainer.remove();
        }
        const monsterContainers = document.querySelectorAll('.monster-container');
        for (let i = 0; i < monsterContainers.length; i++) {
          monsterContainers[i].remove();
        }
        gameOverElement.remove();
        music.pause();
    
        gameContainer.style.display = 'none';
        splashScreen.style.display = 'flex';
        }, 2000);
    }
    
    update() {
        if (this.player.isDead) {
        music.pause();
        const gameOverElement = document.getElementById('game-over');
        gameOverElement.style.display = 'block';
        return;
        }
    
        if (!this.currentMonster || this.currentMonster.isDead) {
        this.player.heal(10);
        this.player.update();
        }
        if (this.currentMonster) {
        this.currentMonster.update();
        } 
    }
}
  
class Player {
    constructor(name, health, game) {
    this.name = name;
    this.health = health;
    this.maxHealth = health;
    this.game = game;
    this.imagePath = "./img/player.png";
    this.isDead = false;
    this.init();
    }
  
    init() {
    const playerImage = document.createElement('img');
    playerImage.src = this.imagePath;
    playerImage.classList.add('player-image');
    document.querySelector('.player-container').appendChild(playerImage);
  
    const healthBar = document.createElement('div');
    healthBar.classList.add('health-bar');
    document.querySelector('.player-container').appendChild(healthBar);
  
    const healthBarValue = document.createElement('div');
    healthBarValue.classList.add('health-bar-value');
    healthBar.appendChild(healthBarValue);
  
    this.update();
    }
  
    attackMonster(monster) {
    monster.stopAttackTimer();
    monster.health -= 10;
    monster.update();
        if (monster.health <= 0) {
        this.game.killMonster();
        } else {
     monster.startAttackTimer(this);
        }
    const playerImage = document.querySelector('.player-image');
    playerImage.classList.add('player-attack');
    playerImage.addEventListener('animationend', () => {
    playerImage.classList.remove('player-attack');
        });
    }

    takeDamage(damage) {
    const handleKeyDown = (event) => {
      if (event.code === 'Space') {
        this.isSpacebarPressed = true;
        }
        };
  
    const handleKeyUp = (event) => {
      if (event.code === 'Space') {
        this.isSpacebarPressed = false;
        }
        };
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
  
        if (!this.isSpacebarPressed) {
        this.health -= damage;
        if (this.health <= 0) {
        this.isDead = true;
        this.health = 0;
        }
        }
  
    this.update();
    }
  
    heal(amount) {
    this.health += amount;
    if (this.health > this.maxHealth) {
    this.health = this.maxHealth;
        }
    }

    update() {
    const healthBarValue = document.querySelector('.player-container .health-bar .health-bar-value');
    healthBarValue.style.width = `${(this.health / this.maxHealth) * 100}%`;
        if (this.health === 0) {
        this.isDead = true;
        this.game.update();
            }
        }
}
  
class MonsterFactory {
    constructor() {
      this.monsters = {
        location1: [ new Monster('Monster1', 100, 100, 20, 'location1', "./img/monster1.png"),],
        location2: [ new Monster("Monster2", 150, 150, 25, 'location2', "./img/monster2.png"),],
        location3: [ new Monster('Monster3', 200, 200, 30, 'location3', "./img/monster3.png"),],
      };
    }
  
    createMonster(location) {
      const monstersInLocation = this.monsters[location];
      if (monstersInLocation && monstersInLocation.length > 0) {
        return monstersInLocation[0];
        }
      return null;
    }
}

class Monster {
    constructor(name, health, maxHealth, attackDamage, location, image) {
    this.name = name;
    this.health = health;
    this.maxHealth = maxHealth;
    this.attackDamage = attackDamage;
    this.location = location;
    this.image = image;
    this.isDead = false;
    this.attackTimerId = null;
    }
    
    startAttackTimer(player) {
    this.attackIntervalId = setInterval(() => {
        if (player.health <= 0) {
        clearInterval(this.attackIntervalId);
        return;
        }
      
    player.takeDamage(this.attackDamage);
    const audio = new Audio('./sounds/damage.mp3');
    audio.play();
        }, 2000);
    }
  
    stopAttackTimer() {
    clearInterval(this.attackIntervalId);
    }
      
    update() {
    const healthBarValue = document.querySelector(`.${this.location} .monster-image + .health-bar .health-bar-value`);
    const healthPercent = Math.floor((this.health / this.maxHealth) * 100);
    healthBarValue.style.width = `${healthPercent}%`;
  
        if (this.health <= 0) {
        this.isDead = true;
        }
    }
}
  