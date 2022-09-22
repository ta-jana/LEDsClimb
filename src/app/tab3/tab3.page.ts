import { Component } from '@angular/core';
import { BluetoothSerial } from '@awesome-cordova-plugins/bluetooth-serial/ngx';
import { TextFieldTypes } from '@ionic/core';
import { AlertController } from '@ionic/angular';



@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {

  constructor(private bluetoothSerial: BluetoothSerial,
    public alertController: AlertController) {}

  goUp(){
    this.bluetoothSerial.write('U');
  }

  goDown(){
    this.bluetoothSerial.write('D');
  }

  goRight(){
    this.bluetoothSerial.write('R');
  }

  goLeft(){
    this.bluetoothSerial.write('L');
  }

  diodes = 0;

  addToPath(){
    this.bluetoothSerial.write('F');
    let row = document.getElementById("diods");
    this.diodes += 1;
    let html = `
         <ion-item>diods in path: ${this.diodes}</ion-item>
   `;
    row.innerHTML = html;
  }

  savePath(){
    console.log("aaaaaa save path clicked");
    this.bluetoothSerial.write('E');
    this.getDiffi();
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

   newPath(){
    this.bluetoothSerial.write('*');
    this.diodes = 0;
    let row = document.getElementById("diods");
    let html = `
         <ion-item>diods in path: ${this.diodes}</ion-item>
   `;
    row.innerHTML = html;
    
  }
 
  

}
