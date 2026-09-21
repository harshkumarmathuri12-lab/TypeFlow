const result =
JSON.parse(localStorage.getItem("typeflow_result"));

if(!result){
    location.href="index.html";
}

const $ = id => document.getElementById(id);

// ==========================
// Fill UI
// ==========================

$("wpm").textContent = result.wpm;
$("accuracy").textContent = result.accuracy + "%";
$("raw").textContent = result.raw;

$("characters").textContent =
`${result.correct}/${result.incorrect}/${result.extra}/${result.missed}`;

$("time").textContent = result.time + "s";

// ==========================
// Consistency
// ==========================

function consistency(arr){

    if(!arr || arr.length < 2) return 100;

    const avg =
    arr.reduce((a,b)=>a+b,0)/arr.length;

    const variance =
    arr.reduce((a,b)=>a+(b-avg)**2,0)/arr.length;

    const std = Math.sqrt(variance);

    return Math.max(
        0,
        Math.round(100-std)
    );

}

$("consistency").textContent =
consistency(result.graph)+"%";

// ==========================
// Error Points
// ==========================

const errorPoints =
(result.errorGraph || []).map((e,index)=>{

    if(e>0){
        return result.graph[index];
    }

    return null;

});

// ==========================
// Chart
// ==========================

const ctx =
document.getElementById("resultChart");

new Chart(ctx,{

    type:"line",

    data:{

        labels:
        result.graph.map((_,i)=>i+1),

        datasets:[

            {
                label:"Raw",
                data:result.rawGraph,
                borderColor:"#707070",
                borderWidth:2,
                pointRadius:0,
                tension:.35
            },

            {
                label:"WPM",
                data:result.graph,
                borderColor:"#e2b714",
                backgroundColor:"rgba(226,183,20,.12)",
                fill:true,
                borderWidth:3,
                pointRadius:2,
                pointHoverRadius:6,
                tension:.35
            },

            {
                label:"Errors",
                data:errorPoints,
                borderColor:"transparent",
                backgroundColor:"#ff5f5f",
                pointRadius:5,
                pointHoverRadius:7,
                showLine:false
            }

        ]

    },

    options:{

        responsive:true,

        maintainAspectRatio:false,

        interaction:{
            mode:"index",
            intersect:false
        },

        plugins:{

            legend:{
                display:false
            },

            tooltip:{

                backgroundColor:"#232428",

                borderColor:"#444",

                borderWidth:1,

                titleColor:"#e2b714",

                bodyColor:"#ffffff",

                displayColors:false,

                callbacks:{

                    title(items){
                        return "Second "+items[0].label;
                    },

                    label(item){

                        if(item.dataset.label==="Errors"){

                            return "Mistake";

                        }

                        return item.dataset.label+
                        ": "+
                        item.formattedValue;

                    }

                }

            }

        },

        scales:{

            x:{

                grid:{
                    color:"#333"
                },

                ticks:{
                    color:"#777"
                }

            },

            y:{

                beginAtZero:true,

                grid:{
                    color:"#333"
                },

                ticks:{
                    color:"#777"
                }

            }

        }

    }

});

// ==========================
// Buttons
// ==========================

function restart(){
    location.href="index.html";
}

function goHome(){
    location.href="index.html";
}

function leaderboard(){
    location.href="leaderboard.html";
}