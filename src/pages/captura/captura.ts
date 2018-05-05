import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { HomePage } from '../indexPaginas';

@Component({
  selector: 'page-captura',
  templateUrl: 'captura.html',
})
export class CapturaPage {

  sesionUsuario:any;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public alertCtrl: AlertController) {
    this.sesionUsuario = this.navParams.get('sesionUsuario');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CapturaPage');
  }

  verAlerta(opcion:number){
    switch(opcion){
      case 1:
      this.dispararAlerta("Cosas LINDAS del edificio");
      break;
      case 2:
      this.dispararAlerta("Cosas FEAS del edificio");
      break;
    }
  }

  dispararAlerta(eleccion:string) {
  let alert = this.alertCtrl.create({
    title: eleccion,
    inputs: [
      {
        name: 'Titulo de la foto',
        placeholder: 'Ingrese un titulo'
      },
    ],
    buttons: [
      {
        text: 'Cancelar',
        role: 'cancel',
        handler: data => {
          console.log('Cancel clicked');
        }
      },
      {
        text: 'Tomar foto',
        handler: data => {
            return false;
        }
      }
    ]
  });
  alert.present();
}

  volver(){
    this.navCtrl.push(HomePage, { 'userData':this.sesionUsuario });
  }

}
