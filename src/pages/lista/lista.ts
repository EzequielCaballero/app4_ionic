import { Component } from '@angular/core';
import { NavController, NavParams, Platform } from 'ionic-angular';
import { HomePage } from '../indexPaginas';
import { CargarArchivoProvider } from '../../providers/cargar-archivo/cargar-archivo';
//TIMER
import { timer } from 'rxjs/observable/timer';
//Interface de subir archivo
import { Archivo } from "../../interfaces/archivo_interface";

@Component({
  selector: 'page-lista',
  templateUrl: 'lista.html',
})
export class ListaPage {

  mostrarSpinner:boolean = false;
  hayMasCarga:boolean = true; //Variable cuyo valor define si continua funcionando el Infinite Scroll
  imagenes:Archivo[] = [];


  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private platform:Platform,
              private _cargarArchivo:CargarArchivoProvider) {

          this.platform.registerBackButtonAction(()=>{
            console.log("Botón atrás del celular presionado!");
            this.navCtrl.push(HomePage);
          },1);
  }

  ionViewDidLoad() {
    this.mostrarSpinner = true;
    timer(1500).subscribe(()=> this.mostrarSpinner = false);
 }

  //SCROLL INFINITO: carga por tanda de imágenes
  doInfinite(infiniteScrollEvent) {
    console.log('Begin async operation');

    this._cargarArchivo.leer_imagenes().then(
      (hayMas:boolean)=>{
      console.log("Hay más imágenes: " + hayMas);
      this.hayMasCarga = hayMas;
      infiniteScrollEvent.complete();
    });
  }

  volver(){
    this._cargarArchivo.desuscribir();
    this.navCtrl.push(HomePage);
  }

}
