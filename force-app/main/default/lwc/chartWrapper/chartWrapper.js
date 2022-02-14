import { LightningElement,track,wire } from 'lwc';
import getOpportunities from '@salesforce/apex/AccountController.getOpportunities';
export default class ChartWrapper extends LightningElement {

    @track error;
    chartConfig;
    @wire(getOpportunities)
    wiredOpportunities({ data, error })
    {
        if (data) {
            let chartCountData = [];
            let chartStageData = [];

            data.forEach(opp =>
            {
                chartCountData.push(opp.Total);
                chartStageData.push(opp.StageName);
            });

            this.chartConfig = {
                type: 'pie',
                data: {
                    datasets: [{
                        label: 'Number',
                        backgroundColor: ['green','yellow','red','grey','orange','blue'],
                        data: chartCountData
                    }],
                    labels : chartStageData
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