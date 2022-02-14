import { LightningElement,api} from 'lwc';
import { loadScript } from 'lightning/platformResourceLoader';
import chartjs from '@salesforce/resourceUrl/ChartJS';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';


export default class PieChart extends LightningElement {


    @api chartConfig;
    chart;
    renderedCallback()
    {
        loadScript(this, chartjs).then(() =>
        {
            const ctx = this.template.querySelector('.myChart').getContext('2d');
            this.chart = new window.Chart(ctx, JSON.parse(JSON.stringify(this.chartConfig)));
        }).catch(error =>
        {
            this.dispatchEvent(new ShowToastEvent({
                title: 'Error Loading Chart',
                message: error.body.message,
                variant: 'error'
            }));
        });
    }


}