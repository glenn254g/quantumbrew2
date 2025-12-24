/* ===== EDIT THESE LINKS ===== */
const GROUP_LINK = "https://t.me/YOUR_GROUP";
const ADMIN_LINK = "https://t.me/YOUR_USERNAME";

/* ===== FIREBASE CONFIG ===== */
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_DOMAIN",
  projectId: "YOUR_PROJECT_ID"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

/* ===== GLOBALS ===== */
const TARGET = 1000;
let registered = 0;

/* ===== NOTICE POPUP ===== */
window.onload = () => {
  if(!sessionStorage.getItem("noticeSeen")){
    document.getElementById("notice").style.display = "flex";
  }
};

function closeNotice(){
  document.getElementById("notice").style.display = "none";
  sessionStorage.setItem("noticeSeen","true");
}

/* ===== UI ===== */
function updateUI(){
  document.getElementById("registered").innerText = registered;
  document.getElementById("remaining").innerText = TARGET - registered;

  let percent = Math.floor((registered / TARGET) * 100);
  document.getElementById("percent").innerText = percent + "%";

  let offset = 339 - (339 * percent / 100);
  document.getElementById("progressCircle").style.strokeDashoffset = offset;

  if(registered >= TARGET){
    document.getElementById("downloadBtn").style.display = "block";
  }
}

/* ===== LOAD LIVE DATA ===== */
db.collection("stats").doc("counter").onSnapshot(doc=>{
  if(doc.exists){
    registered = doc.data().registered;
    updateUI();
  }else{
    db.collection("stats").doc("counter").set({registered:0});
  }
});

/* ===== SUBMIT CONTACT ===== */
function submitContact(){
  const name = document.getElementById("name").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const msg = document.getElementById("message");

  if(!name || !phone){
    msg.style.color="red";
    msg.innerText="Fill all fields";
    return;
  }

  db.collection("contacts").doc(phone).get().then(doc=>{
    if(doc.exists){
      msg.style.color="red";
      msg.innerText="Contact already verified";
    }else{
      db.collection("contacts").doc(phone).set({
        name, phone, time:Date.now()
      });

      db.collection("stats").doc("counter")
        .update({registered: firebase.firestore.FieldValue.increment(1)});

      msg.style.color="#00ff6a";
      msg.innerText="Contact submitted successfully .. vcf file will drop in our group";

      setTimeout(()=>window.location.href=GROUP_LINK,2000);
    }
  });
}

/* ===== BUTTONS ===== */
function contactAdmin(){ window.location.href = ADMIN_LINK; }
function joinGroup(){ window.location.href = GROUP_LINK; }

/* ===== VCF ===== */
function downloadVCF(){
  db.collection("contacts").get().then(snapshot=>{
    let vcf="";
    snapshot.forEach(doc=>{
      const c=doc.data();
      vcf+=BEGIN:VCARD
VERSION:3.0
FN:${c.name}
TEL:${c.phone}
END:VCARD
;
    });
    const blob=new Blob([vcf],{type:"text/vcard"});
    const a=document.createElement("a");
    a.href=URL.createObjectURL(blob);
    a.download="QuantumVCF.vcf";
    a.click();
  });
}
