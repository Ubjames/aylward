var aylward = {
    body:document.querySelector('.bodycontent'),
    dropzone:null,
    draggedElement:null,
    target:null,
    init:()=>{
       
        (()=>{
            if ('serviceWorker' in navigator) {
                navigator.serviceWorker.register('/sw.js').then(reg => {
                    // console.log('Registration successful', reg);
                })
                    .catch(e => console.error('Error during service worker registration:', e));
            } else {
                console.warn('Service Worker is not supported');
            }
        })()
        

    },
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
    // console.log(e.type)
    let arguement;
    if(e.type === 'touchend'){
        arguement = aylward.draggedElement == aylward.target.getAttribute('data-objectName')
    }else{
        arguement = aylward.draggedElement == e.target.getAttribute('data-objectName');
    }
    
// console.log( aylward.draggedElement aylward.target.getAttribute('data-objectName'))
        if(arguement){
        aylward.isOut(event);
        document.getElementById('audio_success').play();
        let device = e.type === 'touchend'?aylward.target:e.target;
        device.classList.add('mark');
        device.firstElementChild.src = 'images/correct.png';
        
    }else{
        document.getElementById('audio_error').play();
        aylward.isOut(event)
        let dp_zone = (document.querySelectorAll('.bodycontent .game-wrapper >div:last-child .col-item'))
        Array.from(dp_zone).forEach((objName)=>{
            if(objName.getAttribute('data-objectName') == aylward.draggedElement){
                objName.classList.add('mark')
                objName.firstElementChild.src = 'images/wrong.png';
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
 },
 
 touch:{
     draggingElement:null,
     firstTouch:null,
     isDropZone:(resolve,reject)=>{
        //  return new Promise((res,rej)=>{
            document.querySelectorAll('.bodycontent .game-wrapper >div:last-child .col-item').forEach((e,i,arr)=>{
                if(aylward.touch.draggingElement.getBoundingClientRect().right >= e.getBoundingClientRect().left && aylward.touch.draggingElement.getBoundingClientRect().left < e.getBoundingClientRect().right && aylward.touch.draggingElement.getBoundingClientRect().bottom >= e.getBoundingClientRect().top && aylward.touch.draggingElement.getBoundingClientRect().top <= e.getBoundingClientRect().bottom){
                     resolve = e;
            }
            reject = arr;
            
    })
    return {'resolve':resolve,'reject':reject};
     },
     start:(e)=>{
        //  e.preventDefault();
        let touch = e.targetTouches[0];
        aylward.touch.firstTouch={y:touch.clientY, x:touch.clientX};
     
        if(touch.target.parentElement.children.length !== 2){
            aylward.touch.draggingElement = document.createElement(touch.target.tagName);
            aylward.touch.draggingElement.src = touch.target.getAttribute('src');
            aylward.touch.draggingElement.setAttribute('data-object',touch.target.getAttribute('data-object'));
            aylward.touch.draggingElement.setAttribute('id','draggingElement');
            touch.target.parentElement.appendChild(aylward.touch.draggingElement);
            aylward.touch.draggingElement.style.position = 'absolute';
            aylward.draggedElement = aylward.touch.draggingElement.getAttribute('data-object');

        }
     },
     move:(e)=>{
        e.preventDefault();
        let touch= e.targetTouches[0];
        let newX = aylward.touch.firstTouch.x -touch.clientX;
        let newY = aylward.touch.firstTouch.y -touch.clientY;
        
        aylward.touch.draggingElement.style.left = `${-newX}px`;
        aylward.touch.draggingElement.style.top = `${-newY}px`;

        if(aylward.touch.isDropZone().resolve!==undefined){
           let res = aylward.touch.isDropZone().resolve;
            res.classList.contains('inactive')?res.classList.replace('inactive','active'): res.classList.add('active');
            aylward.touch.isDropZone().reject.forEach(e=>{
                if(e !== res){
                    e.classList.contains('active')?e.classList.replace('active','inactive'): e.classList.add('inactive');

                }
            });
            
            
        }else{
             aylward.touch.isDropZone().reject.forEach(e=>{e.classList.contains('active')?e.classList.replace('active','inactive'): e.classList.add('inactive')});
        }

       
     },
     end:(e)=>{
         let res = aylward.touch.isDropZone();
           if(res.resolve!==undefined){
               aylward.target =res.resolve;
               aylward.ItemDrop(event);    
           } 
           res.reject.forEach(e=>{
               e.classList.contains('active')?e.classList.replace('active','inactive'): e.classList.add('inactive');
            });

            aylward.touch.draggingElement.parentElement.removeChild(aylward.touch.draggingElement);
     }
 }










}
aylward.init();