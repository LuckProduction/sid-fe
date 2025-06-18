import { HomeFilled, PushpinFilled, ShopFilled } from '@ant-design/icons';
import PropTypes from 'prop-types';
import * as ReactDOMServer from 'react-dom/server';
import L from 'leaflet';

const CustomMapIcon = ({ iconType }) => {
  const iconPicker = (icon) => {
    switch (icon) {
      case 'headvillage':
        return (
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: '#3b82f6',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.25)',
              border: '2px solid white'
            }}
          >
            <HomeFilled style={{ fontSize: '18px', color: 'white' }} />
          </div>
        );
      case 'potention':
        return (
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: '#ef4444',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.25)',
              border: '2px solid white'
            }}
          >
            <PushpinFilled style={{ fontSize: '20px', color: 'white' }} />
          </div>
        );
      case 'enterprises':
        return (
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: '#22c55e',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.25)',
              border: '2px solid white'
            }}
          >
            <ShopFilled style={{ fontSize: '20px', color: 'white' }} />
          </div>
        );
      default:
        return null;
    }
  };

  return L.divIcon({
    html: ReactDOMServer.renderToStaticMarkup(<>{iconPicker(iconType)}</>),
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
