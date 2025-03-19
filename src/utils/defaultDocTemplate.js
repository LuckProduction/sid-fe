export const defaultDocTemplate = `<p class="mt-4">Yang bertanda tangan di bawah ini:</p>
<table style="border-collapse: collapse; width: 95.0637%;" border="1"><colgroup><col style="width: 33.2192%;"><col style="width: 1.6801%;"><col style="width: 64.9329%;"></colgroup>
<tbody>
<tr>
<td>Nama</td>
<td>:</td>
<td>{{ nama_perangkat_desa }}</td>
</tr>
<tr>
<td>Jabatan</td>
<td>:</td>
<td>{{ nama_jabatan_perangkat_desa }} {{ nama_desa_profil_desa }}</td>
</tr>
<tr>
<td>Jenis Kelamin</td>
<td>:</td>
<td>{{ jenis_kelamin_perangkat_desa }}</td>
</tr>
</tbody>
</table>
<p>Menerangkan kepada:</p>
<table style="border-collapse: collapse; width: 95.0637%;" border="1"><colgroup><col style="width: 24.4966%;"><col style="width: 4.0364%;"><col style="width: 71.467%;"></colgroup>
<tbody>
<tr style="height: 36px;">
<td style="text-align: left;">Nama</td>
<td style="text-align: left;">:</td>
<td style="text-align: left;">{{ nama_lengkap }}</td>
</tr>
<tr style="height: 36px;">
<td style="text-align: left;">Jenis Kelamin</td>
<td style="text-align: left;">:</td>
<td style="text-align: left;">{{ jenis_kelamin }}</td>
</tr>
<tr style="height: 36px;">
<td style="text-align: left;">Tempat, Tanggal Lahir</td>
<td style="text-align: left;">:</td>
<td style="text-align: left;">{{ tempat_lahir }} - {{ tanggal_lahir }}</td>
</tr>
<tr style="height: 36px;">
<td style="text-align: left;">Pekerjaan</td>
<td style="text-align: left;">:</td>
<td style="text-align: left;">{{ pekerjaan }}</td>
</tr>
<tr style="height: 35px;">
<td style="text-align: left;">Alamat</td>
<td style="text-align: left;">:</td>
<td style="text-align: left;">{{ alamat_kk }}</td>
</tr>
</tbody>
</table>
<p class="indent-first-line" style="text-align: justify;">Bahwa yang bersangkutan diatas adalah benar-benar memiliki usaha "<strong>{{ nama_usaha }}</strong>" sejak tahun {{ tahun_dimulai }} sampai dengan sekarang, yang terletak di Dusun {{ domisili }} Desa Sukma Kec. Botupingge Kab. Bone Bolango</p>
<p class="indent-first-line" style="text-align: justify;">Demikian Surat Keterangan ini dibuat dengan sebenarnya dan untuk dipergunakan sebagaimana mestinya.</p>`;
