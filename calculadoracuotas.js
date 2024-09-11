const vehiculosJSON = `
[
    {
        "id": "ford",
        "nombre": "Ford Ka Viral",
        "precio": 1000000,
        "tasa": 1,
        "plazo": 24,
        "img": "./assets/fordka.jpeg"
    },
    {
        "id": "fiat",
        "nombre": "Fiat Cronos",
        "precio": 5000000,
        "tasa": 2,
        "plazo": 24,
        "img": "./assets/fiatcronos.jpeg"
    },
    {
        "id": "ferrari",
        "nombre": "Ferrari Enzo",
        "precio": 10000000,
        "tasa": 4,
        "plazo": 48,
        "img": "./assets/ferrarienzo.jpeg"
    }
]
`;

async function cargarVehiculos() {
    try {
        const vehiculos = await obtenerDatosVehiculos();
        const contenedor = document.querySelector('main');

        vehiculos.forEach(vehiculo => {
            const vehiculoSeccion = document.createElement('section');
            vehiculoSeccion.id = `vehiculo-${vehiculo.id}`;
            vehiculoSeccion.classList.add('vehiculo', 'animate__animated', 'animate__fadeIn');

            vehiculoSeccion.innerHTML = `
                <h2>${vehiculo.nombre}</h2>
                <div class="vehiculo-info">
                    <img src="${vehiculo.img}" alt="${vehiculo.nombre}">
                    <div class="vehiculo-detalle">
                        <p>Precio: $${vehiculo.precio.toLocaleString()}</p>
                        <p>Tasa de interés: ${vehiculo.tasa}%</p>
                        <p>Plazo: ${vehiculo.plazo} meses</p>
                        <div class="botones">
                            <button class="financiar-btn" data-id="${vehiculo.id}">Calculá la financiación</button>
                            <button class="agregar-carrito-btn" data-id="${vehiculo.id}">Agregar al carrito</button>
                        </div>
                    </div>
                </div>
            `;
            contenedor.insertBefore(vehiculoSeccion, document.getElementById('simulador'));
        });

        agregarEventosFinanciacion(vehiculos);
        agregarEventosCarrito(vehiculos); 
    } catch (error) {
        console.error('Error al cargar los vehículos:', error);
    }
}

async function obtenerDatosVehiculos() {
    return new Promise((resolve) => {
        setTimeout(() => {
            const vehiculos = JSON.parse(vehiculosJSON);
            resolve(vehiculos);
        }, 1000);
    });
}

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

async function cargarVehiculos() {
    try {
        const vehiculos = await obtenerDatosVehiculos();
        const contenedor = document.querySelector('main');

        vehiculos.forEach(vehiculo => {
            const vehiculoSeccion = document.createElement('section');
            vehiculoSeccion.id = `vehiculo-${vehiculo.id}`;
            vehiculoSeccion.classList.add('vehiculo', 'animate__animated', 'animate__fadeIn');

            vehiculoSeccion.innerHTML = `
                <h2>${vehiculo.nombre}</h2>
                <div class="vehiculo-info">
                    <img src="${vehiculo.img}" alt="${vehiculo.nombre}">
                    <div class="vehiculo-detalle">
                        <p>Precio: $${vehiculo.precio.toLocaleString()}</p>
                        <p>Tasa de interés: ${vehiculo.tasa}%</p>
                        <p>Plazo: ${vehiculo.plazo} meses</p>
                        <button class="financiar-btn" data-id="${vehiculo.id}">Calculá la financiación</button>
                    </div>
                </div>
            `;
            contenedor.insertBefore(vehiculoSeccion, document.getElementById('simulador'));
        });

        agregarEventosFinanciacion(vehiculos);
    } catch (error) {
        console.error('Error al cargar los vehículos:', error);
    }
}

function agregarEventosFinanciacion(vehiculos) {
    const botones = document.querySelectorAll('.financiar-btn');
    botones.forEach(boton => {
        boton.addEventListener('click', function() {
            const vehiculo = vehiculos.find(v => v.id === this.getAttribute('data-id'));
            document.getElementById('monto').value = vehiculo.precio;
            document.getElementById('tasa').value = vehiculo.tasa;
            document.getElementById('plazo').value = vehiculo.plazo;
            document.getElementById('simulador').scrollIntoView({ behavior: 'smooth' });
        });
    });
}

function calcularCuotas() {
    const monto = parseFloat(document.getElementById('monto').value);
    const tasa = parseFloat(document.getElementById('tasa').value);
    const plazo = parseInt(document.getElementById('plazo').value);

    if (!validarInputs(monto, tasa, plazo)) {
        mostrarError("Por favor, ingrese valores válidos.");
        return;
    }

    tasaMensual = tasa / 100 / 12;
    cuota = monto * (tasaMensual * Math.pow(1 + tasaMensual, plazo)) / (Math.pow(1 + tasaMensual, plazo) - 1);

    document.getElementById('resultado').innerText = `Cuota mensual: $${cuota.toFixed(2)} Pesos.`;

    const vehiculo = new Vehiculo(monto, tasa, plazo);
    guardarVehiculo(vehiculo);
}

function validarInputs(monto, tasa, plazo) {
    return !(isNaN(monto) || isNaN(tasa) || isNaN(plazo) || monto <= 0 || tasa <= 0 || plazo <= 0);
}

function mostrarAmortizacion() {
    const resultado = document.getElementById('resultado');
    resultado.innerHTML = ''; 

    let montoRestante = parseFloat(document.getElementById('monto').value);
    const plazo = parseInt(document.getElementById('plazo').value);
    let mes = 1;

    cuotas = [];

    while (montoRestante > 0 && mes <= plazo) {
        const interes = montoRestante * tasaMensual;
        const principal = cuota - interes;

        if (mes === plazo || montoRestante < principal) {
            montoRestante = 0;
        } else {
            montoRestante -= principal;
        }

        const cuotaObj = new Cuota(mes, cuota.toFixed(2), interes.toFixed(2), principal.toFixed(2), montoRestante.toFixed(2));
        cuotas.push(cuotaObj);

        resultado.innerText += `Mes ${mes}: Cuota: $${cuota.toFixed(2)}, Interés: $${interes.toFixed(2)}, Principal: $${principal.toFixed(2)}, Monto Restante: $${montoRestante.toFixed(2)}\n`;

        mes++;
    }

    guardarCuotas(cuotas);

    mostrarGraficoAmortizacion();
}

function mostrarError(mensaje) {
    const resultado = document.getElementById('resultado');
    resultado.innerHTML = `<p id="error">${mensaje}</p>`;
}

function guardarVehiculo(vehiculo) {
    localStorage.setItem('vehiculo', JSON.stringify(vehiculo));
}

function cargarVehiculo() {
    const vehiculo = JSON.parse(localStorage.getItem('vehiculo'));
    if (vehiculo) {
        document.getElementById('monto').value = vehiculo.monto;
        document.getElementById('tasa').value = vehiculo.tasa;
        document.getElementById('plazo').value = vehiculo.plazo;
    }
}

function guardarCuotas(cuotas) {
    localStorage.setItem('cuotas', JSON.stringify(cuotas));
}

function cargarCuotas() {
    return JSON.parse(localStorage.getItem('cuotas')) || [];
}

function mostrarGraficoAmortizacion() {
    const ctx = document.createElement('canvas');
    ctx.id = 'chart';
    document.getElementById('resultado').appendChild(ctx);

    const labels = cuotas.map(cuota => `Mes ${cuota.mes}`);
    const dataPrincipal = cuotas.map(cuota => parseFloat(cuota.principal));
    const dataInteres = cuotas.map(cuota => parseFloat(cuota.interes));

    if (window.myChart) {
        window.myChart.destroy();
    }

    window.myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Principal',
                    data: dataPrincipal,
                    backgroundColor: 'rgba(75, 192, 192, 0.6)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1
                },
                {
                    label: 'Interés',
                    data: dataInteres,
                    backgroundColor: 'rgba(255, 99, 132, 0.6)',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 1
                }
            ]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Monto en Pesos'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Meses'
                    }
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: 'Amortización del Préstamo'
                }
            }
        }
    });
}

document.getElementById('calcular-btn').addEventListener('click', calcularCuotas);

document.getElementById('amortizacion-btn').addEventListener('click', mostrarAmortizacion);

document.getElementById('limpiar-btn').addEventListener('click', function() {
    document.getElementById('monto').value = '';
    document.getElementById('tasa').value = '';
    document.getElementById('plazo').value = '';
    document.getElementById('resultado').innerText = '';
    if (window.myChart) {
        window.myChart.destroy();
    }
    localStorage.removeItem('vehiculo');
    localStorage.removeItem('cuotas');
});

document.addEventListener('DOMContentLoaded', function() {
    cargarVehiculo();
    cargarVehiculos();
});
