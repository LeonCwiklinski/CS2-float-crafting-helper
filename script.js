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

    document.getElementById('skinResult').textContent = `Needed Average Float: ${neededAverage.toPrecision(17)}, Last Float Needed: ${lastFloatNeeded.toPrecision(17)}`;
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
    const closestLowCap = preciseIEEE754Float(cappedFloat - 0.0000000004);
    const closestHighCap = preciseIEEE754Float(cappedFloat + 0.0000000004);

    document.getElementById('float-calc-result').innerHTML = `
    Full float sum: ${sum.toPrecision(17)}<br>
    Average float: ${average.toPrecision(17)}<br>
    Capped float: ${cappedFloat.toPrecision(17)}<br>
    Closest IEEE754 value: ${closestIEEE}<br>
    Low cap: ${lowCap}<br>
    High cap: ${highCap}
    `;
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
