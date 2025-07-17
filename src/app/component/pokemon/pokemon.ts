import { Component, effect, signal } from '@angular/core';
import { httpResource } from '@angular/common/http';
import { MatCard, MatCardModule } from '@angular/material/card';

const randomID = Math.floor(Math.random() * 151) + 1;

export const typeColors: { [key: string]: string } = {
  normal: '#A8A77A',
  fire: '#EE8130',
  water: '#6390F0',
  electric: '#F7D02C',
  grass: '#7AC74C',
  ice: '#96D9D6',
  fighting: '#C22E28',
  poison: '#A33EA1',
  ground: '#E2BF65',
  flying: '#A98FF3',
  psychic: '#F95587',
  bug: '#A6B91A',
  rock: '#B6A136',
  ghost: '#735797',
  dragon: '#6F35FC',
  dark: '#705746',
  steel: '#B7B7CE',
  fairy: '#D685AD'
};

interface PokemonData {
  id: number;
  name: string;
  types: Array<{
    slot: number;
    type: { name: string };
  }>;
  sprites: {
    other: {
      'official-artwork': {
        front_default: string;
      };
    };
  };
};


interface PokemonSpecies {
  flavor_text_entries: Array<{
    flavor_text: string;
    language: { name: string };
  }>;
  genera: Array<{
    genus: string,
    language: {
      name: string
    }
  }>
}

@Component({
  selector: 'app-pokemon',
  imports: [MatCardModule],
  templateUrl: './pokemon.html',
  styleUrl: './pokemon.css'
})

export class Pokemon {
  pokemon = httpResource<PokemonData>(() => `https://pokeapi.co/api/v2/pokemon/${randomID}`);
  pokemonSpecies = httpResource<PokemonSpecies>(() => `https://pokeapi.co/api/v2/pokemon-species/${randomID}`);

  getEnglishGenus() {
    const list = this.pokemonSpecies?.value()?.genera;

    if (!list) return null;

    for (let item of list) {
      if (item.language.name === 'en') {
        return item.genus;
      }
    }
    return null;
  }

  getDescription() {
    let descriptions: string[] = [];
    const list = this.pokemonSpecies?.value()?.flavor_text_entries;

    if (!list) return null;

    for (let item of list) {
      if (item.language.name === 'en') {
        descriptions.push(item.flavor_text);
      }
    }
    let len = descriptions.length;
    let index = Math.floor(Math.random() * len);
    return descriptions[index];
  } 

  backgroundColor = signal<string>('#999999');
  constructor() {
    effect(() => {
      const pokeType = this.pokemon.value()?.types[0].type.name;
      if (!pokeType) return;
  
      const color = typeColors[pokeType] || '#999999';
      this.backgroundColor.set(color);
    });
  }
  


  /*
  // pour afficher les console.logs
  constructor() {
    console.log('PokemonComponent loaded');
    console.log('randomID = ', randomID);
    console.log('pokemon object:', this.pokemon);
    console.log('pokemon properties:', Object.getOwnPropertyNames(this.pokemon));
    console.log('pokemon value:', this.pokemon.value());
    console.log('pokemon isLoading:', this.pokemon.isLoading());
    console.log('pokemon isError:', this.pokemon.error());
    /* effect(() => {
      const result1 = this.pokemon;
      const result2 = this.pokemonSpecies;
      if (result1?.value()) {
        console.log('pokemon =', result1.value());
      }
      if (result2?.value()) {
        console.log('pokemon =', result2.value());
      }
    }); 
  }
  */
}

