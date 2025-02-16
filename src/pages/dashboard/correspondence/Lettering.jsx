import { Card, Tabs } from 'antd';
import LetterAttribute from './LetterAttribute';
import LetterTemplate from './LetterTemplate';

const Lettering = () => {
  return (
    <div>
      <Card>
        <Tabs type="card">
          <Tabs.TabPane tab="Atribut Surat" key="atribute">
            <LetterAttribute />
          </Tabs.TabPane>
          <Tabs.TabPane tab="Template Surat" key="template">
            <LetterTemplate />
          </Tabs.TabPane>
        </Tabs>
      </Card>
    </div>
  );
};

export default Lettering;
