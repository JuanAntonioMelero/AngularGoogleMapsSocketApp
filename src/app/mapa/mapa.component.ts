import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Lugar } from '../interfaces/lugar';

@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.component.html',
  styleUrls: ['./mapa.component.css']
})
export class MapaComponent implements OnInit {

  @ViewChild('map') mapaElement!: ElementRef;
  map!: google.maps.Map;

  marcadores: google.maps.Marker[] = [];
  infoWindows: google.maps.InfoWindow[] = [];

  lugares: Lugar[] = [
    {
      nombre: 'Udemy',
      lat: 37.784679,
      lng: -122.395936
    },
    {
      nombre: 'Bahía de San Francisco',
      lat: 37.798933,
      lng: -122.377732
    },
    {
      nombre: 'The Palace Hotel',
      lat: 37.788578,
      lng: -122.401745
    }
  ];

  constructor(

  ) { }

  ngOnInit() {
setTimeout(()=>{
  this.cargarMapa();
},1)


  }


  cargarMapa() {

    const latLng = new google.maps.LatLng( 37.784679, -122.395936 );

    const mapaOpciones: google.maps.MapOptions = {
      center: latLng,
      zoom: 13,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
    };


    this.map = new google.maps.Map(
      this.mapaElement.nativeElement,
      mapaOpciones,
       );

       this.map.addListener( 'click', ( coors:any ) => {
        const nuevoMarcador: Lugar = {
          nombre: 'Nuevo Lugar',
          lat: coors.latLng.lat(),
          lng: coors.latLng.lng(),
          id: new Date().toISOString()
        };

        this.agregarMarcador( nuevoMarcador );
       });

    for (const lugar of this.lugares){
      this.agregarMarcador(lugar);
    }

  }
  escucharSockets(){
     // marcador-nuevo

  }
  agregarMarcador( marcador: Lugar ) {

const latLng = new google.maps.LatLng( marcador.lat, marcador.lng );

const marker = new google.maps.Marker({
  map:this.map,
  animation: google.maps.Animation.DROP,
  position:latLng,
  draggable:true
})
this.marcadores.push(marker);

const contenido = `<b>${ marcador.nombre }</b>`;
const infoWindow = new google.maps.InfoWindow({
  content: contenido
});

this.infoWindows.push( infoWindow );
google.maps.event.addDomListener( marker, 'click', () => {

  this.infoWindows.forEach( infoW => infoW.close() );
  infoWindow.open( this.map, marker );

});

google.maps.event.addDomListener(marker,'dblclick', (coors: any)=>{
marker.setMap(null);

});
google.maps.event.addDomListener(marker,'drag', (coors: any)=>{
  const nuevoMarcador = {
    lat: coors.latLng.lat(),
    lng: coors.latLng.lng(),
    nombre: marcador.nombre,
    id: marcador.id
  };
  console.log(nuevoMarcador);
  });

  }


}
