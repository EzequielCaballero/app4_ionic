import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { LoginPage, CapturaPage, ListaPage } from '../../pages/indexPaginas';
//jQUERY
import * as $ from 'jquery';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  audio = new Audio();
  sesionUsuario:any;

  constructor(public navCtrl: NavController,
              public navParams: NavParams) {

          this.sesionUsuario = navParams.get('userData');
          //this.reproducirSonido();
          console.log(this.sesionUsuario);

  }

  ionViewDidEnter(){
    $('.panelBotones').addClass('animated flash');
  }

  reproducirSonido(){
    this.audio.src = "assets/sounds/msg_notice.mp3";
    this.audio.load();
    this.audio.play();
  }
  irTomarFoto(){
    this.navCtrl.push(CapturaPage, {'sesionUsuario':this.sesionUsuario});
  }
  irLista(){
    this.navCtrl.push(ListaPage);
  }
  cerrarSesion(){
    this.navCtrl.push(LoginPage);
  }

}
