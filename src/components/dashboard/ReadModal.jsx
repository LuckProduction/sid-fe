import { ReadModalType } from '@/constants';
import { Descriptions, List, Modal, Table, Typography } from 'antd';
import PropTypes from 'prop-types';

export default function ReadModal({ title, isModalOpen, close, data, type = ReadModalType.PARAGRAPH, isLoading = false, columns = [], ...props }) {
  const jsxs = {
    [ReadModalType.PARAGRAPH]: (
      <div className="flex flex-col gap-4">
        {data.title && <Typography.Title level={data.title.level || 1}>{data.title.text}</Typography.Title>}
        <p>{data.content}</p>
      </div>
    ),
    [ReadModalType.LIST]: <List bordered dataSource={data} renderItem={(item) => <List.Item>{item}</List.Item>} />,
    [ReadModalType.TABLE]: <Table columns={columns} dataSource={data} loading={isLoading} />,
    [ReadModalType.DESCRIPTION]: <Descriptions bordered column={1} items={data ?? []} layout="horizontal" />
  };

  return (
    <Modal title={title} open={isModalOpen} onClose={close} onCancel={close} footer={null} {...props}>
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
  columns: PropTypes.arrayOf(PropTypes.object)
};
