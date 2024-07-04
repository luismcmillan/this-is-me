function creating_chart_config(){
    var support_points = [];
    let amount_support_points = parseInt(document.getElementById('beer_amount').value);
    for(let i = 0; i < amount_support_points; i++){
        support_points.push(i);
    }
    result = adapting_reverse_sigmoid();
    console.log('MIAU'+result);
    let config = {type: 'line',
                
                data: {
                    labels: support_points,
                    datasets: [{
                        label: {
                        hidden : true
                        },
                        data: result,
                    }]
                },
                options: {
                    maintainAspectRatio: false,
                    layout:{
                        padding: 20
                    },
                    legend: {
                    
                        
                    },
                    scales: {
                        y: {
                            suggestedMin: parseInt(document.getElementById('y_offset').min),
                            suggestedMax: 15,
                            grid: {
                                display : false
                            },
                            title: {
                                display: true,
                                text: 'Whisky price'
                            }
                        },
                        x: {
                            grid: {
                                display : false
                            },
                            title: {
                                display: true,
                                text: 'Whisky per minute'
                            }
                        }
                    }
                }
            };
    return config;
}



function update_x_chart_axes(myChart){
    console.log(myChart.data.labels.length)
    console.log(parseInt(document.getElementById('beer_amount').value))
    let target_amount_support_points = parseInt(document.getElementById('beer_amount').value);
    let current_amount_support_points = myChart.data.labels.length;
    let difference = target_amount_support_points - current_amount_support_points;
    console.log(difference)
    if (difference > 0 ) {
        for(let i = current_amount_support_points; i < target_amount_support_points; i++){
            myChart.data.labels.push(i);
        }

    }else{
        for(let i = 0; i > difference; i--){
            myChart.data.labels.pop();
        }
    }
}

function update_y_chart_values(){
    if (document.getElementById('list-option-1').checked) {
        var result = adapting_reverse_sigmoid();
    }else if(document.getElementById('list-option-2').checked){
        var result = adapting_sigmoid();
    }else{
        var result = adapting_u_function();
    }
    let newData = {
        data: result,
        borderColor: 'rgb(54, 162, 235)',
        backgroundColor: 'rgba(54, 162, 235, 0.5)'
    }
    return newData;
}

function sigmoid(x){
    return Math.exp(x) / (Math.exp(x) + 1)
}

function adapting_reverse_sigmoid(){
    let amount_support_points = parseInt(document.getElementById('beer_amount').value);
    let x_scale = 10/amount_support_points;
    let y_scale = parseInt(document.getElementById('y_scale').value)/100;
    var result = [];
    for(let beer_amount = 0; beer_amount < amount_support_points; beer_amount++){
        let sample = (-y_scale)*sigmoid( x_scale*beer_amount - parseInt(document.getElementById('x_offset').value)) + 0.01*parseInt(document.getElementById('y_offset').value);
        result.push(sample)
    }
    return result;
}

function adapting_sigmoid(){
    let amount_support_points = parseInt(document.getElementById('beer_amount').value);
    let x_scale = 10/amount_support_points;
    let y_scale = parseInt(document.getElementById('y_scale').value)/100;
    var result = [];
    for(let beer_amount = 0; beer_amount < amount_support_points; beer_amount++){
        let sample = (y_scale)*sigmoid( x_scale*beer_amount - parseInt(document.getElementById('x_offset').value)) + 0.01*parseInt(document.getElementById('y_offset').value);
        result.push(sample)
    }
    return result;
}

function adapting_u_function(){
    let amount_support_points = parseInt(document.getElementById('beer_amount').value);
    let x_scale = 10/amount_support_points;
    let y_scale = parseInt(document.getElementById('y_scale').value)/100;
    var result = [];
    for(let beer_amount = 0; beer_amount < amount_support_points; beer_amount++){
        let sample = (y_scale)*sigmoid( x_scale*beer_amount - 3*parseInt(document.getElementById('x_offset').value))+(-y_scale)*sigmoid( x_scale*beer_amount - parseInt(document.getElementById('x_offset').value)) + 0.01*parseInt(document.getElementById('y_offset').value);
        result.push(sample)
    }
    return result;
}


    
            