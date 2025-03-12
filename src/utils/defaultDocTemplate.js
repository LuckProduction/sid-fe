export const defaultDocTemplate = `<p class="mt-4">Yang bertanda tangan di bawah ini:</p>
<table style="border-collapse: collapse; width: 100%;" border="1"><colgroup><col style="width: 32.3764%;"><col style="width: 65.5502%;"><col style="width: 2.23285%;"></colgroup>
<tbody>
<tr>
<td style="width: 17.2358%;">Nama</td>
<td style="width: 82.7642%;">: {{ nama_perangkat_desa }}</td>
<td>&nbsp;</td>
</tr>
<tr>
<td style="width: 17.2358%;">Jabatan</td>
<td style="width: 82.7642%;">: {{ nama_jabatan_perangkat_desa }} {{ nama_desa_profil_desa }}</td>
<td>&nbsp;</td>
</tr>
<tr>
<td style="width: 17.2358%;">Jenis Kelamin</td>
<td style="width: 82.7642%;">: {{ jenis_kelamin_perangkat_desa }}</td>
<td>&nbsp;</td>
</tr>
</tbody>
</table>
<p>Menerangkan dengan sebenarnya bahwa:</p>
<table style="border-collapse: collapse; width: 100%; height: 254px;" border="1"><colgroup><col style="width: 28.8676%;"><col style="width: 4.6252%;"><col style="width: 66.5072%;"></colgroup>
<tbody>
<tr style="height: 36.1953px;">
<td style="text-align: left;">Nama</td>
<td style="text-align: left;">:</td>
<td style="text-align: left;">{{ nama_lengkap }}</td>
</tr>
<tr style="height: 36.1953px;">
<td style="text-align: left;">NIK</td>
<td style="text-align: left;">:</td>
<td style="text-align: left;">{{ nik }}</td>
</tr>
<tr style="height: 36.1953px;">
<td style="text-align: left;">Tempat, Tanggal Lahir</td>
<td style="text-align: left;">:</td>
<td style="text-align: left;">{{ tempat_lahir }] - {{ tanggal_lahir }}</td>
</tr>
<tr style="height: 36.1953px;">
<td style="text-align: left;">Agama</td>
<td style="text-align: left;">:</td>
<td style="text-align: left;">{{ agama }}</td>
</tr>
<tr style="height: 36.1953px;">
<td style="text-align: left;">Status Perkawinan</td>
<td style="text-align: left;">:</td>
<td style="text-align: left;">{{ status_perkawinan }}</td>
</tr>
<tr style="height: 36.1953px;">
<td style="text-align: left;">Pekerjaan</td>
<td style="text-align: left;">:</td>
<td style="text-align: left;">{{ pekerjaan }}</td>
</tr>
<tr style="height: 34px;">
<td style="text-align: left;">Alamat</td>
<td style="text-align: left;">:</td>
<td style="text-align: left;">{{ alamat_kk }}</td>
</tr>
</tbody>
</table>
<div style="margin-left: 50px;">&nbsp;</div>
<p class="indent-first-line" style="text-align: justify;">Orang tersebut di atas benar-benar penduduk {{ alamat_kk }} yang mempunyai usaha&nbsp;<strong>{{ nama_usaha }}</strong>.</p>
<p class="indent-first-line" style="text-align: justify;">Demikian Surat Keterangan ini dibuat dengan sebenarnya dan untuk dipergunakan sebagaimana mestinya.</p>`;
