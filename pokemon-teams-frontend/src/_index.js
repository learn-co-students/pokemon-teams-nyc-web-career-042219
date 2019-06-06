const BASE_URL = "http://localhost:3000"
const TRAINERS_URL = `${BASE_URL}/trainers`
const POKEMONS_URL = `${BASE_URL}/pokemons`

{/* <div class="card" data-id="1"><p>Prince</p>
  <button data-trainer-id="1">Add Pokemon</button>
  <ul>
    <li>Jacey (Kakuna) <button class="release" data-pokemon-id="140">Release</button></li>
    <li>Zachariah (Ditto) <button class="release" data-pokemon-id="141">Release</button></li>
    <li>Mittie (Farfetch'd) <button class="release" data-pokemon-id="149">Release</button></li>
    <li>Rosetta (Eevee) <button class="release" data-pokemon-id="150">Release</button></li>
    <li>Rod (Beedrill) <button class="release" data-pokemon-id="151">Release</button></li>
  </ul>
</div> */}

// where we want the card to be placed
const main = document.querySelector('#main')

function createPokemonLi(pokemon) {
  // "<li>" + pokemon.nickname + "(" + 
  return `
    <li>${pokemon.nickname} (${pokemon.species}) <button class="release" data-pokemon-id="${pokemon.id}">Release</button></li>
  `
}

// create the elements to be appended to the DOM
function createTrainerCard(trainer) {
  // add info to the card
  const cardDiv = document.createElement('div')
  cardDiv.className = 'card'
  cardDiv.dataset.id = trainer.id

  const pokemonLis = trainer.pokemons.map(pokemon => {
    return createPokemonLi(pokemon)
  }).join("")

  cardDiv.innerHTML = `
    <p>${trainer.name}</p>
    <button data-trainer-id="${trainer.id}">Add Pokemon</button>
    <ul>
      ${pokemonLis}
    </ul>
  `
  cardDiv.addEventListener('click', (event) => {
    if (event.target.dataset.trainerId) {
      // function to add a pokemon
      const trainerId = event.target.dataset.trainerId
      const pokemonContainer = cardDiv.querySelector('ul')
      addPokemon(trainerId).then(liString => {
        pokemonContainer.innerHTML += liString
      })
    } else if (event.target.className === 'release') {
      const pokemonId = event.target.dataset.pokemonId
      deletePokemon(pokemonId)
      event.target.parentNode.remove()
    }
  })

  main.appendChild(cardDiv)
}

function deletePokemon(pokemonId) {
  return fetch(`http://localhost:3000//pokemons/${pokemonId}`, {
    method: 'DELETE'
  })
    .then(res => res.json())
    .then(pokemon => {
      // remove the li

    })
}

function addPokemon(trainerId) {
  return fetch('http://localhost:3000/pokemons', {
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
      return createPokemonLi(pokemon)
    })
}

// fetch using trainers url
function grabTrainers() {
  fetch(TRAINERS_URL)
    // parse the response data
    .then(response => response.json())
    .then(trainers => {
      // make trainer cards based on the parsed data
      // iterate throught the trainer array
      for (let i = 0; i < trainers.length; i++) {
        // display the card for the trainer (createTrainerCard)
        createTrainerCard(trainers[i])
        // append it the DOM
      }
    })
}

grabTrainers()

