import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { BluetoothSerial } from '@awesome-cordova-plugins/bluetooth-serial/ngx';
import { AlertController, NavController } from '@ionic/angular';
import { $ } from 'protractor';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { pathToFileURL } from 'url';
import { bindCallback } from 'rxjs';



@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  debug: string;
  data: any;

  constructor(private bluetoothSerial: BluetoothSerial
    , private alertController: AlertController
    , private cdr: ChangeDetectorRef,
    private router: Router,
    public navCtrl: NavController) {
     this.getLayout();
 

  }


  ionViewWillEnter() {
    console.log("ionViewDidLoad");
    
  }


  input = [];
  rows = 0;
  cols = 0;

  getLayout() {
    this.bluetoothSerial.write('S') // Start the measurement
      .then((data) => {
        console.log("aaaaa what is data:[" + data + "]");
       // this.readData(); // Wait for results
  console.log("aaaaaaaaa in function readData");
    this.sleep(250);
    this.bluetoothSerial.available().then((numBytes) => {
      console.log("aaaaaaaaa numBytes availible: " + numBytes);
      this.bluetoothSerial.read()
        .then((recievedData) => {
          console.log("aaaaaaaaaaaaa recieved data this.data" + recievedData);

          var data = recievedData.split(',');
          console.log("aaaaaaaaaaaaa spliting data" + data);

          this.rows = data[0];
          this.cols = data[1];
          this.bluetoothSerial.clear();

          this.makeGrid();

        }).catch((data) => {
          console.log("aaaaaaaaa this is in the catch" + data)
        })
    });

      })
      .catch((e) => {
        console.log("aaaaaaaaaaaaaaa error in get layout ()") // Error alert
      });
  }

  htmlBT = "";

  readOk = false;

  // readData() {
  //   console.log("aaaaaaaaa in function readData");
  //   this.sleep(250);
  //   this.bluetoothSerial.available().then((numBytes) => {
  //     console.log("aaaaaaaaa numBytes availible: " + numBytes);
  //     this.bluetoothSerial.read()
  //       .then((recievedData) => {
  //         console.log("aaaaaaaaaaaaa recieved data this.data" + recievedData);

  //         var data = recievedData.split(',');
  //         console.log("aaaaaaaaaaaaa spliting data" + data);

  //         this.rows = data[0];
  //         this.cols = data[1];
  //         this.bluetoothSerial.clear();

  //         let row = document.getElementById("layout");
  //         this.htmlBT = ` <ion-card>
  //               <ion-card-content>
  //              <ion-item>rows: ${this.rows}</ion-item>
  //              <ion-item>cols: ${this.cols}</ion-item>
  //               </ion-card-content>
  //         </ion-card> `;
  //         row.innerHTML = this.htmlBT;

  //       }).catch((data) => {
  //         console.log("aaaaaaaaa this is in the catch" + data)
  //       })
  //   });
  // }

  path = [];

  i = 0;

 
  makeGrid() {

    console.log("aaaaaaaaaaaaaaa making grid")
    this.sleep(320);
    var totalButtons = this.rows * this.cols;
    this.path = [this.rows * this.cols];

    for(var u = 0; u < 9; u++ ){
        this.path[u] = 0;
    }
    
    let a = 0;
    var autoTimes;
    for(var u = 0; u < this.cols; u++){
      autoTimes += "auto ";
    }


    var navButtons = document.getElementById("layout2");
    navButtons.style.gridTemplateColumns = autoTimes;
    console.log(totalButtons);

    for (var b = 0; b < totalButtons; b++) {
      var button = document.createElement("button");
      button.setAttribute("id", "box" + b.toString());
      button.setAttribute("class", "btn");
      button.innerHTML = "Grip " + b;

      navButtons.appendChild(button);

        
        var firstOne = document.getElementById("box0");
              firstOne.style.backgroundColor = "#fa6400";
        this.path[0] = 30;      

      ///////////////////////////////////////
      button.addEventListener("click", event =>{
        //////////////////////////////////////////
        var button = event.target as Element;
        var btnNo = button.getAttribute("id");
        console.log("btn clicked, no: ");
        console.log(btnNo);
        let number = parseInt(btnNo.replace(/box/, ''));
        console.log(number);
    
        let boxik = <HTMLElement>document.getElementById(CSS.escape(btnNo))
    
        let elem = document.getElementById(btnNo);
        let compStyle = window.getComputedStyle(elem);
        let value = compStyle.getPropertyValue('background-color');
        console.log(value);

    
    
        if (value == "rgb(52, 113, 235)") { // add to path
        boxik.style.backgroundColor = "#fa6400"; // set to orange
        this.path[number] = 30+number;
          //write function in arduino light up diods
    console.log("aaaaaaaaaa sending");
  
    this.bluetoothSerial.write('C');
    this.sleep(400);
    this.bluetoothSerial.write("this"+number);
       
    console.log("aaaaaaaaaa sending number: "+number);

        } else
        {
        boxik.style.backgroundColor = "#3471eb";
        this.path[number] = 0;
        this.bluetoothSerial.write('Q');
        this.sleep(400);
        this.bluetoothSerial.write("this"+number);
    console.log("aaaaaaaaaa sending number: "+number);
        }
        
        console.log(this.path);
      } );  

    }

  }


  savePath(){
    this.bluetoothSerial.write('P');
    console.log("aaaaaaaaaa saving this path: "+this.path)
    this.rly();

  }

  sendPath(){
    var stringPath = this.path.toString();
    this.bluetoothSerial.write(stringPath); 
    this.getDiffi();
  }

  newPath(){
    this.bluetoothSerial.write('*');  
   

    let elems = document.getElementsByClassName('btn') as HTMLCollectionOf<HTMLElement>;
for (var i = 0; i < elems.length; ++i){
  if(elems[i] != null){
elems[i].style.backgroundColor = '#3471eb';
  }
  this.path[i] = 0;
}

var firstOne = document.getElementById("box0");
              firstOne.style.backgroundColor = "#fa6400";
        this.path[0] = 30;  
 

  }

  async rly(){
    const alert = await this.alertController.create({
      header: 'Save the Path?',
      buttons: [ 
      { text: "Confirm",      
      handler: data => {
          this.sendPath();
        }
      }],
      });
     await alert.present();
  }

  async getDiffi(){
    console.log("aaaaaa in get diffi");
    
  const alert = await this.alertController.create({
    header: 'Enter the path difficulty number and letter',
    inputs: [
      {
        name: "diffi",
        type: "text",
        placeholder: '4-9, a-c, -> for example 5b',
        attributes: {
          maxlength: 2
        }
      }],
    buttons: [ 
    { text: "Confirm",      
    handler: data => {
        this.sendDiff(data.diffi);
        // additional steps like pop() page etc
      }
    }],
     // cssClass: 'alertCustomCss'
    });
   await alert.present();
  
  }

  sendDiff(diff){
    this.bluetoothSerial.write(diff);
    console.log("aaaaaaaa diff number passed: " + diff);
    this.getName();
  }



  async getName(){
    console.log("aaaaaa in get name");
    
    const alert = await this.alertController.create({
      header: 'Enter the path name, max 18 chars',
      inputs: [
        {
          name: "pathName",
          type: "text",
          placeholder: 'path name here',
          attributes: {
            maxlength: 18
          }
        }],
      buttons: [ 
      { text: "Confirm",      
      handler: data => {
          this.sendName(data.pathName);
          // additional steps like pop() page etc
        }
      }],
       // cssClass: 'alertCustomCss'
      });
     await alert.present();
  }

  sendName(name){
     this.bluetoothSerial.write(name);
     console.log("aaaaaaaa name  passed: " + name);
   }






  sleep(milliseconds) {
    const date = Date.now();
    let currentDate = null;
    do {
      currentDate = Date.now();
    } while (currentDate - date < milliseconds);
  }

// savePath(event){

  //   var button = event.target as Element;
  //   var btnNo = button.getAttribute("id");
  //   console.log("btn clicked, no: ");
  //   console.log(btnNo);
  //   let number = parseInt(btnNo.replace(/box/, ''));
  //   console.log(number);

  //   let boxik = <HTMLElement>document.getElementById(CSS.escape(btnNo))

  //   var value = document.getElementById(btnNo).style.getPropertyValue("background");


  //   if (value == "rgb(250, 204, 37)") {
  //   console.log("I am yellow");
  //   boxik.style.background = "#d1d1d1";
  //   } else
  //   {
  //   console.log("wasnt yellow");
  //   boxik.style.background = "#facc25";
  //   console.log();
  //   }
    
  //   console.log(this.namee);
  // }

}

