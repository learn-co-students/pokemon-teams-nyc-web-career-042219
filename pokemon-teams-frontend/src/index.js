const BASE_URL = "http://localhost:3000"
const TRAINERS_URL = `${BASE_URL}/trainers`
const POKEMONS_URL = `${BASE_URL}/pokemons`

// grab DOM elements
const main = document.querySelector('main')

function addPokemon(pokemon) {
  return `<li>
    ${ pokemon.nickname } (${ pokemon.species })
    <button class="release" data-pokemon-id="${ pokemon.id }">
      Release
    </button>
  </li>`
}

// 1. fetch for the trainers
fetch(TRAINERS_URL)
// .then((res) => console.log(res))
// same as .then(console.log)
.then((res) => res.json())
.then(function(trainersJson) {
  trainersJson.forEach(trainer => {
    main.innerHTML += `<div class="card" data-id="${ trainer.id }"><p>${ trainer.name }</p>
      <button data-action='add-pokemon' data-trainer-id="${ trainer.id }">Add Pokemon</button>
      <ul id='pokeballs-${ trainer.id }'>
        ${
          trainer.pokemons.map(pokemon => {
            return addPokemon(pokemon)
          }).join('')
        }
      </ul>
    </div>`
  })
})

main.addEventListener('click', (e) => {
  if (e.target.className === 'release') {
    const pokemonId = e.target.dataset.pokemonId

    // optimistic rendering (does not rely on server response)
    fetch(`${POKEMONS_URL}/${pokemonId}`, {
      method: 'DELETE'
    })

    e.target.parentNode.remove()
  }

  if (e.target.dataset.action === 'add-pokemon') {
    const trainerId = e.target.dataset.trainerId
    const trainerUl = document.querySelector(`#pokeballs-${ trainerId }`)

    const numPokes = trainerUl.children.length

    if (numPokes < 6) {
      // pessimistic rendering (relies on server response)
      fetch(POKEMONS_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          "trainer_id": trainerId
        })
      })
      .then(res => res.json())
      .then(pokemonJson => {
        trainerUl.innerHTML += addPokemon(pokemonJson)
      })
    }
  }
})
