class Vehiculo {
    constructor(monto, tasa, plazo) {
        this.monto = monto;
        this.tasa = tasa;
        this.plazo = plazo;
    }
}

class Cuota {
    constructor(mes, cuota, interes, principal, montoRestante) {
        this.mes = mes;
        this.cuota = cuota;
        this.interes = interes;
        this.principal = principal;
        this.montoRestante = montoRestante;
    }
}

let tasaMensual;
let cuota;
let cuotas = [];

// Función para calcular las cuotas mensuales
function calcularCuotas() {
    const monto = parseFloat(document.getElementById('monto').value);
    const tasa = parseFloat(document.getElementById('tasa').value);
    const plazo = parseInt(document.getElementById('plazo').value);

    if (!validarInputs(monto, tasa, plazo)) {
        document.getElementById('resultado').innerText = "Por favor, ingrese valores válidos.";
        return;
    }

    tasaMensual = tasa / 100 / 12;
    cuota = monto * (tasaMensual * Math.pow(1 + tasaMensual, plazo)) / (Math.pow(1 + tasaMensual, plazo) - 1);

    document.getElementById('resultado').innerText = `Cuota mensual: ${cuota.toFixed(2)} Pesos.`;

    // Crear un objeto Vehiculo y agregarlo al array
    const vehiculo = new Vehiculo(monto, tasa, plazo);
    console.log(vehiculo);
}

// Función para validar los inputs
function validarInputs(monto, tasa, plazo) {
    if (isNaN(monto) || isNaN(tasa) || isNaN(plazo) || monto <= 0 || tasa <= 0 || plazo <= 0) {
        return false;
    }
    return true;
}

// Función para mostrar el plan de amortización
function mostrarAmortizacion() {
    const resultado = document.getElementById('resultado');
    resultado.innerText = ''; 

    let montoRestante = parseFloat(document.getElementById('monto').value);
    const plazo = parseInt(document.getElementById('plazo').value);
    let mes = 1;

    cuotas = []; // Resetear el array de cuotas

    while (montoRestante > 0 && mes <= plazo) {
        const interes = montoRestante * tasaMensual;
        const principal = cuota - interes;

        if (mes === plazo || montoRestante < principal) {
            montoRestante = 0;
        } else {
            montoRestante -= principal;
        }

        // Crear un objeto Cuota y agregarlo al array
        const cuotaObj = new Cuota(mes, cuota.toFixed(2), interes.toFixed(2), principal.toFixed(2), montoRestante.toFixed(2));
        cuotas.push(cuotaObj);

        resultado.innerText += `Mes ${mes}: Cuota: ${cuota.toFixed(2)}, Interés: ${interes.toFixed(2)}, Principal: ${principal.toFixed(2)}, Monto Restante: ${montoRestante.toFixed(2)}\n`;

        mes++;
    }

    console.log(cuotas); // Mostrar las cuotas en la consola
}

// Ejemplo adicional usando prompt y alert
function capturarDatosPrompt() {
    const monto = parseFloat(prompt("Ingrese el monto del vehículo:"));
    const tasa = parseFloat(prompt("Ingrese la tasa de interés (%):"));
    const plazo = parseInt(prompt("Ingrese el plazo (meses):"));

    if (!validarInputs(monto, tasa, plazo)) {
        alert("Por favor, ingrese valores válidos.");
        return;
    }

    tasaMensual = tasa / 100 / 12;
    cuota = monto * (tasaMensual * Math.pow(1 + tasaMensual, plazo)) / (Math.pow(1 + tasaMensual, plazo) - 1);

    alert(`Cuota mensual: ${cuota.toFixed(2)} Pesos.`);
}

// Función de ejemplo de búsqueda y filtrado en el array de cuotas
function buscarCuotas(mes) {
    return cuotas.filter(cuota => cuota.mes === mes);
}

