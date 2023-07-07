require('dotenv').config()

const {leerInput, inquirerMenus, pausa,listarLugares} = require('./helpers/inquirer');
const Busqueda = require('./models/busquedas');


const main= async() =>{
  const busquedas = new Busqueda();
  let opt =''
  const historial = await busquedas.leerDB()

  do {
    opt = await inquirerMenus();

    switch (opt) {
      case 1:
          //mostart mesaje para escriba
          const lugar = await leerInput('Ciudad: ');
          const lugares =  await busquedas.ciudad(lugar);
          // buscar los lugares
          // seleccionar el lugar
          const idSeleccionado = await listarLugares(lugares);

          if (idSeleccionado === '0') {
            continue;

          }
          const lugarSel = lugares.find(l=>l.id===idSeleccionado);
          busquedas.agregarHistorial(lugarSel.nombre);
          const climaLugar = await busquedas.climaLugar(lugarSel.lat,lugarSel.lng);

          await pausa();
          // Clima
          // mostrar resultados
          console.log('Informacion de la ciudad \n'.green)
          console.log('Cidad:', lugarSel.nombre);
          console.log('Lat:', lugarSel.lat);
          console.log('Lng:', lugarSel.lng);
          console.log('Temperatura:', climaLugar.temp);
          console.log('Minima:', climaLugar.temp_min);
          console.log('Maxima:', climaLugar.temp_max);
          console.log(`Clima: ${climaLugar.desc.green}`);

        break;
    case 2:
          busquedas.historialCapitalizado.forEach((lugar,i) =>{
            const idx = `${i+1}.`.green;
            console.log(`${idx} ${lugar}`);
          })
      break;
      default:
        break;
    }


   if (opt !== 0) {
     await pausa();
   }

  } while ( opt !== 0);

}


main();