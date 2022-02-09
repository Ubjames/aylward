var aylward = {
    body:document.querySelector('.bodycontent'),
    dropzone:null,
    draggedElement:null,
    images:{
        animals:{
            images: ['images/animal.png', 'images/lion.png', 'images/elephant.png', 'images/hippopotamus.png', 'images/lizard.png'],
            names:['dog','lion', 'elephant','hippopotamus','lizard']
            
        },
        sports:[],  // images src goes here..
        numbers:[],  // images src goes here..
        alphabets:[],  // images src goes here..
        transports:[], // images src goes here..
        fruits:[] // images src goes here..
    },
    backTo(page){
        return page;
    },
    types:()=>{
       aylward.body.innerHTML = document.querySelector('.types').innerHTML;
      
    },
    loadGameType:(btn)=>{
        aylward.body.innerHTML = document.querySelector('.gameboard').innerHTML;
        let type = btn.getAttribute('data-type');
        const side2 = document.querySelectorAll('.bodycontent .game-wrapper >div:last-child .col-item');
        const side1 =document.querySelectorAll('.bodycontent .game-wrapper >div:first-child .col-item');


    if(type === 'Animals'){
        let IN =shuffle(aylward.images.animals);
         Array.from(side1).forEach((img, i)=>{
             img.firstElementChild.setAttribute('data-object',IN.names[i])
             img.firstElementChild.src = IN.images[i];

             
        })
        let rev= [...IN.names].reverse();
        Array.from(side2).forEach((name, i)=>{
              name.setAttribute('data-objectName',rev[i]);
              name.firstChild.textContent = rev[i].toUpperCase();
              
            //   console.log(name.firstChild.textContent, 'rev= ', rev)
            })
    }

    function shuffle(object){
        for (let i = object.images.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [object.names[i], object.names[j]] = [object.names[j], object.names[i]];
            [object.images[i], object.images[j]] = [object.images[j], object.images[i]];
            
        }
        return object;
    }

},
ItemDragStart : (e)=>{
//    localStorage.setItem('pickedItem',item);
    aylward.draggedElement = e.target.getAttribute('data-object');
    // console.log(e.target.getAttribute('data-object'))
},
ItemDrop : (e)=>{

    if(aylward.draggedElement == e.target.getAttribute('data-objectName')){
        aylward.isOut(event)
        new Audio('audio/success.wav').play();
        e.target.classList.add('mark')
        e.target.firstElementChild.src = 'images/correct.png';
        
    }else{
        new Audio('audio/error.wav').play();
        aylward.isOut(event)
        let dp_zone = (document.querySelectorAll('.bodycontent .game-wrapper >div:last-child .col-item'))
        Array.from(dp_zone).forEach((objName)=>{
            // console.log(objName.getAttribute('data-objectName'))
            if(objName.getAttribute('data-objectName') == aylward.draggedElement){
                objName.classList.add('mark')
                objName.firstElementChild.src = 'images/wrong.png';
                // console.log(objName.getAttribute('data-objectName'))
                // console.log(aylward.draggedElement)
            }
            
        })
        
    }

 },
 isOver : (e)=>{
     e.preventDefault();
    if(e.target.getAttribute('data-objectName') === aylward.draggedElement){
        
    }

    e.target.classList.contains('inactive')?e.target.classList.replace('inactive','active'): e.target.classList.add('active');

    // console.log('overing...')
},
isOut : (e)=>{
    //  e.preventDefault();
    // if(e.target.getAttribute('data-objectName') !== aylward.draggedElement){
        e.target.classList.replace('active','inactive');
        // console.log('left...')
    // }
    // console.log(  e.target.getAttribute('data-objectName') )
 }
}

