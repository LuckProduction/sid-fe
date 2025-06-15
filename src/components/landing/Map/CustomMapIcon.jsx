import { HomeFilled, PushpinFilled, ShopFilled } from '@ant-design/icons';
import PropTypes from 'prop-types';
import * as ReactDOMServer from 'react-dom/server';
import L from 'leaflet';

const CustomMapIcon = ({ iconType }) => {
  const iconPicker = (icon) => {
    switch (icon) {
      case 'headvillage':
        return <HomeFilled style={{ fontSize: '18px', color: '#3b82f6' }} />;
      case 'potention':
        return <PushpinFilled style={{ fontSize: '20px', color: '#ef4444' }} />;
      case 'enterprises':
        return <ShopFilled style={{ fontSize: '20px', color: '#22c55e' }} />;
      default:
        return null;
    }
  };

  return L.divIcon({
    html: ReactDOMServer.renderToStaticMarkup(
      <div
        style={{
          width: '32px',
          height: '32px',
          borderRadius: '50%',
          backgroundColor: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.25)'
        }}
      >
        {iconPicker(iconType)}
      </div>
    ),
    className: '',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
  });
};

CustomMapIcon.propTypes = {
  iconType: PropTypes.string.isRequired
};

export default CustomMapIcon;
