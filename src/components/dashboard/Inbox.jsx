import InboxType from '@/constants/InboxType';
import { useService } from '@/hooks';
import { InboxService } from '@/services';
import timeAgo from '@/utils/timeAgo';
import { DeleteOutlined, FileOutlined, GroupOutlined, WarningOutlined } from '@ant-design/icons';
import { Avatar, Button, Empty } from 'antd';
import PropTypes from 'prop-types';

const Inbox = ({ inbox, token, fetchInbox }) => {
  const deleteInbox = useService(InboxService.delete);

  const renderNotification = (data) => {
    switch (data.type) {
      case InboxType.SUCCESS_SUBMIT_LETTER:
        return (
          <div className="flex w-full gap-x-2 py-4">
            <Avatar className="bg-blue-100 text-blue-500" icon={<FileOutlined className="text-sm" />} />
            <div className="flex flex-col gap-y-2">
              <p className="max-w-xs text-xs">
                <span className="font-semibold"> {data.data.nama_lengkap}</span> telah mengajukan permohonan Surat <span className="font-semibold">{data.data.jenis_surat.nama_surat}</span>{' '}
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
          <div className="flex w-full gap-x-2 py-4">
            <Avatar className="bg-green-100 text-green-500" icon={<GroupOutlined />} />
            <div className="flex flex-col gap-y-2">
              <p className="max-w-xs text-xs">
                <span className="font-semibold"> {data.data.nama_lengkap}</span> telah membuat pengaduan dengan judul <span className="font-semibold"> {data.data.judul_pengaduan}</span>{' '}
                <span className="text-gray-500">
                  {'('}
                  {timeAgo(data.data.waktu)}
                  {')'}
                </span>
              </p>
            </div>
          </div>
        );
      case InboxType.SUCCESS_VILLAGE_REPORT:
        return (
          <div className="flex w-full gap-x-2 py-4">
            <Avatar className="bg-yellow-100 text-yellow-500" icon={<WarningOutlined />} />
            <div className="flex flex-col gap-y-2">
              <p className="max-w-xs text-xs">
                <span className="font-semibold"> {data.data.nama_lengkap}</span> telah membuat laporan <span className="font-semibold"> {data.data.jenis_laporan}</span>{' '}
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
    <div className="flex max-h-80 flex-col p-2">
      <div className="flex flex-1 flex-col divide-y overflow-y-auto overflow-x-hidden">
        {inbox && inbox.map((item) => <div key={item.id}>{renderNotification(item)}</div>)}
        {inbox.length === 0 && <Empty description="Tidak ada Notifikasi" />}
      </div>
      {inbox.length > 0 && (
        <div className="sticky bottom-0 bg-white pt-3 shadow-inner">
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
