import { LightningElement } from 'lwc';

export default class ForEachloop extends LightningElement {

    students =[ 
          {
              Id:'001',
              Name:'Ravi',
              class :'JAVA',
              Fee:5000,
          },  

          {
            Id:'002',
            Name:'Mukul',
            class :'Hibernate',
            Fee:1500,
        },  

        {
            Id:'003',
            Name:'Aftab',
            class :'Spring',
            Fee:5000,
        },  

        {
            Id:'004',
            Name:'Ranjan',
            class :'JAVA',
            Fee:5000,
        },  

        {
            Id:'005',
            Name:'Sabir',
            class :'JAVA',
            Fee:3000,
        },  

        {
            Id:'006',
            Name:'Aftab',
            class : 'HTML',
            Fee:2000,
        }  
    ];
}