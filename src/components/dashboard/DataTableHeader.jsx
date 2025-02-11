import { DeleteOutlined, ExportOutlined, ImportOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Typography } from 'antd';
import PropTypes from 'prop-types';

const DataTableHeader = ({ modul, selectedData, onDeleteBatch, onImport, onExport, onCreate }) => {
  return (
    <div className="mb-6 flex flex-col justify-between gap-y-2 lg:flex-row lg:items-center">
      <Typography.Title level={5}>Data {modul}</Typography.Title>
      <div className="flex flex-col gap-2 gap-y-2 lg:flex-row lg:items-start">
        {onDeleteBatch && (
          <Button variant="outlined" color="danger" disabled={!selectedData?.length} icon={<DeleteOutlined />} onClick={onDeleteBatch}>
            {modul}
          </Button>
        )}
        {onImport && (
          <Button variant="solid" icon={<ImportOutlined />} onClick={onImport}>
            Import
          </Button>
        )}
        {onExport && (
          <Button variant="solid" icon={<ExportOutlined />} onClick={onExport}>
            Export
          </Button>
        )}
        {onCreate && (
          <Button type="primary" icon={<PlusOutlined />} onClick={onCreate}>
            {modul}
          </Button>
        )}
      </div>
    </div>
  );
};

DataTableHeader.propTypes = {
  modul: PropTypes.string,
  selectedData: PropTypes.array,
  onDeleteBatch: PropTypes.func,
  onImport: PropTypes.func,
  onExport: PropTypes.func,
  onCreate: PropTypes.func
};

export default DataTableHeader;
