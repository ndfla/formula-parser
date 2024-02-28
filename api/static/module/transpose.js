let transpose = 4;

const addTransposeEvent = function(){

    const transpose_value = document.getElementById('transpose_value');
    transpose_value.innerHTML = transpose;

    const transpose_button = document.querySelectorAll('#transpose_button');

    transpose_button[0].addEventListener('pointerdown', () => downTranspose())

    transpose_button[1].addEventListener('pointerdown', () => upTranspose())

    addEventListener("keydown", event => {
        if (!event.repeat){
            switch(event.key){
                case "z": downTranspose();break;
                case "x": upTranspose();break;
            }
        }
    })
}

const downTranspose = function(){
    if (transpose>=1) {
        transpose-=1;
        transpose_value.innerHTML = transpose
    }
}

const upTranspose = function(){
    if (transpose<=5) {
        transpose+=1;
            transpose_value.innerHTML = transpose;
    }  
}

addTransposeEvent()

export { transpose } 