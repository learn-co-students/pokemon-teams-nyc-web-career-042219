const BASE_URL = "http://localhost:3000"
const TRAINERS_URL = `${BASE_URL}/trainers`
const POKEMONS_URL = `${BASE_URL}/pokemons`

// DOM Elements
const main = document.querySelector('#main')

// variable to give us access to trainers throughout our application
let trainers = []

// Event handlers
main.addEventListener('click', event => {
  if (event.target.dataset.trainerId) {
    const trainerId = parseInt(event.target.dataset.trainerId)
    addPokemon(trainerId)
  } else if (event.target.className === 'release') {
    const pokemonId = parseInt(event.target.dataset.pokemonId)
    deletePokemon(pokemonId)
  }
})

function deletePokemon(pokemonId) {
  fetch(`http://localhost:3000//pokemons/${pokemonId}`, {
    method: 'DELETE'
  })
    .then(r => r.json())
    .then(pokemonResponse => {
      const trainerId = pokemonResponse.trainer_id
      // find the trainer in our trainer array variable
      const foundTrainer = trainers.find(trainer => trainer.id === trainerId)
      // remove the deleted pokemon from the trainer's team
      foundTrainer.pokemons = foundTrainer.pokemons.filter(pokemon => pokemon.id !== pokemonResponse.id)
      // re-render all the trainers
      renderAllTrainers()
    })
}

function addPokemon(trainerId) {
  fetch('http://localhost:3000/pokemons', {
    method: 'POST',
    body: JSON.stringify({
      "trainer_id": trainerId
    }),
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then(res => res.json())
    .then(pokemon => {
      // find the trainer in our trainer array variable
      const foundTrainer = trainers.find(trainer => trainer.id === trainerId)
      // add the new pokemon to the trainer's team
      foundTrainer.pokemons.push(pokemon)
      // re-render all the trainers
      renderAllTrainers()
    })
}


// this will run when the page loads
fetch(TRAINERS_URL)
  .then(response => response.json())
  .then(trainersFromServer => {
    // save our trainers to variable higher in scope
    trainers = trainersFromServer
    // render them all
    renderAllTrainers()
  })

// render helpers
function createPokemonLi(pokemon) {
  return `
    <li>${pokemon.nickname} (${pokemon.species}) <button class="release" data-pokemon-id="${pokemon.id}">Release</button></li>
  `
}

function renderAllTrainers() {
  main.innerHTML = trainers.map(trainer => {
    return `<div class="card" data-id="${trainer.id}"><p>${trainer.name}</p>
      <button data-trainer-id="${trainer.id}">Add Pokemon</button>
      <ul>
        ${trainer.pokemons.map(pokemon => createPokemonLi(pokemon)).join("")}
      </ul>
    </div>`
  }).join("")
}