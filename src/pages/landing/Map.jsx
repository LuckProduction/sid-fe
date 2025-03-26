import { Reveal } from '@/components';
import Modul from '@/constants/Modul';
import { useCrudModal, useService } from '@/hooks';
import { LandingService } from '@/services';
import { CaretRightOutlined, DeleteOutlined, DownloadOutlined, InfoOutlined, LeftOutlined, PlusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Card, Collapse, Descriptions, Empty, Input, Modal, Popconfirm, Tag, theme, Typography } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import { MapContainer, Marker, Popup, TileLayer, GeoJSON } from 'react-leaflet';
import { useNavigate } from 'react-router-dom';

const baseUrl = import.meta.env.VITE_BASE_URL;
const tenant = import.meta.env.VITE_TENANTS;

const Map = () => {
  const navigate = useNavigate();
  const crudModal = useCrudModal();
  const { token } = theme.useToken();
  const [modal, setModal] = useState({ isVisible: false });
  const { execute, ...getAllMap } = useService(LandingService.getAllMap);
  const [filterValues, setFilterValues] = useState({ search: '' });
  const [tempSelectedMap, setTempSelectedMap] = useState(null);
  const [stackedSelectedMap, setStackedSelectedMap] = useState([]);
  const [geojsonLayers, setGeojsonLayers] = useState([]);
  const [markerPoints, setMarkerPoints] = useState([]);

  const fetchMap = useCallback(() => {
    execute({
      search: filterValues.search
    });
  }, [execute, filterValues.search]);

  useEffect(() => {
    fetchMap();
  }, [fetchMap]);

  const map = getAllMap.data ?? [];

  const formatGeoJsonUrl = useCallback((url) => {
    if (!url) return null;
    const path = url.split('/storage/')[1];
    return baseUrl.replace('://', `://${tenant}.`) + `/geojson?filename=${path}`;
  }, []);

  useEffect(() => {
    const newMarkers = [];
    const newGeojsonLayers = [];

    stackedSelectedMap.forEach(async (item) => {
      if (item.type === 'titik') {
        const coords = item.content.split(', ').map(Number);
        if (coords.length === 2 && !isNaN(coords[0]) && !isNaN(coords[1])) {
          newMarkers.push({
            id: item.id,
            position: [coords[1], coords[0]],
            name: item.map_name,
            desc: item.desc
          });
        }
      } else if (item.type === 'area') {
        const geoJsonUrl = formatGeoJsonUrl(item.content);
        if (geoJsonUrl) {
          try {
            const response = await fetch(geoJsonUrl);
            const geojson = await response.json();
            newGeojsonLayers.push({ id: item.id, data: geojson });
          } catch (error) {
            console.error('Error fetching GeoJSON:', error);
          }
        }
      }
    });

    setMarkerPoints(newMarkers);
    setGeojsonLayers(newGeojsonLayers);
  }, [formatGeoJsonUrl, stackedSelectedMap]);

  const panelStyle = {
    marginBottom: 12,
    background: 'oklch(0.967 0.003 264.542)',
    borderRadius: token.borderRadiusLG,
    border: 'none'
  };

  const datasetItem = (panelStyle, data) => {
    if (!data || data.length === 0) return [];

    return data.map((item, index) => ({
      key: String(index + 1),
      label: <b>{item.map_name}</b>,
      children: (
        <div className="ms-6 flex w-full items-center gap-x-1">
          <Button
            icon={<InfoOutlined />}
            variant="solid"
            size="small"
            className="text-xs"
            onClick={() => {
              crudModal.show.description({
                title: item.map_name,
                data: [
                  {
                    key: 'map_name',
                    label: `Nama Dataset ${Modul.MAP}`,
                    children: item.map_name
                  },
                  {
                    key: 'type',
                    label: `Tipe Dataset`,
                    children: item.type
                  },
                  {
                    key: 'category',
                    label: `Kategori Dataset`,
                    children: item.category.category_name
                  },
                  {
                    key: 'desc',
                    label: `Deskripsi`,
                    children: item.desc
                  },
                  {
                    key: 'desc',
                    label: `Deskripsi`,
                    children: item.desc
                  },
                  {
                    key: 'release',
                    label: `Tanggal Rilis Dataset`,
                    children: item.created_at
                  },
                  {
                    key: 'update',
                    label: `Terakhir Dataset Diperbaharui`,
                    children: item.updated_at
                  }
                ]
              });
            }}
          />
          {item.type === 'area' && <Button icon={<DownloadOutlined />} variant="solid" size="small" className="text-xs" />}
          <Popconfirm
            title="Hapus Dipilih"
            description="Hapus semua dataset yang dipilih?"
            onConfirm={() => {
              setStackedSelectedMap((prev) => prev.filter((selected) => selected.id !== item.id));
            }}
            okText="Ok"
            cancelText="Batal"
          >
            <Button icon={<DeleteOutlined />} variant="solid" size="small" className="text-xs" />
          </Popconfirm>
        </div>
      ),
      style: panelStyle
    }));
  };

  const handleAddDataset = () => {
    if (tempSelectedMap) {
      setStackedSelectedMap((prev) => {
        const isExist = prev.some((item) => item.id === tempSelectedMap.id);
        return isExist ? prev : [...prev, tempSelectedMap];
      });
    }
  };

  return (
    <>
      <section className="relative w-full bg-blue-500 text-white">
        <div className="relative z-10 mx-auto max-w-screen-xl px-6 py-24">
          <button className="mb-12 inline-flex items-center gap-x-2 text-sm" onClick={() => navigate(-1)}>
            <LeftOutlined />
            kembali
          </button>
          <Reveal>
            <Typography.Title style={{ color: '#fff' }}>Pemetaan</Typography.Title>
          </Reveal>
          <Reveal>
            <div className="max-w-lg">
              <small>Jelajahi peta desa secara interaktif! Lihat pemetaan wilayah, fasilitas, dan data penting lainnya untuk memahami kondisi desa secara real-time.</small>
            </div>
          </Reveal>
        </div>
        <img src="/illustration/city_sillhoute_transparent.png" className="absolute bottom-0 left-0 z-0 w-full" />
      </section>
      <section>
        <div className="mx-auto grid w-full max-w-screen-lg grid-cols-6 gap-4 px-6 py-24">
          <Card className="col-span-2">
            <div className="flex w-full flex-col">
              <div className="inline-flex items-center justify-between">
                <div className="font-semibold">
                  Dataset : <Tag color="blue">{datasetItem({}, stackedSelectedMap).length}</Tag>
                </div>
                <Popconfirm title="Hapus Semua" description="Hapus semua dataset yang sedang tampil?" onConfirm={() => setStackedSelectedMap([])} okText="Ok" cancelText="Batal">
                  <Button disabled={!datasetItem({}, stackedSelectedMap).length} size="small" className="text-xs" icon={<DeleteOutlined />} color="danger" variant="outlined">
                    Semua
                  </Button>
                </Popconfirm>
              </div>
              <div className="mb-2 mt-4 max-h-80 overflow-y-auto p-2">
                <Collapse bordered={false} expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />} style={{ background: token.colorBgContainer }} items={datasetItem(panelStyle, stackedSelectedMap)} />
              </div>
              <div className="w-full">
                <Button variant="filled" icon={<PlusCircleOutlined />} color="primary" style={{ width: '100%' }} size="large" onClick={() => setModal({ isVisible: true })} />
              </div>
            </div>
          </Card>
          <Card className="col-span-4">
            <MapContainer center={[0.5, 122.5]} zoom={6} style={{ height: '500px', width: '100%' }}>
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              {markerPoints.map((marker) => (
                <Marker key={marker.id} position={marker.position}>
                  <Popup>
                    <b>{marker.name}</b> <br />
                    {marker.desc}
                  </Popup>
                </Marker>
              ))}
              {geojsonLayers.map((layer) => (
                <GeoJSON key={layer.id} data={layer.data} />
              ))}
            </MapContainer>
          </Card>
        </div>
      </section>
      <Modal
        footer={null}
        width={800}
        open={modal.isVisible}
        onCancel={() => {
          setModal({ isVisible: false });
          setTempSelectedMap(null);
        }}
      >
        <div className="mt-4 grid w-full grid-cols-6 gap-4 p-2">
          <div className="col-span-2 flex flex-col gap-y-2">
            <div className="flex items-center">
              <Input.Search style={{ margin: 0 }} placeholder="Cari Data" allowClear onSearch={(values) => setFilterValues({ ...filterValues, search: values })} />
            </div>
            <div className="flex flex-col gap-y-2">
              {map.map((item) => {
                const isActive = stackedSelectedMap.some((selected) => selected.id === item.id);
                const isTempSelected = tempSelectedMap?.id === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setTempSelectedMap(item)}
                    className={`rounded-lg border p-4 text-left text-sm font-semibold transition-colors ${isActive || isTempSelected ? 'border-blue-500 text-blue-500' : 'border-gray-200 hover:border-blue-500 hover:text-blue-500'}`}
                  >
                    {item.map_name}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="col-span-4">
            {!tempSelectedMap ? (
              <Empty description="Tidak ada dataset yang dipilih" />
            ) : (
              <>
                <Descriptions bordered column={1}>
                  <Descriptions.Item label="Nama Dataset">{tempSelectedMap.map_name}</Descriptions.Item>
                  <Descriptions.Item label="Tipe Dataset">{tempSelectedMap.type}</Descriptions.Item>
                  <Descriptions.Item label="Kategori Dataset">{tempSelectedMap.category.category_name}</Descriptions.Item>
                  <Descriptions.Item label="Deskripsi">{tempSelectedMap.desc}</Descriptions.Item>
                  <Descriptions.Item label="Tanggal Rilis Dataset">{tempSelectedMap.created_at}</Descriptions.Item>
                  <Descriptions.Item label="Terakhir Dataset Diperbaharui">{tempSelectedMap.updated_at}</Descriptions.Item>
                </Descriptions>
                <Button icon={<PlusOutlined />} variant="solid" color="primary" className="mt-4" onClick={handleAddDataset}>
                  Tambah Dataset
                </Button>
              </>
            )}
          </div>
        </div>
      </Modal>
    </>
  );
};

export default Map;
