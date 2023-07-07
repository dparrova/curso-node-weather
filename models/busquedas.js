const fs = require('fs');

const axios = require('axios');
const path = require('path');

class Busqueda {

  historial = [];
  dbPatch ='./db/databaje.json';

  constructor() {
   this.leerDB();

  }

  get historialCapitalizado(){
    return this.historial.map(lugar=>{
      let palabras = lugar.split(' ');
      palabras = palabras.map(p => p[0].toUpperCase()+p.substring(1));
      return palabras.join( ' ');
    })
  }

  get paramsMapbos(){
    return {
      'limit': 5,
      'language': 'es',
      'access_token': process.env.MAPBOX_KEY
    }
  }
  get paramsWeather(){
    return {
      'appid': process.env.WEATHER_KEY,
      'units': 'metric',
      'lang': 'es'
    }
  }

  async ciudad(lugar = '') {

    try {
      const intance = axios.create({
        baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${ lugar }.json`,
        params: this.paramsMapbos
      });

      const resp = await intance.get();
      return resp.data.features.map(lugar => ({
        id:lugar.id,
        nombre: lugar.place_name,
        lng: lugar.center[0],
        lat: lugar.center[1]
      }))
    } catch (error) {
      return [];
    }

  }



  async climaLugar(lat,lon) {

    try {
      const intance = axios.create({
        baseURL: 'https://api.openweathermap.org/data/2.5/weather',
        params: {...this.paramsWeather, lat,lon}
      });
      //resp.data
      const resp = await intance.get();
      return {
        desc : resp.data.weather[0].description,
        temp : resp.data.main.temp,
        temp_min : resp.data.main.temp_min,
        temp_max : resp.data.main.temp_max
      };

    } catch (error) {
      console.log('Error buscando el clima');
    }
  }

  agregarHistorial( lugar = ''){
    if (this.historial.includes(lugar.toLowerCase())) {
      return;
    }
    this.historial = this.historial.splice(0,5);
    //
    this.historial.unshift(lugar.toLocaleLowerCase());
    //graba db
    this.guardarDB();
  }

  guardarDB(){
    const payload = {
      historial : this.historial
    }
    fs.writeFileSync(this.dbPatch,JSON.stringify( payload))
  }

  leerDB(){
    if (!fs.existsSync(this.dbPatch)) {
      return null
    }
    const info = fs.readFileSync(this.dbPatch, {encoding: 'utf-8'});
    const data = JSON.parse(info);
    this.historial =data.historial;
    return this.historial;
  }

}


module.exports = Busqueda