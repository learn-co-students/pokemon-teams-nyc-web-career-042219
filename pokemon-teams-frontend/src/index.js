const BASE_URL = 'http://localhost:3000';
const TRAINERS_URL = `${BASE_URL}/trainers`;
const POKEMONS_URL = `${BASE_URL}/pokemons`;
let TRAINER_ARRAY = [];

document.addEventListener('DOMContentLoaded', () => {
    fetchTrainers();

    const mainContainer = document.querySelector('main');

    mainContainer.addEventListener('click', function(e) {
        //add pokemon
        if (e.target.className === 'add') 
            addPokemon(e);

        //release pokemon
        if (e.target.className === 'release')
            releasePokemon(e);
    })
})

function fetchTrainers() {
    fetch(TRAINERS_URL)
    .then(r => r.json())
    .then(function(json) {
        const trainerContainer = document.querySelector('main');
        json.forEach(function(trainer) {
            trainerContainer.appendChild(createTrainerCard(trainer));
            TRAINER_ARRAY.push(trainer);
        })
    })
}

function createTrainerCard(trainer) {
    const card = document.createElement('div');
    card.class = 'div';
    card.dataset.id = `${trainer.id}`;
    card.innerHTML = `
        <p>${trainer.name}</p>
        <button class='add' data-trainer-id=${trainer.id}>Add Pokemon</button>
    `;
    const list = document.createElement('ul');
    trainer.pokemons.forEach(function(pokemon) {
        list.appendChild(createPokemon(pokemon, trainer.id));
    })
    card.appendChild(list);
    return card;
}

function createPokemon(json, trainerId) {
    let item = document.createElement('li')
    item.innerHTML = `
        ${json.nickname} (${json.species})
        <button class="release" data-pokemon-id=${json.id} data-trainer-id=${trainerId}>Release</button>
    `
    return item;
}

function addPokemon(e) {
    let trainer_id = e.target.dataset.trainerId
    fetch(POKEMONS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ trainer_id })
    })
    .then(resp => resp.json())
    .then(function(json) {
        e.target.nextElementSibling.appendChild(createPokemon(json, trainer_id))
    })
}

function releasePokemon(e) {
    let trainer = findTrainer(e.target.dataset.trainerId);
    //fetch req
    fetch(POKEMONS_URL + '/' + e.target.dataset.pokemonId, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
    });

    //update array by finding index of pokemon in trainer.pokemons
    //then delete that element
    let pokeIndex = trainer.pokemons.find(function(pokemon) {
        return pokemon.id === e.target.dataset.pokemonId;
    })
    delete trainer.pokemons[pokeIndex]

    //update DOM
    e.target.parentNode.remove();
}

function findTrainer(id) {
    let index = Number(id);
    return TRAINER_ARRAY.find(function(trainer) {
        return index === trainer.id;
    })
}
