import { InputType } from "@/constants";
import Modul from "@/constants/Modul";

export const letterTypeFormFields = () => [
    {
        label: `Nama Surat`,
        name: 'letter_name',
        type: InputType.TEXT,
        rules: [
            {
                required: true,
                message: `Nama Surat harus diisi`
            }
        ]
    },
    {
        label: `Kode Surat`,
        name: 'letter_code',
        type: InputType.TEXT,
        rules: [
            {
                required: true,
                message: `Kode Surat harus diisi`
            }
        ]
    },
    {
        label: `Tampilkan Header (Y/N)`,
        name: 'show_header',
        type: InputType.SELECT,
        rules: [
            {
                required: true,
                message: `Pilihan harus diisi`
            }
        ],
        options: [
            {
                label: 'Ya',
                value: 'ya'
            },
            {
                label: 'Tidak',
                value: 'tidak'
            }
        ]
    },
    {
        label: `Masa Berlaku `,
        name: 'expired',
        type: InputType.NUMBER,
        rules: [
            {
                required: true,
                message: `Masa Berlaku ${Modul.LETTER_TYPE} harus diisi`
            }
        ]
    },
    {
        label: `Keterangan Tanda Tangan`,
        name: 'signature_desc',
        type: InputType.LONGTEXT,
        rules: [
            {
                required: true,
                message: `Keterangan Tanda Tangan ${Modul.LETTER_TYPE} harus diisi`
            }
        ]
    },
];