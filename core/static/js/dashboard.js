document.addEventListener("DOMContentLoaded", function () {


/* =====================================================
   STATISTICS COUNTER ANIMATION
===================================================== */

const counters = document.querySelectorAll(".stat-number");


counters.forEach(function (counter) {

    const target = Number(counter.dataset.target) || 0;

    const duration = 1200;

    const startTime = performance.now();


    function updateCounter(currentTime) {

        const elapsedTime = currentTime - startTime;

        const progress = Math.min(
            elapsedTime / duration,
            1
        );


        const easedProgress =
            1 - Math.pow(1 - progress, 3);


        const currentValue =
            Math.floor(target * easedProgress);


        counter.textContent = currentValue;


        if (progress < 1) {

            requestAnimationFrame(updateCounter);

        } else {

            counter.textContent = target;

        }

    }


    requestAnimationFrame(updateCounter);

});



/* =====================================================
   CHECK CHART.JS
===================================================== */

if (typeof Chart === "undefined") {

    console.warn(
        "Chart.js is not loaded."
    );

    return;

}



/* =====================================================
   GLOBAL CHART SETTINGS
===================================================== */

Chart.defaults.font.family =
    "Inter, sans-serif";


Chart.defaults.color =
    "#64748b";



/* =====================================================
   FLEET PERFORMANCE CHART
===================================================== */

const fleetCanvas =
    document.getElementById(
        "fleetPerformanceChart"
    );


if (fleetCanvas) {


    const ctx =
        fleetCanvas.getContext("2d");


    const gradient =
        ctx.createLinearGradient(
            0,
            0,
            0,
            300
        );


    gradient.addColorStop(
        0,
        "rgba(37,99,235,0.30)"
    );


    gradient.addColorStop(
        1,
        "rgba(37,99,235,0.02)"
    );



    new Chart(ctx, {


        type: "line",


        data: {


            labels: [
                "Mon",
                "Tue",
                "Wed",
                "Thu",
                "Fri",
                "Sat",
                "Sun"
            ],


            datasets: [

                {

                    label:
                    "Active Vehicles",


                    data: [
                        82,
                        96,
                        91,
                        110,
                        104,
                        121,
                        128
                    ],


                    borderColor:
                    "#2563eb",


                    backgroundColor:
                    gradient,


                    borderWidth: 3,


                    fill: true,


                    tension: 0.4,


                    pointRadius: 4,


                    pointHoverRadius: 6,


                    pointBackgroundColor:
                    "#ffffff",


                    pointBorderColor:
                    "#2563eb",


                    pointBorderWidth: 2

                }

            ]

        },


        options: {


            responsive: true,


            maintainAspectRatio: false,


            plugins: {


                legend: {

                    display: false

                },


                tooltip: {


                    backgroundColor:
                    "#0f172a",


                    padding: 12,


                    cornerRadius: 8,


                    displayColors: false

                }

            },


            scales: {


                x: {


                    grid: {

                        display:false

                    },


                    border: {

                        display:false

                    }

                },


                y: {


                    beginAtZero:true,


                    suggestedMax:150,


                    grid: {

                        color:"#e2e8f0"

                    },


                    border: {

                        display:false

                    }

                }


            }


        }


    });


}



/* =====================================================
   VEHICLE STATUS DOUGHNUT CHART
===================================================== */


const statusCanvas =
    document.getElementById(
        "vehicleStatusChart"
    );


if (statusCanvas) {


    new Chart(statusCanvas, {


        type:"doughnut",


        data:{


            labels:[

                "Active",
                "Available",
                "Maintenance"

            ],


            datasets:[


                {


                    data:[

                        128,
                        42,
                        16

                    ],


                    backgroundColor:[

                        "#2563eb",
                        "#16a34a",
                        "#f59e0b"

                    ],


                    borderColor:
                    "#ffffff",


                    borderWidth:4,


                    hoverOffset:6


                }


            ]

        },


        options:{


            responsive:true,


            maintainAspectRatio:false,


            cutout:"70%",


            plugins:{


                legend:{

                    display:false

                },


                tooltip:{


                    backgroundColor:
                    "#0f172a",


                    padding:12,


                    cornerRadius:8


                }


            }


        }


    });


}



});