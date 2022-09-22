import { Component } from '@angular/core';
import { BluetoothSerial } from '@awesome-cordova-plugins/bluetooth-serial/ngx';
import { AlertController } from '@ionic/angular';
import { NgZone } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {


  htmlBT = "";

  Devices 
  constructor(private bluetoothSerial: BluetoothSerial,
     private alertController:AlertController,
      private ngZone: NgZone,
      private router: Router) {
      }

      
    isBTConnected(){
      console.log("isBTConnected()");
       this.bluetoothSerial.isConnected().then(response => {
        console.log("isConnected");
        let row = document.getElementById("cntBluetooth");
        this.htmlBT = ` <ion-card>
        <ion-card-content>
       <ion-item>You are connected!</ion-item>
       <ion-button (click)="disconnectBT">Disconnect</ion-button>
        </ion-card-content>
  </ion-card> `;
      console.log("inside new html",this.htmlBT);
      row.innerHTML = this.htmlBT;
      return this.htmlBT;
      },
      error=>{
        console.log("Bluetooth is *not* connected");
      }
  );
    }
    
 
  activeBluetooth(){ ////////////////////////////////////////// write alert that bluetooth is off
    this.bluetoothSerial.isEnabled().then(response => {
     // console.log("isOn");
      this.Listdevices()
    }, async error=>{
      console.log("BT isOff");
      const alert = await this.alertController.create({
        header: 'Please check that your Bluetooth is turned on, and that you have paired the bluetooth device LEDsClimb',
        buttons: [ 
        { text: "Ok",      
        }],
         // cssClass: 'alertCustomCss'
        });
       await alert.present();
    })
  }

  Listdevices(){
    this.bluetoothSerial.list().then(response=>{
      this.Devices = response
    }, error=>{
      console.log("error in listing devices")
    })
  }

  Connect(adress){
    console.log("connecting to address", adress)
    this.bluetoothSerial.connect(adress).subscribe(success=>{
      console.log("success => connecting to address", adress);
      this.deviceConnected();
      this.isBTConnected();
    }, error => {
      console.log("error in connecting to adress")
      console.log("address", adress)
    })
  }

  deviceConnected(){
    this.bluetoothSerial.subscribe('/n').subscribe(success=>{
      this.handler(success)
    })
  }

  handler(value){
    console.log(value)
  }

  setData(){
    this.bluetoothSerial.write("7").then(response=>{
      console.log("okay")
    }, error =>{
      console.log("problem")
    })
  }

  disconnectBT(){
    this.bluetoothSerial.disconnect()
    console.log("device disconnected")
  }

  async isEnabled(msg){
    const alert = await this.alertController.create({
      header:'Alert',
      message:msg,
      buttons:[{
        text:'aaa Okay',
        handler: () => {
          console.log(" okay")
        }
      }]
    })
  }

  RedirectToPage2() {
    this.router.navigateByUrl('/tabs/tab2');
  }

}
