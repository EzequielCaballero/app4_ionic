import { Component } from '@angular/core';
import { NavController, NavParams, Platform } from 'ionic-angular';
import { LoginPage, CapturaPage, ListaPage } from '../../pages/indexPaginas';
//FIREBASE
import { AngularFireAuth } from 'angularfire2/auth';
//jQUERY
import * as $ from 'jquery';
//******************PROVIDER********************//
import { CargarArchivoProvider } from "../../providers/cargar-archivo/cargar-archivo";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  perfil:string;
  mostrarSpinner:boolean = false;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private afAuth:AngularFireAuth,
              private platform:Platform,
              private _cargarArchivo:CargarArchivoProvider) {

          this.platform.registerBackButtonAction(()=>{
            console.log("Botón atrás del celular presionado!");
            this._cargarArchivo.desuscribir();
            this.navCtrl.push(HomePage);
          },1);
          this.perfil = this.afAuth.auth.currentUser.displayName;

  }

  ionViewDidEnter(){
    $('.panelBotones').addClass('animated flash');
    this.mostrarSpinner = false;
  }

  irTomarFoto(){
    this.navCtrl.push(CapturaPage);
  }
  irLista(){
    this.navCtrl.push(ListaPage);
  }

  cerrarSesion(){
    this.afAuth
      .auth
      .signOut().then((resolve) => {
        //this._cargarArchivo.desuscribir();
      }).then(()=>this.navCtrl.push(LoginPage));
  }

}
