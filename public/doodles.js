canvas1 = document.getElementById("canvas1");
const context = canvas1.getContext( '2d' );
context.lineCap = 'round';

const colorPicker = document.querySelector( '.js-color-picker');

colorPicker.addEventListener( 'change', event => {
    context.strokeStyle = event.target.value; 
} );

const lineWidthRange = document.querySelector( '.js-line-range' );
const lineWidthLabel = document.querySelector( '.js-range-value' );

lineWidthRange.addEventListener( 'input', event => {
    const width = event.target.value;
    lineWidthLabel.innerHTML = width;
    context.lineWidth = width;
} );

let x = 0, y = 0;
let isMouseDown = false;

const stopDrawing = () => { isMouseDown = false; }

const startDrawing = event => {
    isMouseDown = true;   
   [x, y] = [event.offsetX, event.offsetY];  
}
const drawLine = event => {
    if ( isMouseDown ) {
        const newX = event.offsetX;
        const newY = event.offsetY;
        context.beginPath();
        context.moveTo( x, y );
        context.lineTo( newX, newY );
        context.stroke();
        x = newX;
        y = newY;
    }
}

function setOrRemoveDoodlesEvents(remove = false) {
    if (remove) {
        canvas1.removeEventListener('mousedown', startDrawing, false);
        canvas1.removeEventListener('mousemove', drawLine, false);
        canvas1.removeEventListener('mouseup', stopDrawing, false);
        canvas1.removeEventListener('mouseout', stopDrawing, false);
    } else {
        canvas1.addEventListener('mousedown', startDrawing, false);
        canvas1.addEventListener('mousemove', drawLine, false);
        canvas1.addEventListener('mouseup', stopDrawing, false);
        canvas1.addEventListener('mouseout', stopDrawing, false);
    }
}