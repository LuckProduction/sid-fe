export const dummySektor = Array.from({ length: 10 }, (_, index) => ({
  _id: (index + 1).toString(),
  name: index === 1 ? 'filter' : 'dummy'
}));

export const dummyResidentStatistic = {
  code: 200,
  status: true,
  message: 'Data statistik penduduk',
  data: {
    penduduk: {
      jumlah_penduduk: 100,
      jumlah_kepala_keluarga: 20,
      jumlah_perempuan: 42,
      jumlah_laki_laki: 58
    },
    umur: [
      {
        kategori_umur: 'Remaja',
        jumlah: 10
      },
      {
        kategori_umur: 'Anak Anak',
        jumlah: 10
      }
    ],
    pendidikan: [
      {
        pendidikan_sedang_ditempuh: 'S1',
        jumlah: 29
      }
    ],
    pekerjaan: [
      {
        pekerjaan: 'Wirausaha',
        jumlah: 100
      }
    ],
    agama: [
      {
        agama: 'Hindu',
        jumlah: 25
      }
    ],
    status_perkawinan: [
      {
        status_perkawinan: 'telah menikah',
        jumlah: 40
      }
    ],
    dusun: [
      {
        nama_dusun: 'Semanggi',
        jumlah: 29
      }
    ]
  }
};

export const dummyApbdStatistic = {
  code: 200,
  status: true,
  message: 'Data statistik apbd',
  data: {
    perTahun: {
      belanja: 50000000,
      pendapatan: 990000000,
      defisit: 940000000,
      pengeluaran: 30000000,
      pembiayaan: 30000000,
      sisa_pembiayaan: 0
    },
    semua: [
      {
        id: 1,
        nama_laporan: 'laporan apbd tahun 2025',
        tahun: '2025',
        belanja_pendapatan: {
          belanja: 50000000,
          pendapatan: 990000000
        },
        pembiayaan: {
          pembiayaan: 30000000,
          pengeluaran: 30000000
        }
      }
    ],
    pendapatan: [
      {
        id: 1,
        nama_komponen: 'Pendapatan Transfer',
        sumber_anggaran: 'pusat',
        jumlah_anggaran: 900000000
      }
    ],
    belanja: [
      {
        id: 4,
        nama_komponen: 'Belanja Pegawai II',
        sumber_anggaran: 'pusat',
        jumlah_anggaran: 50000000
      }
    ]
  }
};
