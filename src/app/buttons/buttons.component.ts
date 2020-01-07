import { Component, OnInit } from '@angular/core';

class Hospital {
  constructor(public country: string, public name: string, public gps: string, public town: string) {}
}

@Component({
  selector: 'app-buttons',
  templateUrl: './buttons.component.html',
  styleUrls: ['./buttons.component.css']
})
export class ButtonsComponent implements OnInit {

  position = {
    country: 'Rwanda',
    gps: '12°07N'
  };

  searchQuery;
  availableHospitals: Hospital[] = [
    new Hospital('Iran', 'Emam Khomeini', '12121', 'Karaj'),
    new Hospital('alman', 'pokhpusur', '2345', 'freiburg')
  ];

  constructor() { }

  ngOnInit() {
  }

  setPosition() {
    this.availableHospitals.filter(hospital =>
      [hospital.country, hospital.town, hospital.name, `${hospital.name}, ${hospital.town}`]
        .map(option => option.toLowerCase())
        .includes(this.searchQuery.toLowerCase()))
      .forEach(hospital => {
        this.position = hospital;
        this.searchQuery = `${hospital.name}, ${hospital.town}`;
      });
  }
}
