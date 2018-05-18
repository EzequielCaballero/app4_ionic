import { Component } from '@angular/core';
import { NavController, NavParams, Platform } from 'ionic-angular';
import { HomePage } from '../indexPaginas';
import { CargarArchivoProvider } from '../../providers/cargar-archivo/cargar-archivo';
//Interface de subir archivo
import { Archivo } from "../../interfaces/archivo_interface";
//jQUERY
import * as $ from 'jquery';

@Component({
  selector: 'page-lista',
  templateUrl: 'lista.html',
})
export class ListaPage {

  mostrarSpinner:boolean = false;
  hayMasCarga:boolean = true; //Variable cuyo valor define si continua funcionando el Infinite Scroll
  imagenesMostrar:Archivo[] = [];
  noHayFotos:boolean = false; //Variable de control para definir si la DB esta vacía
  expandirFotos:boolean = false; //Variable de control para definir si para un item puntual se expandió ver mas o no.
  loaded:boolean;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private platform:Platform,
              private _cargarArchivo:CargarArchivoProvider) {

          this.platform.registerBackButtonAction(()=>{
            console.log("Botón atrás del celular presionado!");
            this.navCtrl.push(HomePage);
          },1);
  }

  ionViewWillEnter() {
    this.mostrarSpinner = true;
    this.expandirFotos = false;
    this.loaded = false;
    this._cargarArchivo.iniciar_lectura().then(()=>{
        console.log("Ultima key actual: " + this._cargarArchivo.lastKey);
        if(this._cargarArchivo.imagenes.length == 0){
           this.noHayFotos = true;
        }
        this.imagenesMostrar = this._cargarArchivo.imagenes;
        // this.cargarLista();
        // this.mostrarSpinner = false;
    }).then(()=>{
      this.mostrarSpinner = false;
    }).catch((error)=>{
        console.log("Error al cargar imagenes: " + JSON.stringify(error));
    });
 }

 verMas(item:Archivo){
    console.log("Ver más de: " + item.usuario);
    if(!this.expandirFotos){
      $('#'+item.key+'.btn_verMas').removeClass("verMas_color");
      $('#'+item.key+'.btn_verMas').addClass("verMenos_color");
      $('#'+item.key+'.icon_verMas').text("-");
      $('#'+item.key+'.box_verMas').show();
      this.expandirFotos = true;
    }
    else{
      $('#'+item.key+'.btn_verMas').removeClass("verMenos_color");
      $('#'+item.key+'.btn_verMas').addClass("verMas_color");
      $('#'+item.key+'.icon_verMas').text("+");
      $('#'+item.key+'.box_verMas').hide();
      this.expandirFotos = false;
    }
 }

 expandirFoto(key:string, opcion:number){
     let img_enPrimerPlano:string = $('#'+key+'.imgSource_1').attr("src");
     let img_pasarArriba:string;

     if(opcion == 1){
       img_pasarArriba = $('#'+key+'.imgSource_2').attr("src");
       $('#'+key+'.imgSource_2').attr("src",img_enPrimerPlano);
     }
     if(opcion == 2){
       img_pasarArriba = $('#'+key+'.imgSource_3').attr("src");
       $('#'+key+'.imgSource_3').attr("src",img_enPrimerPlano);
     }

     $('#'+key+'.imgSource_1').attr("src",img_pasarArriba);
 }

  //SCROLL INFINITO: carga por tanda de imágenes
  doInfinite(infiniteScrollEvent) {
    console.log('Begin async operation');
    //this._cargarArchivo.destroy$.subscribe();
    this._cargarArchivo.leer_imagenes().then(
      (hayMas:boolean)=>{
          console.log("Hay más imágenes: " + hayMas);
          console.log("Valor ultima key (seria la primera): " + this._cargarArchivo.lastKey);
          this.hayMasCarga = hayMas;
          infiniteScrollEvent.complete();
    }).catch((error)=>{
      console.log("Error al hacer scroll-down" + JSON.stringify(error));
    });
  }

  volver(){
    this._cargarArchivo.desuscribir();
    this.navCtrl.push(HomePage);
  }

}
