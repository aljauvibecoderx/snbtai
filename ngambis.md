Pada tampilan live battle Ambis, khususnya bagian stimulus atau teks soal pada tampilan mobile, tidak terdapat pengaturan spacing (jarak) yang memadai antar elemen teks. Ini menciptakan beberapa masalah serius:

Kepadatan Visual Berlebihan (Overcrowded Layout)
Teks ditampilkan terlalu rapat tanpa padding dan line spacing yang cukup. Akibatnya, seluruh konten terlihat seperti satu blok padat tanpa struktur yang jelas.
Otak user dipaksa “menyaring sendiri” mana bagian penting, yang seharusnya sudah dibantu oleh UI.

Tidak Ada Hirarki Informasi yang Jelas
Elemen seperti

semuanya tampil hampir dengan jarak dan gaya yang seragam.
Hasilnya? Tidak ada pemisahan visual antar konteks informasi. User harus membaca ulang hanya untuk memahami “ini bagian apa sih?”

Minimnya White Space sebagai “Breathing Room”
UI yang baik itu bukan cuma soal warna atau font, tapi juga ruang kosong.
Di kasus ini, hampir tidak ada white space:

Antar paragraf terlalu dekat
Antar blok informasi tidak dipisahkan
Margin dalam container terlalu sempit

Ini membuat teks terasa “menekan” dan melelahkan untuk dibaca dalam waktu lama.

Kesulitan Parsing Informasi Kompleks
Untuk soal dengan format seperti:

Diskusi multi-speaker
Teks panjang
Argumentasi berlapis
Soal literasi

Tanpa spacing yang jelas, user akan:

Sulit membedakan siapa bicara apa
Kehilangan konteks antar paragraf
Lebih mudah salah memahami isi soal

Ini bukan cuma masalah estetika, tapi langsung berdampak ke akurasi menjawab.

Tidak Konsisten Antar Tipe Soal
Masalah ini tidak hanya terjadi pada satu jenis soal, tapi berpotensi muncul di semua tipe (thread, tabel, pernyataan, dll) karena:
Tidak adanya standar layout system untuk rendering konten
Semua tipe soal diperlakukan seperti teks biasa tanpa struktur visual khusus

Tidak Ada Adaptasi dari Struktur Data ke UI
Secara backend, data soal sebenarnya punya struktur:

metadata (author, date)
content
segmentasi pembicara

Tapi di UI, struktur ini “diratakan” jadi satu blok teks tanpa pemisahan visual.
Artinya: model data sudah benar, tapi representasi UI-nya gagal total.