import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDoc,
  getDocs,
  deleteDoc,
  doc,
  query,
  orderBy,
  updateDoc
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBcym1i4oAyM2rFmBU_Ipa0vcC7Pdz0dws",
  authDomain: "insan-cemerlang-2e18f.firebaseapp.com",
  projectId: "insan-cemerlang-2e18f",
  storageBucket: "insan-cemerlang-2e18f.appspot.com",
  messagingSenderId: "1096016420480",
  appId: "1:1096016420480:web:87611389fc765e7ddbd065",
  measurementId: "G-DW23S2DXCR"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export async function ambildaftartugas() {
  const refDokumen = collection(db, "to-di-list");
  const kueri = query(refDokumen, orderBy("tugas"));
  const cuplikankueri = await getDocs(kueri);

  let hasil = [];
  cuplikankueri.forEach((dok) => {
    hasil.push({
      id: dok.id,
      tugas: dok.data().tugas,
      status: dok.data().status,
      prioritas: dok.data().prioritas,
      tanggal: dok.data().tanggal,
    });
  });

  return hasil;
}

export async function tambahtugas(tugas, status, prioritas, tanggal) {
  try {
    const dokRef = await addDoc(collection(db, 'to-di-list'), {
      tugas: tugas,
      status: status,
      prioritas: prioritas,
      tanggal: tanggal,
    });
    console.log('berhasil menembah tugas ' + dokRef.id);
  } catch (e) {
    console.log('gagal menambah tugas ' + e);
  }
}

export async function hapustugas(docId) {
  await deleteDoc(doc(db, "to-di-list", docId));
}

export async function ubahtugas(docId, tugas, status, prioritas, tanggal) {
  await updateDoc(doc(db, "to-di-list", docId), {
    tugas: tugas,
    status: status,
    prioritas: prioritas,
    tanggal: tanggal,
  });
}

export async function ambiltugas(docId) {
  const docRef = await doc(db, "to-di-list", docId);
  const docSnap = await getDoc(docRef);

  return await docSnap.data();
}

function ubahStatus(tombol) {
  let status = tombol.dataset.status;

  if (status === "Selesai") {
    tombol.textContent = "Belum Selesai";
    tombol.dataset.status = "Belum Selesai";
  } else {
    tombol.textContent = "Selesai";
    tombol.dataset.status = "Selesai";
  }
}


$(document).ready(async function () {
  let elemenDaftar = $("#daftar-tugas > thead");
  let daftartugas = await ambildaftartugas();
  let nomor = 1;

  daftartugas.forEach((data) => {
    elemenDaftar.append(
      `<tr>
        <th>${nomor}</th>
        <td>${data.tugas}</td>
        <td>
          <button class="btn-status" data-status="${data.status}" data-id="${data.id}">${data.status}</button>
        </td>
        <td>${data.prioritas}</td>
        <td>${data.tanggal}</td>
        <td><button class="btn btn-warning ubah" data-id="${data.id}">Ubah</button></td>
        <td><a href="#" class="btn btn-danger tombol-hapus" data-id="${data.id}">Hapus</a></td>
      </tr>`
    );
    nomor++;
  });

  // Event listener untuk hapus tugas
  $(".tombol-hapus").click(async function () {
    await hapustugas($(this).attr("data-id"));
    location.reload();
  });

  // Event listener untuk ubah tugas
  $(".ubah").click(async function () {
    window.location.replace("ubahtugas.html?docId=" + $(this).attr("data-id"));
  });
});

// Gunakan event delegation agar berfungsi pada elemen dinamis
$(document).on("click", ".btn-status", function () {
  let tugasId = $(this).attr("data-id");
  let statusSekarang = $(this).attr("data-status");
  let statusBaru;

  if (statusSekarang === "Belum Selesai") {
    statusBaru = "Sedang Dikerjakan";
  } else if (statusSekarang === "Sedang Dikerjakan") {
    statusBaru = "Selesai";
  } else {
    statusBaru = "Belum Selesai";
  }

  // Update tampilan tombol
  $(this).attr("data-status", statusBaru);
  $(this).text(statusBaru);
  updateWarnaStatus($(this), statusBaru);

  // Tambahkan kode AJAX jika ingin menyimpan perubahan status ke database
  console.log(`Status tugas ID ${tugasId} diubah menjadi ${statusBaru}`);
});

// Fungsi untuk memperbarui warna tombol berdasarkan status
function updateWarnaStatus(button, status) {
  if (status === "Belum Selesai") {
    button.css("background-color", "#dc3545").css("color", "white");
  } else if (status === "Sedang Dikerjakan") {
    button.css("background-color", "#ffc107").css("color", "black");
  } else {
    button.css("background-color", "#28a745").css("color", "white");
  }
}

// Atur warna status setelah halaman dimuat
$(document).ready(function () {
  $(".btn-status").each(function () {
    updateWarnaStatus($(this), $(this).attr("data-status"));
  });
});
