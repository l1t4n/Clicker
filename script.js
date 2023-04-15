// тут как понятно я пытался переменные сделать нашего персонажа и врага,
// лучше чет в голову ничего не пришло, может через классы будет лучше )
let hero = {
    hp: 100,
    attack: 10
}

let enemy = {
    hp: 100,
    attack: 10
}



// тут должен быть звук выстрела при клике ↙
document.addEventListener('click', () => {
    const audio = new Audio();
    audio.src = "./shot.mp3";
    audio.volume = 0.02;
    audio.play()
})

