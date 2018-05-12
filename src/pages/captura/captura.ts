import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { HomePage, CamaraPage } from '../indexPaginas';
//TIMER
import { timer } from 'rxjs/observable/timer';
//jQUERY
import * as $ from 'jquery';

@Component({
  selector: 'page-captura',
  templateUrl: 'captura.html',
})
export class CapturaPage {

  opcionElegida:string;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public alertCtrl: AlertController) {
  }

  ionViewDidLoad() {
  }

  verAlerta(opcion:number){
    switch(opcion){
      case 1:
      this.opcionElegida = "LINDAS";
      $('.buttonUno').addClass('animated fadeOutRight');
      break;
      case 2:
      this.opcionElegida = "FEAS";
      $('.buttonDos').addClass('animated fadeOutRight');
      break;
    }
      timer(750).subscribe(()=> this.navCtrl.push(CamaraPage, {'opcion':this.opcionElegida}));
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
    this.navCtrl.push(HomePage);
  }

}
