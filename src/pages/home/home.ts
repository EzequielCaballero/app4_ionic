import { Component } from '@angular/core';
import { NavController, NavParams, Platform } from 'ionic-angular';
import { LoginPage, CapturaPage, ListaPage } from '../../pages/indexPaginas';
//FIREBASE
import { AngularFireAuth } from 'angularfire2/auth';
//jQUERY
import * as $ from 'jquery';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  audio = new Audio();
  perfil:string;
  mostrarSpinner:boolean = false;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private afAuth:AngularFireAuth,
              private platform:Platform) {

          this.platform.registerBackButtonAction(()=>{
            console.log("Botón atrás del celular presionado!");
            this.navCtrl.push(HomePage);
          },1);
          //this.reproducirSonido();
          this.perfil = this.afAuth.auth.currentUser.displayName;

  }

  ionViewDidEnter(){
    $('.panelBotones').addClass('animated flash');
    this.mostrarSpinner = false;
  }

  reproducirSonido(){
    this.audio.src = "assets/sounds/msg_notice.mp3";
    this.audio.load();
    this.audio.play();
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
