import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { CapturaPage } from '../indexPaginas';
//*********************CAMARA PLUGIN***********************//
import { Camera, CameraOptions } from '@ionic-native/camera';
//******************PROVIDER********************//
import { CargarArchivoProvider } from "../../providers/cargar-archivo/cargar-archivo";

@Component({
  selector: 'page-camara',
  templateUrl: 'camara.html',
})
export class CamaraPage {

  tematicaElegida:string;
  titulo:string = "";
  imagenPreview:string = "";
  imagenParaSubir:string;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public camera: Camera,
              public _cargarArchivo: CargarArchivoProvider) {

        this.tematicaElegida = this.navParams.get('opcion');
        console.log("Temática elegida: " + this.tematicaElegida);
  }

  ionViewDidLoad() {

  }

  //*******************METODO CAMARA*******************//
  mostrar_camara(){

    //Configuración de la camara
    const options: CameraOptions = {
      quality: 35,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }

    //Implementación y almacenado de la imagen tomada en base64
     this.camera.getPicture(options).then((imageData) => {
     this.imagenPreview = 'data:image/jpeg;base64,' + imageData;
     this.imagenParaSubir = imageData;
    }, (err) => {
       console.info("ERROR EN LA CAMARA", JSON.stringify(err));
    });
  }

  //SUBIR IMAGENES A FIREBASE
  crear_post(){

    //La variable "archivo" debe cumplir con la interface declarada
    let archivo = {
      img: this.imagenParaSubir,
      titulo: this.titulo,
      tematica: this.tematicaElegida
    }
    //Cargar imagenes al storage+database
    this._cargarArchivo.cargar_imagen_storage(archivo).then(()=>{
      //Cerrar el modal
      //this.cerrarModal();
    });
  }

  volver(){
    this.navCtrl.push(CapturaPage);
  }

}
