// --tile-size: 48px;
// --helmet-offset: 12px;
// --game-size: calc(var(--tile-size) * 20);

const TILE_SIZE = 48;
const HELMET_OFFSET = 12;
const GAME_SIZE = TILE_SIZE*20;

const root = document.documentElement;
root.style.setProperty('--tile-size', `${TILE_SIZE}px`)
root.style.setProperty('--helmet-offset', `${HELMET_OFFSET}px`)
root.style.setProperty('--game-size', `${GAME_SIZE}px`)

// cosnt reloadButton = document.getElementById("reset");
let passos = 80;
// ---

function createBoard(){
  const boardElement = document.getElementById('board');
  const elements = [];
  
  function createElement(options) {
    let {item, top, left} = options;

    const currentElement = {item, currentPosition: {top, left}};
    elements.push(currentElement);

    const htmlElement = document.createElement('div');
    htmlElement.className = item;
    htmlElement.style.top = top + 'px';
    htmlElement.style.left = left + 'px';

    boardElement.appendChild(htmlElement);

    function  getNewDirection(buttonPressed, position){
      switch (buttonPressed) {
        case 'w':
          return {
          top: position.top - TILE_SIZE, left: position.left
          };
        case 's':
          return {
          top: position.top + TILE_SIZE, left: position.left
          };
        case 'd':
          return {
          top: position.top, left: position.left + TILE_SIZE
          };
        case 'a':
          return {
          top: position.top, left: position.left - TILE_SIZE
          };
        default:
          return position;
      }
    }

    function validateMoviment(position, conflictItem){
      if (currentElement.item === 'mini-demon' && conflictItem?.item === 'trap' || currentElement.item === 'mini-demon' && conflictItem?.item === 'chest') {
        return false;
      }
      else if (position.left >= 0 && position.left <= 912
        && position.top >= 96 && position.top <= 864
        && conflictItem?.item !== 'furniture') {
          return true;
      }
      else {
        return false;
      }
    }
    
    // function getMovementConflict (position, els) {
      //   const hasConflict = els.find((currentElement) => {
        //     return {
          //    currentElement.currentPosition.top === position.top &&
          //    currentElement.currentPosition.left === position.left
          //    }
    //});
          
    function getMovementConflict(position, els) {
      const conflictItem = els.find((currentElement) => {
        if (currentElement.currentPosition.top === position.top &&
        currentElement.currentPosition.left === position.left) {
          return true;
        }
        else {
          return false;
        }
      });   
      return conflictItem;       
    }

    function validateConflicts (currentEl, conflictItem) {
      let alerted = false;

      function finishGame (message){
        setTimeout(() => {                    
          location.reload();
          alert(message);
        }, 100);
      }

      if (currentEl.item === 'hero' ) {
        if (conflictItem?.item === 'mini-demon' || conflictItem?.item === 'trap')
          {
          finishGame('Você morreu :(')
          }
        

        if (conflictItem?.item === 'chest'){
          finishGame('Você encontrou um tesouro!')
        }
      }

      if (currentEl.item === 'mini-demon' && conflictItem?.item === 'hero') {
        finishGame('você foi morto');
      }
      if (alerted === false && passos < 1 ){
        alerted = true;
        console.log('Opa, '+passos+' passos!', alerted);            
        finishGame('Você está muito cansado para continuar');
      }
    }

    function move(buttonPressed){
      const newPosition = getNewDirection(buttonPressed, currentElement.currentPosition);
      const conflictItem = getMovementConflict(newPosition, elements);
      const isValidMoviment = validateMoviment(newPosition, conflictItem);    

      if (isValidMoviment) {
        currentElement.currentPosition = newPosition
        htmlElement.style.top =  `${newPosition.top}px`;
        htmlElement.style.left =  `${newPosition.left}px`;

        validateConflicts(currentElement, conflictItem);
        stepCounter(currentElement, buttonPressed);        
      }
    }

    function stepCounter (currentElement, buttonPressed){
      if(currentElement.item === 'hero' && buttonPressed === 'w' ||
         currentElement.item === 'hero' && buttonPressed === 'a' ||
         currentElement.item === 'hero' && buttonPressed === 's' ||
         currentElement.item === 'hero' && buttonPressed === 'd' ){
      passos = passos - 1;
      console.log(passos);
      updateStepCounter ()
      }
      
      return passos;
    }

    function updateStepCounter (){
      const counterCSS = document.getElementsByClassName('steps');
      counterCSS[0].innerHTML = `Passos: ${passos}`;
      console.log(counterCSS[0]);

    }

    return{
      move : move
    }
  }

  function createItem(options) {
    createElement({
      item: options.item,
      top: TILE_SIZE * options.top,
      left: TILE_SIZE * options.left
    });
  }

  function createHero(options) {
    const hero = createElement({
      item: 'hero',
      top: TILE_SIZE * options.top,
      left: TILE_SIZE * options.left
    });

    document.addEventListener(
      'keydown',
      (event)=> {        
        hero.move(event.key);
      }
    );
  }

  function createEnemy(options) {
    const enemy = createElement({
      item: 'mini-demon',
      top: TILE_SIZE * options.top,
      left: TILE_SIZE * options.left      
    });

    setInterval(() => {
      const direction = ['w', 'a', 's', 'd'];
      const randomIndex = Math.floor(Math.random() * direction.length);
      const randomDirection = direction[randomIndex];

      enemy.move(randomDirection);
    }, 1000)
  }

  return{
    createItem : createItem,
    createHero : createHero,
    createEnemy : createEnemy
  }

}

const board = createBoard();
//item - demon, chest, hero, trap
//top - y
//left - x
board.createItem ({item: 'furniture', top: 2, left: 3});
board.createItem ({item: 'furniture', top: 2, left: 8});
board.createItem ({item: 'furniture', top: 2, left: 16});
board.createItem ({item: 'furniture', top: 17, left: 2});
board.createHero ({top: 16, left: 2});
board.createItem ({item: 'chest', top: 3, left: 18});
// fixed start

function populateBoard() {
  const enemiesNumber = Math.floor(Math.random() * (20 - 8)+8);
  const trapsNumber = Math.floor(Math.random() * (25 - 8))+8;  

  for (let i = 0; i <= enemiesNumber; i++) {
    board.createEnemy ({
      top: Math.floor(Math.random() * (18 - 2) +2),
      left: Math.floor(Math.random() * (19 - 1) +1)
    });    
  }

  for (let i = 0; i <= trapsNumber; i++) {
    board.createItem ({item: 'trap',
    top: Math.floor(Math.random() * (18 - 2) +2),
    left: Math.floor(Math.random() * (19 - 1) +1)
    });    
  }

}

populateBoard();