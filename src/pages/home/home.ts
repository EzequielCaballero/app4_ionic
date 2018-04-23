import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { LoginPage } from '../../pages/login/login';
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  sesionUsuario:any;

  constructor(public navCtrl: NavController,
              public navParams: NavParams) {

          this.sesionUsuario = navParams.get('userData');
          console.log(this.sesionUsuario);

  }

  cerrarSesion(){
    this.navCtrl.push(LoginPage);
  }

}
