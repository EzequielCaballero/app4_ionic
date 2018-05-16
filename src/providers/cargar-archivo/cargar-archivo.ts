import { Injectable } from '@angular/core';
//Componente: Toast
import { ToastController } from 'ionic-angular';

//*********************FIREBASE import*********************//
import { AngularFireAuth} from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import * as firebase from 'firebase';
//Interface de subir archivo
import { Archivo } from "../../interfaces/archivo_interface";
//Importar map: operador para transformar la información recibida de afDB.list
import 'rxjs/add/operator/map';
//import{ Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';

@Injectable()
export class CargarArchivoProvider {

  imagenes:Archivo[] = []; //Fin: subir a DB la imagen subida en Storage
  imgsCapturadas:string[] = [];//array de imgs64
  urlsImagenes:string[] = [];//urls unidas en un JSON
  lastKey: string = null; //Fin: controlar último elemento insertado en firebase
  imgStorage:string;//título de referencia de la imágen subida al storage
  counter:number;//contador para agregar N° de img al imgStorage
  destroy$: Subject<boolean> = new Subject<boolean>();//referencia para realizar unsubscribe

  constructor(public toastCtrl: ToastController,
              public afDB: AngularFireDatabase,
              public afAuth:AngularFireAuth) {

      console.log('Provider inyectado...');
      //CARGA: de un grupo de imágenes de la última a la primera.

  }

  //INICIAR LECTURA
  iniciar_lectura(){
    this.destroy$ = new Subject<boolean>();
    this.imagenes = [];
    const promise = new Promise( (resolve, reject)=>{
      this.leer_ultima_imagen()
        .takeUntil(this.destroy$)
        .subscribe(()=>this.leer_imagenes().then(()=>resolve()));
    });
    return promise;
  }
  //LECTURA DE ULTIMA IMAGEN SUBIDA A FIREBASE
  private leer_ultima_imagen(){
    //Retorna un observable
    return this.afDB.list('/galeria',ref=> ref.orderByChild('key').limitToLast(1))
           .valueChanges()
           .map( (galeria:any) =>{ //definir 'galeria' de tipo any para que no de error.

             this.lastKey = galeria[0].key; //tomar valor de ordenación del último dato cargado
             console.info("DATOS: ", galeria);
             console.log("Ultima key: " + this.lastKey);
             this.imagenes.push(galeria[0]); // guarda en array imagenes la última img subida (por key).
           })
  }

  //LECTURA DE IMAGENES POR TANDA
  leer_imagenes(){
    //Retorna una promesa
    let promesa = new Promise((resolve, reject)=>{

      this.afDB.list('/galeria',
        ref=> ref.limitToLast(5)//Especifico cuantas imágenes (orden cronológico descendente) serán cargadas
                 .orderByChild('key')//Criterio de ordenación ASCENDENTE por key() -> n° de post
                 .endAt( this.lastKey )//Interrupción de la lectura al alcanzar último key.
      ).valueChanges()
       .takeUntil(this.destroy$)
       .subscribe ( (galeria:any)=>{
          console.info("DATOS de galeria al leer", galeria);
          galeria.pop();//Elimina la última imágen del arreglo (que ya es subida por método: leer_ultima_imagen)

          //Si se alcanza el final de imágenes (primer imágen subida)...
          if(galeria.length == 0){
            console.log("Ya no hay más registros");
            resolve(false);
            return;
          }

          this.lastKey = galeria[0].key; //Se actualiza la ultima key.

          //Se insertan las imágenes al array "imagenes" (de la última a la primera) conforme cómo se obtuvieron de firebase
          for (let i = galeria.length-1; i >= 0; i--) {
              let imagen = galeria[i];
              this.imagenes.push(imagen);
          }
          resolve(true);//Es como decir: "puede haber más imagenes".
       })

    });

    return promesa;
  }

  cargar_imagen_storage( archivo:any ){

    //Promesa que determina un tiempo hasta que se complete la carga de la imagen
    const promesa = new Promise( (resolve, reject)=>{
      //Mensajes de interacción con el usuario...
      this.mostrar_toast("Cargando...");
      //Declaración
      let storeRef = firebase.storage().ref();
      //Tarea de Carga (creación de carpeta "img" si no existe en opción Storage de Firebase)
      let imgKey:string = new Date().valueOf().toString(); // 1231243245
      //String imagenes capturadas
      this.imgsCapturadas = archivo.img;
      console.log("N° Imagenes capturadas: " + this.imgsCapturadas.length);

      //SUBIDA DE IMAGENES
      this.urlsImagenes = [];
      this.counter = 1;
      let numImg = 0;
      for(let i of this.imgsCapturadas){
        numImg++;
        this.imgStorage = imgKey +'_'+archivo.titulo+'_'+numImg;
        let uploadTask: firebase.storage.UploadTask =
          storeRef.child(`img/${ this.imgStorage}`)
                  .putString( i, 'base64', { contentType:'image/jpeg'});
                  //EJECUCION DE TAREA DE CARGA
                  uploadTask.on( firebase.storage.TaskEvent.STATE_CHANGED, //Tarda c/subida
                  ()=>{},//Saber el % de cuantos Mbs fueron subidos
                  ( error )=>{
                    //Manejo de error
                    console.info("ERROR EN LA CARGA", JSON.stringify(error));
                    this.mostrar_toast("Error"+JSON.stringify(error));
                  },
                  ()=>{
                    //Carga exitosa, TODO bien
                    console.log("Archivo subido");
                    let urlImg = uploadTask.snapshot.downloadURL;
                    this.urlsImagenes.push(urlImg.toString());
                    if(this.counter == this.imgsCapturadas.length){
                      this.mostrar_toast("Carga exitosa");
                      console.log("N° URLs: " + this.urlsImagenes.length);
                      this.cargar_imagen_database(archivo.titulo, archivo.tematica, this.urlsImagenes, imgKey);
                      resolve();
                    }
                    this.counter++;
                  }
              )
      }//FIN DE LA SUBIDA
      //FIN---pasar imagenes a la database, obteniendo URL generada
    });//FIN DE LA PROMESA
    return promesa;
  }//FIN DEL METODO

  private cargar_imagen_database(titulo: string, tematica: string, url: string[], imgKey: string){

      //IMPORTANTE: "galeria" es el nombre del objeto creado en la DB
      let currentDate = new Date();
      let fecha:string = currentDate.getDate()+'/'+(currentDate.getMonth() + 1)+'/'+currentDate.getFullYear();
      console.log("Fecha: " + fecha);
      let hora:string = currentDate.getHours().toString()+':'+ (currentDate.getMinutes()<10?'0':'').toString() +currentDate.getMinutes().toString();
      console.log("Hora: " + hora);
      //url.shift();
      let nuevaFoto:Archivo = {
        usuario: this.afAuth.auth.currentUser.email,
        titulo: titulo,
        fecha: fecha,
        hora: hora,
        img: url,
        tematica: tematica,
        key: imgKey //date in code
      }

      console.log(JSON.stringify(nuevaFoto));
      //this.afDB.list(`/galeria`).push(nuevaFoto); //--------------------------- subida sin especificar key
      this.afDB.object(`/galeria/${ imgKey }`).update(nuevaFoto); // --- subida especificando custom key

      //Asignacion del nuevo "post" al array IMAGENES
      //this.imagenes.push( nuevaFoto );
  }

  desuscribir(){
    this.destroy$.next();
    // Now let's also unsubscribe from the subject itself:
    this.destroy$.complete();
    console.log("Observables de provider desuscriptos");
  }

  mostrar_toast( mensaje:string ){
    this.toastCtrl.create({
      message: mensaje,
      duration: 3000
    }).present();
  }

}
