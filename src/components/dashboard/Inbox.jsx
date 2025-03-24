import InboxType from '@/constants/InboxType';
import { useService } from '@/hooks';
import { InboxService } from '@/services';
import timeAgo from '@/utils/timeAgo';
import { DeleteOutlined, FileOutlined, GroupOutlined } from '@ant-design/icons';
import { Avatar, Button, Empty } from 'antd';
import PropTypes from 'prop-types';

const Inbox = ({ inbox, token, fetchInbox }) => {
  const deleteInbox = useService(InboxService.delete);

  const renderNotification = (data) => {
    switch (data.type) {
      case InboxType.SUCCESS_SUBMIT_LETTER:
        return (
          <div className="flex w-full gap-x-2 pt-2">
            <Avatar className="bg-blue-100 text-blue-500" icon={<FileOutlined className="text-sm" />} />
            <div className="flex flex-col gap-y-2">
              <p className="max-w-xs text-xs">
                Permohonan surat <span className="font-semibold">{data.data.jenis_surat.nama_surat}</span> dengan kode <span className="font-semibold"> {data.data.jenis_surat.kode_surat}</span> telah berhasil disimpan dalam database. Silakan periksa
                dan lakukan verifikasi.{' '}
                <span className="text-gray-500">
                  {'('}
                  {timeAgo(data.data.waktu)}
                  {')'}
                </span>
              </p>
            </div>
          </div>
        );
      case InboxType.SUCCESS_CITIZEN_REPORT:
        return (
          <div className="flex w-full gap-x-2 pt-2">
            <Avatar className="bg-green-100 text-green-500" icon={<GroupOutlined />} />
            <div className="flex flex-col gap-y-2">
              <p className="max-w-xs text-xs">
                Pangduan masyarakat dengan judul <span className="font-semibold"> {data.data.judul}</span> telah berhasil disimpan dalam database. Silakan periksa.{' '}
                <span className="text-gray-500">
                  {'('}
                  {timeAgo(data.data.waktu)}
                  {')'}
                </span>
              </p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex max-h-80 flex-col gap-y-4 divide-y overflow-y-auto p-2">
      {inbox && inbox.map((item) => <div key={item.id}>{renderNotification(item)}</div>)}

      {inbox.length > 0 ? (
        <div className="mb-2 w-full pt-3">
          <Button
            icon={<DeleteOutlined />}
            variant="outlined"
            color="danger"
            size="middle"
            className="w-full"
            onClick={async () => {
              await deleteInbox.execute(token);
              fetchInbox();
            }}
          >
            Hapus Semua
          </Button>
        </div>
      ) : (
        <Empty description="Tidak ada Notifikasi" />
      )}
    </div>
  );
};

Inbox.propTypes = {
  inbox: PropTypes.array.isRequired,
  token: PropTypes.string.isRequired,
  fetchInbox: PropTypes.func.isRequired
};

export default Inbox;
