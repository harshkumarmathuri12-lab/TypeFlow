const body = document.getElementById("leaderboardBody");

const searchInput = document.getElementById("searchInput");

const globalTab = document.getElementById("globalTab");
const localTab = document.getElementById("localTab");

let globalScores = [];
let localScores = [];
let current = "global";

// =======================
// Rank Medal
// =======================

function medal(rank){

    if(rank===1) return "🥇";
    if(rank===2) return "🥈";
    if(rank===3) return "🥉";

    return "#"+rank;

}

// =======================
// Render
// =======================

function render(data){

    body.innerHTML="";

    const search =
    searchInput.value.toLowerCase();

    data
    .filter(item=>
        item.name.toLowerCase().includes(search)
    )
    .forEach((item,index)=>{

        body.innerHTML += `

        <tr>

            <td>${medal(index+1)}</td>

            <td>

                <div style="
                    display:flex;
                    align-items:center;
                    gap:10px;
                    justify-content:center;
                ">

                    <img
                    src="${item.photo}"
                    width="36"
                    height="36"
                    style="
                    border-radius:50%;
                    object-fit:cover;
                    ">

                    ${item.name}

                </div>

            </td>

            <td style="
                color:#e2b714;
                font-weight:bold;
            ">
                ${item.wpm}
            </td>

            <td>${item.accuracy}%</td>

        </tr>

        `;

    });

}

// =======================
// Global Firestore
// =======================

async function loadGlobal(){

    const snap = await db
    .collection("scores")
    .orderBy("wpm","desc")
    .get();

    const best = {};

    snap.forEach(doc=>{

        const s = doc.data();

        if(
            !best[s.uid] ||
            s.wpm > best[s.uid].wpm
        ){

            best[s.uid]={
                name:s.name,
                photo:s.photo,
                wpm:s.wpm,
                accuracy:s.accuracy
            };

        }

    });

    globalScores =
    Object.values(best)
    .sort((a,b)=>b.wpm-a.wpm);

    if(current==="global"){

        render(globalScores);

    }

}

// =======================
// Local History
// =======================

function loadLocal(){

    const history =
    JSON.parse(localStorage.getItem("typeflow_history"))
    ||[];

    localScores =
    history.map((h,i)=>({

        name:"You",

        photo:"https://ui-avatars.com/api/?name=You",

        wpm:h.wpm,

        accuracy:h.accuracy

    }))
    .sort((a,b)=>b.wpm-a.wpm);

    if(current==="local"){

        render(localScores);

    }

}

// =======================
// Search
// =======================

searchInput.oninput=()=>{

    render(
        current==="global"
        ?globalScores
        :localScores
    );

};

// =======================
// Tabs
// =======================

globalTab.onclick=()=>{

    current="global";

    globalTab.classList.add("active");
    localTab.classList.remove("active");

    render(globalScores);

};

localTab.onclick=()=>{

    current="local";

    localTab.classList.add("active");
    globalTab.classList.remove("active");

    render(localScores);

};

// =======================

function goHome(){

    location.href="index.html";

}

// =======================

loadGlobal();

loadLocal();