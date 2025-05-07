import { ReadModalType } from '@/constants';
import { Descriptions, List, Modal, Table, Typography } from 'antd';
import PropTypes from 'prop-types';

export default function ReadModal({ title, isModalOpen, close, data, type = ReadModalType.PARAGRAPH, isLoading = false, columns = [], width, ...props }) {
  const jsxs = {
    [ReadModalType.PARAGRAPH]: (
      <div className="flex flex-col gap-4">
        {data.title && <Typography.Title level={data.title.level || 1}>{data.title.text}</Typography.Title>}
        <div>{data.content}</div>
      </div>
    ),
    [ReadModalType.LIST]: <List bordered dataSource={data} renderItem={(item) => <List.Item>{item}</List.Item>} />,
    [ReadModalType.TABLE]: <Table columns={columns} dataSource={data} loading={isLoading} />,
    [ReadModalType.DESCRIPTION]: <Descriptions bordered column={1} items={data ?? []} layout="horizontal" />,
    [ReadModalType.VIDEO]:
      isModalOpen && data ? (
        <iframe
          key={data} // tambahkan key agar iframe reset jika video berubah
          style={{ aspectRatio: 16 / 9, width: '100%' }}
          className="h-full w-full"
          src={data}
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      ) : null
  };

  return (
    <Modal destroyOnClose title={title} open={isModalOpen} onClose={close} onCancel={close} footer={null} width={width} {...props}>
      <div className="mt-4">{jsxs[type]}</div>
    </Modal>
  );
}

ReadModal.propTypes = {
  title: PropTypes.string.isRequired,
  type: PropTypes.oneOf(Object.values(ReadModalType)),
  isModalOpen: PropTypes.bool.isRequired,
  close: PropTypes.func.isRequired,
  data: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.object, PropTypes.arrayOf(PropTypes.object)])).isRequired,
  isLoading: PropTypes.bool,
  columns: PropTypes.arrayOf(PropTypes.object),
  width: PropTypes.number
};
