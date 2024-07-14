document.getElementById('float-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const input = document.getElementById('float-input').value;
    const preciseFloat = preciseIEEE754Float(input);
    document.getElementById('result').textContent = `Precise IEEE754 Float: ${preciseFloat}`;
});

function preciseIEEE754Float(float) {
    let floatNum = parseFloat(float);
    let floatArray = new Float32Array(1);
    floatArray[0] = floatNum;
    let intArray = new Uint32Array(floatArray.buffer);
    let binary = intArray[0].toString(2).padStart(32, '0');

    // Constructing the float value from binary
    let sign = (binary[0] === '1') ? -1 : 1;
    let exponent = parseInt(binary.substr(1, 8), 2) - 127;
    let mantissa = 1;

    for (let i = 9; i < 32; i++) {
        mantissa += parseInt(binary[i]) * Math.pow(2, -(i - 8));
    }

    let preciseValue = sign * mantissa * Math.pow(2, exponent);
    return preciseValue.toPrecision(17);
}