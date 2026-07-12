document.addEventListener("DOMContentLoaded", function () {


/* =====================================================
   STATISTICS COUNTER ANIMATION
===================================================== */


const counters = document.querySelectorAll(".stat-number");


counters.forEach(function(counter){


    const target = Number(counter.innerText) || 0;


    const duration = 1200;


    const startTime = performance.now();



    function updateCounter(currentTime){


        const elapsed =
            currentTime - startTime;


        const progress =
            Math.min(elapsed / duration,1);



        const value =
            Math.floor(
                target * progress
            );



        counter.innerText = value;



        if(progress < 1){

            requestAnimationFrame(updateCounter);

        }
        else{

            counter.innerText = target;

        }


    }


    requestAnimationFrame(updateCounter);



});






/* =====================================================
   CHECK CHART.JS
===================================================== */


if(typeof Chart === "undefined"){

    console.warn("Chart.js not loaded");

    return;

}




/* =====================================================
   FLEET PERFORMANCE CHART
===================================================== */


const fleetCanvas =
document.getElementById(
    "fleetPerformanceChart"
);



if(fleetCanvas){



    new Chart(
        fleetCanvas,
        {

        type:"line",


        data:{


            labels:[
                "Vehicles",
                "Drivers",
                "Trips",
                "Maintenance",
                "Expenses"
            ],


            datasets:[

            {


            label:"Operations",


            data:[

                window.vehicleCount,
                window.driverCount,
                window.tripCount,
                window.maintenanceCount,
                window.expenseCount

            ],


            borderWidth:3,


            tension:0.4,


            fill:true


            }


            ]

        },


        options:{


            responsive:true,


            maintainAspectRatio:false,


            plugins:{


                legend:{
                    display:false
                }


            }


        }


    });



}







/* =====================================================
   VEHICLE STATUS DOUGHNUT
===================================================== */


const statusCanvas =
document.getElementById(
    "vehicleStatusChart"
);



if(statusCanvas){



new Chart(

statusCanvas,


{


type:"doughnut",



data:{


labels:[

"Available",
"Maintenance",
"In Transit"

],



datasets:[{


data:[


window.availableVehicles,

window.maintenanceVehicles,

window.otherVehicles


],

backgroundColor:[

"#16a34a",
"#f59e0b",
"#2563eb"

]

}]



},



options:{


responsive:true,


maintainAspectRatio:false,


cutout:"70%",


plugins:{


legend:{

display:false

}


}


}



}



);



}




});