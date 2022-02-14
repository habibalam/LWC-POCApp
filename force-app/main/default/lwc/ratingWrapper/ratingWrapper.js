import { LightningElement, wire } from 'lwc';
import getRating from '@salesforce/apex/AccountController.getRating';
export default class RatingWrapper extends LightningElement {

    
    chartConfig;

    @wire(getRating)
    wireRating({data, error})
    {
        if(data){
            let chartCountData = [];
            let chartRatingData = [];

            data.forEach(rt => 
            {
                chartCountData.push(rt.cnt);
                chartRatingData.push(rt.Rating);
            });

            this.chartConfig = {
                type: 'doughnut',
                data: {
                    datasets: [{
                        label: 'Number',
                        backgroundColor: ['rgb(255,99,132)',
                                          'rgb(255,159,64)',
                                          'rgb(255,205,86)',
                                          'rgb(75,192,192)',],
                        data: chartCountData
                    }],
                    labels : chartRatingData
                }
                
            }
        }
        else if(error)
        {
           this.error = error;
           this.data = undefined;
        }
    }

    


}