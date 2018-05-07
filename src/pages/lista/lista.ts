import { Component } from '@angular/core';
import { NavController, NavParams, Platform } from 'ionic-angular';
import { HomePage } from '../indexPaginas';
import { CargarArchivoProvider } from '../../providers/cargar-archivo/cargar-archivo';

@Component({
  selector: 'page-lista',
  templateUrl: 'lista.html',
})
export class ListaPage {

  hayMasCarga:boolean = true; //Variable cuyo valor define si continua funcionando el Infinite Scroll

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
    this.navCtrl.push(HomePage);
  }

}
