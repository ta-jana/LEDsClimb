import { Component, OnInit } from '@angular/core';
import { BluetoothSerial } from '@awesome-cordova-plugins/bluetooth-serial/ngx';


@Component({
  selector: 'app-tab4',
  templateUrl: 'tab4.page.html',
  styleUrls: ['tab4.page.scss']
})
export class Tab4Page{

  constructor(private bluetoothSerial: BluetoothSerial)
    {
      this.getMenu();
    }

 

  getMenu(){
    this.bluetoothSerial.write('A').then((data) => {
      console.log("aaaaa what is data:[" + data + "]");
      this.showMenu(); // Wait for results
    })
    .catch((e) => {
      console.log("aaaaaaaaaaaaaaa error in get menu()") // Error alert
    });
  }

  showMenu(){
    console.log("aaaaaaaaa in function showMenu");
    this.sleep(400);
    this.bluetoothSerial.available().then((numBytes) => {
      console.log("aaaaaaaaa numBytes availible: " + numBytes);
      this.bluetoothSerial.read()
        .then((recievedData) => {
          console.log("aaaaaaaaaaaaa recieved data this.data" + recievedData);

          var data = recievedData.split(',');
          console.log("aaaaaaaaaaaaa spliting data" + data);

          var name = data[0];
          var diffi = data[1];
          this.bluetoothSerial.clear();

          let row = document.getElementById("path");
          let html = ` <ion-card>
                <ion-card-content>
               <ion-item>name: ${name}</ion-item>
               <ion-item>difficulty: ${diffi}</ion-item>
                </ion-card-content>
          </ion-card> `;
          row.innerHTML = html;

        }).catch((data) => {
          console.log("aaaaaaaaa this is in the catch" + data)
        })
    });

  }

  nextPath(){
    this.bluetoothSerial.write('B').then((data) => {
      console.log("aaaaa what is data:[" + data + "]");
      this.showPath(); // Wait for results
    })
    .catch((e) => {
      console.log("aaaaaaaaaaaaaaa error in get layout ()") // Error alert
    });
  }

  showPath(){
    console.log("aaaaaaaaa in function showMenu");
    this.sleep(400);
    this.bluetoothSerial.available().then((numBytes) => {
      console.log("aaaaaaaaa numBytes availible: " + numBytes);
      this.bluetoothSerial.read()
        .then((recievedData) => {
          console.log("aaaaaaaaaaaaa recieved data this.data" + recievedData);

          var data = recievedData.split(',');
          console.log("aaaaaaaaaaaaa spliting data" + data);

          var name = data[0];
          var diffi = data[1];
          this.bluetoothSerial.clear();

          let row = document.getElementById("path");
          let html = ` <ion-card>
                <ion-card-content>
               <ion-item>name: ${name}</ion-item>
               <ion-item>difficulty: ${diffi}</ion-item>
                </ion-card-content>
          </ion-card> `;
          row.innerHTML = html;

        }).catch((data) => {
          console.log("aaaaaaaaa this is in the catch" + data)
        })
    });

  }

  sleep(milliseconds) {
    const date = Date.now();
    let currentDate = null;
    do {
      currentDate = Date.now();
    } while (currentDate - date < milliseconds);
  }

}
