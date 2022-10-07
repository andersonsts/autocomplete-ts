const DATA = [
  'Ander',
  'Andre',
  'Armenio',
  'Angelo',
  'Angela',
  'Mauricio',
  'Pedro',
  'Sousa',
  'Marcos',
  'Maria',
  'Julia',
  'Santos',
  'Natalia',
  'Jeferson',
  'Jonatan',
  'Paulo',
  'Paulinho',
  'John',
  'Doe',
  'Vitoria',
  'Yasmin',
  'Guimaraes',
  'Jorge',
  'Julio',
  'Maite',
  'Murilo',
  'Janaina',
  'Natasha',
  'Nate',
  'Carol',
  'Carla',
  'Cristiano',
  'Jeff',
  'Rafael',
  'Matheus',
  'Lucas',
  'Oliver',
  'Jack',
  'Harry',
  'Jacob',
  'Charlie',
  'Thomas',
  'George',
  'Oscar',
  'James',
  'William',
]
const FAKE_RESPONSE_TIME_MS = 500

const callDataExample = async (term: string): Promise<string[]> => {
  return new Promise<string[]>((resolve) => {
    setTimeout(() => {
      const filteredData = DATA.filter(item => 
        item.toLowerCase().includes(term.toLowerCase())
      )
      resolve(filteredData)
    }, FAKE_RESPONSE_TIME_MS);
  })
}

export { callDataExample }