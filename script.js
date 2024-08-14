document.getElementById('float-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const input = document.getElementById('float-input').value;
    const preciseFloat = preciseIEEE754Float(input);
    document.getElementById('result').textContent = `Full float: ${preciseFloat}`;
});

document.getElementById('skin-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const desiredFloat = parseFloat(document.getElementById('desired-float').value);
    const floatCap = parseFloat(document.getElementById('float-cap').value);
    const floatInputs = [];
    for (let i = 1; i <= 9; i++) {
        floatInputs.push(parseFloat(document.getElementById('float-' + i).value));
    }

    const neededAverage = desiredFloat / floatCap;
    const sumOfFloats = floatInputs.reduce((acc, val) => acc + val, 0);
    const lastFloatNeeded = (neededAverage * 10) - sumOfFloats;

    document.getElementById('skinResult').textContent = `Needed Average Float: ${neededAverage}, Last Float Needed: ${lastFloatNeeded}`;
});

document.getElementById('scout-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const floatInputs = [];
    for (let i = 1; i <= 10; i++) {
        floatInputs.push(parseFloat(document.getElementById('scout-float-' + i).value));
    }

    const sumOfFloats = floatInputs.reduce((acc, val) => acc + val, 0);
    const averageFloat = sumOfFloats / 10;
    const cappedFloat = averageFloat * 0.03;

    const closestIEEE754Value = preciseIEEE754Float(cappedFloat);
    const closestLowCap = preciseIEEE754Float(cappedFloat - 0.0000000000000004);
    const closestHighCap = preciseIEEE754Float(cappedFloat + 0.0000000000000004);

    document.getElementById('float-calc-result').innerHTML = `
    Full float sum: ${sumOfFloats}<br>
    Average float: ${averageFloat}<br>
    Capped float: ${cappedFloat}<br>
    Closest IEEE754 value: ${closestIEEE754Value}<br>
    Low cap: ${closestLowCap}<br>
    High cap: ${closestHighCap}
    `;
});

function preciseIEEE754Float(float) {
    let floatNum = parseFloat(float);
    let floatArray = new Float64Array(1); // Using Float64Array for higher precision
    floatArray[0] = floatNum;
    let intArray = new Uint32Array(floatArray.buffer);
    let binary = intArray[1].toString(2).padStart(32, '0') + intArray[0].toString(2).padStart(32, '0');

    // Constructing the float value from binary
    let sign = (binary[0] === '1') ? -1 : 1;
    let exponent = parseInt(binary.substr(1, 11), 2) - 1023;
    let mantissa = 1;

    for (let i = 12; i < 64; i++) {
        mantissa += parseInt(binary[i]) * Math.pow(2, -(i - 11));
    }

    let preciseValue = sign * mantissa * Math.pow(2, exponent);
    return preciseValue;
}
