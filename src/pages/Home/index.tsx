import { Coffee, Package, ShoppingCart, Timer } from '@phosphor-icons/react'
import { useTheme } from 'styled-components'

import { CoffeeCard } from '../../components/CoffeeCard'

import { CoffeeList, Heading, Hero, HeroContent, Info, Navbar } from './styles'
import { useEffect, useState } from 'react';
import { Radio } from '../../components/Form/Radio';
import { api } from '../../serves/api';

interface Coffee {
  id: string;
  title: string;
  description: string;
  tags: string[];
  price: number;
  image: string;
  quantity: number;
  favorite: boolean;
};


interface Categoria {
  value:string;
  isSelected : boolean;
};

export function Home() {
  const theme = useTheme();
  const [coffees, setCoffees] = useState<Coffee[]>([]);
  const [categoria, setCategoria] = useState<Categoria>({value:"",isSelected: false});


 //Usando o metodo GET com AXIOS
  useEffect(() => {
    api.get<Coffee[]>('/coffees')
    .then(function (response) {
      const sortedCoffees = response.data.sort((a, b) =>
        a.title.localeCompare(b.title, 'pt', { sensitivity: 'base' })
      )
      setCoffees(sortedCoffees)
    });
  },[]);

  //   const fetchApi = async () => {
  //     try {
  //       const response = await api.get<Coffee[]>('/coffees')
  //       const sortedCoffees = response.data.sort((a, b) =>
  //         a.title.localeCompare(b.title, 'pt', { sensitivity: 'base' })
  //       )
  //       setCoffees(sortedCoffees)
  //     } catch (error) {
  //       console.log('Deu ruim...', error)
  //     }
  //   }
  //   fetchApi();
  // }, []);


  
  function incrementQuantity(id: string) {
    setCoffees((prevState) =>
      prevState.map((coffee) => {
        if (coffee.id === id) {
          return {
            ...coffee,
            quantity: coffee.quantity + 1,
          }
        }
        return coffee
      }
      ),
    );
  }



  function decrementQuantity(id: string) {
    setCoffees((prevState) =>
      prevState.map((coffee) => {
        if (coffee.id === id && coffee.quantity > 0) {
          return {
            ...coffee,
            quantity: coffee.quantity - 1,
          }
        }
        return coffee
      }),
    );
  }

  function mudarCategoria(valor : string){
    if (categoria.value === valor){
      return setCategoria((prevState) =>  ({value: valor, isSelected: !prevState.isSelected}))

    }
    setCategoria({ value: valor, isSelected: true})
  }

  function handleFavoriteCoffee(id: string) {
    setCoffees((prevState) =>
      prevState.map((coffee) => {
        if (coffee.id === id) {
          return {
            ...coffee,
            favorite: !coffee.favorite,
          }
        }
        return coffee
      }),
    )
  }

  return (
    <div>
      <Hero>
        <HeroContent>
          <div>
            <Heading>
              <h1>Encontre o café perfeito para qualquer hora do dia</h1>

              <span>
                Com o Coffee Delivery você recebe seu café onde estiver, a
                qualquer hora
              </span>
            </Heading>

            <Info>
              <div>
                <ShoppingCart
                  size={32}
                  weight="fill"
                  color={theme.colors.background}
                  style={{ backgroundColor: theme.colors['yellow-dark'] }}
                />
                <span>Compra simples e segura</span>
              </div>

              <div>
                <Package
                  size={32}
                  weight="fill"
                  color={theme.colors.background}
                  style={{ backgroundColor: theme.colors['base-text'] }}
                />
                <span>Embalagem mantém o café intacto</span>
              </div>

              <div>
                <Timer
                  size={32}
                  weight="fill"
                  color={theme.colors.background}
                  style={{ backgroundColor: theme.colors.yellow }}
                />
                <span>Entrega rápida e rastreada</span>
              </div>

              <div>
                <Coffee
                  size={32}
                  weight="fill"
                  color={theme.colors.background}
                  style={{ backgroundColor: theme.colors.purple }}
                />
                <span>O café chega fresquinho até você</span>
              </div>
            </Info>
          </div>

          <img src="/images/hero.svg" alt="Café do Coffee Delivery" />
        </HeroContent>

        <img src="/images/hero-bg.svg" id="hero-bg" alt="" />
      </Hero>

      <CoffeeList>

        <h2>Nossos cafés</h2>
        <Navbar>
          <Radio
            onClick={() => {mudarCategoria("tradicional")}}
            isSelected={categoria.value === "tradicional" && categoria.isSelected === true}
            value="tradicional"
          >
            <span>Tradicional</span>
          </Radio>
          <Radio
            onClick={() => {mudarCategoria("gelado")}}
            isSelected={categoria.value === "gelado" && categoria.isSelected === true}
            value="gelado"
          >
            <span>Gelado</span>
          </Radio>
          <Radio
            onClick={() => {mudarCategoria("com leite")}}
            isSelected={categoria.value === "com leite" && categoria.isSelected === true}
            value="com leite"
          >
            <span>Com leite</span>
          </Radio>
        </Navbar>


        <div>
          
          {categoria.isSelected ?
            coffees.filter((coffee) => coffee.tags.includes(categoria.value))
            .map((coffee) =>(
              <CoffeeCard
                key={coffee.id}
                coffee={coffee}
                incrementQuantity={incrementQuantity}
                decrementQuantity={decrementQuantity}
                handleFavoriteCoffee={handleFavoriteCoffee}
              />
              ))
          :coffees.map((coffee) =>(
            <CoffeeCard
              key={coffee.id}
              coffee={coffee}
              incrementQuantity={incrementQuantity}
              decrementQuantity={decrementQuantity}
              handleFavoriteCoffee={handleFavoriteCoffee}
            />
            ))}
        </div>
      </CoffeeList>
    </div>
  )
}
