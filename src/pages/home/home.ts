import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { LoginPage } from '../../pages/login/login';
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
          this.reproducirSonido();
          console.log(this.sesionUsuario);

  }

  reproducirSonido(){
    this.audio.src = "assets/sounds/msg_notice.mp3";
    this.audio.load();
    this.audio.play();
  }
  cerrarSesion(){
    this.navCtrl.push(LoginPage);
  }

}
