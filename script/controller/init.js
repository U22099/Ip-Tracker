import { themeVar, themeA, themeB } from './theme.js';

export default class Controller {
  //Defining a constructor with the model and view class
  constructor(model, view) {
    this.model = model;
    this.view = view;
    //Theme Elements
    this.theme1 = this.view.getElement("theme1");
    this.theme2 = this.view.getElement("theme2");
    this.themeVar = themeVar;
    this.themeA = themeA;
    this.themeB = themeB
    //Access the button using view.getElement method
    this.btn = this.view.getElement("btn");
    //An array of output id
    this.output = [
      "ip",
      "hostname",
      "city",
      "region",
      "country",
      "latitude",
      "longitude",
      "org",
      "postal",
      "timezone",
    ];
  }

  //Init function to start up the running process
  async init() {
    //Display the loading placeholders
    this.load();
    //Fetch default ip from api
    const result = await this.model.fetch();
    //checks if the result is null if yes clear the output if result is bogon(local ip) display only ip address, else calls display function
    if (!result) {
      this.clear();
    } else if (result.bogon) {
      this.view.writeToDom("ip", result.ip);
    } else {
      this.display(result);
    }
    //Adds an event listener to the button to listen for a click event
    this.btn.addEventListener("click", async () => await this.run());
    //Adding event listener to the theme buttons
    this.theme1.addEventListener("click", ()=> this.changeTheme(1));
    this.theme2.addEventListener("click", ()=> this.changeTheme(2));
  }
  //funtion to run onclick of the button
  async run() {
    //Shows the loading placeholders
    this.load();
    //Retrieve ip from input box
    const ip = this.view.getFromDom("input");
    //Fetchs data from the api
    const result = await this.model.fetch(ip);
    //
    if (!result) {
      this.clear();
    } else if (result.bogon) {
      this.view.writeToDom("ip", result.ip);
    } else {
      this.display(result);
    }
  }

  display(result) {
    //clears previous map
    this.view.writeToDom("map", "")
    //Initalise the map passing in latitude and longitude as parameters
    this.model.map(result.latitude, result.longitude);
    //Loops throught the output id and write each result
    this.output.forEach((name) => {
      this.view.writeToDom(name, result[name]);
    });
  }

  //Load function to display loading placeholder
  load() {
    this.output.map((name) => {
      this.view.writeToDom(name, "Loading...");
    });
  }

  //Clears the output element
  clear() {
    this.output.map((name) => {
      this.view.writeToDom(name, "");
    });
  }
  
  //To change the pages Theme
  changeTheme(no){
    console.log("called")
    switch(no){
      case 1:
        for(let i = 0; i < this.themeVar.length; i++){
          this.view.changeCssVar(this.themeVar[i], this.themeA[i]);
        }
        break;
      case 2:
        for(let i = 0; i < this.themeVar.length; i++){
          this.view.changeCssVar(this.themeVar[i], this.themeB[i]);
        }
        break;
    }
  }
}