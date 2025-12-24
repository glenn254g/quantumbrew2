/* ===== EDITED LINKS ===== */
const GROUP_LINK = "https://t.me/betfitystakers";
const ADMIN_LINK = "https://t.me/prince101g";

/* ===== FIREBASE CONFIG ===== */
const firebaseConfig = {
  apiKey: "AIzaSyD4kZ-JQxDpJnOwEZNGw1nOGqAB00c4PWI",
  authDomain: "quantum2-14b5c.firebaseapp.com",
  projectId: "quantum2-14b5c",
  storageBucket: "quantum2-14b5c.firebasestorage.app",
  messagingSenderId: "86203874626",
  appId: "1:86203874626:web:82285dffffb92715e75cdb"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

/* ===== GLOBALS ===== */
const TARGET = 1000;
let registered = 0;

/* ===== NOTICE POPUP ===== */
window.onload = () => {
  const notice = document.getElementById("notice");
  if (notice && !sessionStorage.getItem("noticeSeen")) {
    notice.style.display = "flex";
  }
};

function closeNotice() {
  const notice = document.getElementById("notice");
  if (notice) notice.style.display = "none";
  sessionStorage.setItem("noticeSeen", "true");
}

/* ===== UI ===== */
function updateUI() {
  const regEl = document.getElementById("registered");
  const remEl = document.getElementById("remaining");
  const percentEl = document.getElementById("percent");
  const progEl = document.getElementById("progressCircle");
  const downloadBtn = document.getElementById("downloadBtn");

  if (regEl) regEl.innerText = registered;
  if (remEl) remEl.innerText = TARGET - registered;

  let percent = Math.floor((registered / TARGET) * 100);
  if (percentEl) percentEl.innerText = percent + "%";

  if (progEl) {
    let offset = 339 - (339 * percent / 100);
    progEl.style.strokeDashoffset = offset;
  }

  if (downloadBtn && registered >= TARGET) {
    downloadBtn.style.display = "block";
  }
}

/* ===== LOAD LIVE DATA ===== */
db.collection("stats").doc("counter").onSnapshot(doc => {
  if (doc.exists && typeof doc.data().registered === "number") {
    registered = doc.data().registered;
  } else {
    registered = 0;
    db.collection("stats").doc("counter").set({ registered: 0 });
  }
  updateUI();
});

/* ===== SUBMIT CONTACT ===== */
function submitContact() {
  const name = document.getElementById("name")?.value.trim();
  const phone = document.getElementById("phone")?.value.trim();
  const msg = document.getElementById("message");

  if (!name || !phone) {
    if (msg) {
      msg.style.color = "red";
      msg.innerText = "Fill all fields";
    }
    return;
  }

  db.collection("contacts").doc(phone).get().then(doc => {
    if (doc.exists) {
      if (msg) {
        msg.style.color = "red";
        msg.innerText = "Contact already verified";
      }
    } else {
      db.collection("contacts").doc(phone).set({
        name,
        phone,
        time: Date.now()
      });

      db.collection("stats").doc("counter")
        .update({
          registered: firebase.firestore.FieldValue.increment(1)
        });

      if (msg) {
        msg.style.color = "#00ff6a";
        msg.innerText =
          "Contact submitted successfully .. vcf file will drop in our group";
      }

      setTimeout(() => window.location.href = GROUP_LINK, 2000);
    }
  });
}

/* ===== BUTTONS ===== */
function contactAdmin() {
  window.location.href = ADMIN_LINK;
}

function joinGroup() {
  window.location.href = GROUP_LINK;
}

/* ===== VCF ===== */
function downloadVCF() {
  db.collection("contacts").get().then(snapshot => {
    let vcf = "";

    snapshot.forEach(doc => {
      const c = doc.data();
      vcf += BEGIN:VCARD
VERSION:3.0
FN:${c.name}
TEL:${c.phone}
END:VCARD
;
    });

    const blob = new Blob([vcf], { type: "text/vcard" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "QuantumVCF.vcf";
    a.click();
  });
}
