/* ===== LINKS ===== */
const GROUP_LINK = "https://t.me/betfitystakers";
const ADMIN_LINK = "https://t.me/prince101g";

/* ===== GLOBALS ===== */
const TARGET = 1000;
let registered = 0;

/* ===== NOTICE POPUP ===== */
window.onload = () => {
  const notice = document.getElementById("notice");
  if(notice && !sessionStorage.getItem("noticeSeen")){
    notice.style.display = "flex";
  }
};

function closeNotice(){
  const notice = document.getElementById("notice");
  if(notice) notice.style.display = "none";
  sessionStorage.setItem("noticeSeen","true");
}

/* ===== UI ===== */
function updateUI(){
  const regEl = document.getElementById("registered");
  const remEl = document.getElementById("remaining");
  const percentEl = document.getElementById("percent");
  const progEl = document.getElementById("progressCircle");
  const downloadBtn = document.getElementById("downloadBtn");

  if(regEl) regEl.innerText = registered;
  if(remEl) remEl.innerText = TARGET - registered;

  let percent = Math.floor((registered / TARGET) * 100);
  if(percentEl) percentEl.innerText = percent + "%";

  if(progEl) {
    let offset = 339 - (339 * percent / 100);
    progEl.style.strokeDashoffset = offset;
  }

  if(downloadBtn && registered >= TARGET){
    downloadBtn.style.display = "block";
  }
}

/* ===== SUBMIT CONTACT ===== */
function submitContact(){
  const name = document.getElementById("name")?.value.trim();
  const phone = document.getElementById("phone")?.value.trim();
  const msg = document.getElementById("message");

  if(!name || !phone){
    if(msg){
      msg.style.color="red";
      msg.innerText="Fill all fields";
    }
    return;
  }

  // Mock adding contact for testing
  registered++;
  updateUI();
  if(msg){
    msg.style.color="#00ff6a";
    msg.innerText="Contact submitted successfully (test mode)";
  }
}

/* ===== BUTTONS ===== */
function contactAdmin(){ window.location.href = ADMIN_LINK; }
function joinGroup(){ window.location.href = GROUP_LINK; }

/* ===== VCF ===== */
function downloadVCF(){
  // Mock VCF for testing
  const vcf = BEGIN:VCARD
VERSION:3.0
FN:Test User
TEL:+254700000000
END:VCARD
;
  const blob = new Blob([vcf], {type:"text/vcard"});
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "QuantumVCF.vcf";
  a.click();
}
