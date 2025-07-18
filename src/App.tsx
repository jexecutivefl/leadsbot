import { useState } from 'react';
import './App.css';
import Button from './components/ui/Button';
import Input from './components/ui/Input';
import Card from './components/ui/Card';
import Modal from './components/ui/Modal';
import Header from './components/layout/Header';

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const handleInputChange = (value: string) => {
    setInputValue(value);
  };

  return (
    <div className="App">
      <Header onMenuToggle={() => console.log('Menu toggled')} />
      
      <main style={{ padding: '2rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <Card
            title="Phase 1 Components Showcase"
            subtitle="Testing the core UI components built in Phase 1"
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              
              {/* Button Showcase */}
              <section>
                <h3>Button Component</h3>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '1rem' }}>
                  <Button variant="primary">Primary Button</Button>
                  <Button variant="secondary">Secondary Button</Button>
                  <Button variant="outline">Outline Button</Button>
                  <Button variant="ghost">Ghost Button</Button>
                  <Button variant="destructive">Destructive Button</Button>
                </div>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '1rem' }}>
                  <Button size="small">Small</Button>
                  <Button size="medium">Medium</Button>
                  <Button size="large">Large</Button>
                  <Button loading>Loading...</Button>
                  <Button disabled>Disabled</Button>
                </div>
              </section>

              {/* Input Showcase */}
              <section>
                <h3>Input Component</h3>
                <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', marginTop: '1rem' }}>
                  <Input
                    label="Text Input"
                    placeholder="Enter some text..."
                    value={inputValue}
                    onChange={handleInputChange}
                    helperText="This is helper text"
                  />
                  <Input
                    type="email"
                    label="Email"
                    placeholder="your@email.com"
                    required
                  />
                  <Input
                    type="password"
                    label="Password"
                    placeholder="Enter password"
                  />
                  <Input
                    type="textarea"
                    label="Textarea"
                    placeholder="Enter multiple lines..."
                  />
                </div>
              </section>

              {/* Modal Showcase */}
              <section>
                <h3>Modal Component</h3>
                <div style={{ marginTop: '1rem' }}>
                  <Button onClick={() => setIsModalOpen(true)}>
                    Open Modal
                  </Button>
                </div>
              </section>

            </div>
          </Card>

          {/* Additional Cards */}
          <div style={{ display: 'grid', gap: '1.5rem', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
            <Card variant="elevated" title="Elevated Card">
              <p>This is an elevated card with enhanced shadow.</p>
            </Card>
            
            <Card variant="outlined" title="Outlined Card">
              <p>This is an outlined card with border styling.</p>
            </Card>
            
            <Card>
              <h4>Card without header</h4>
              <p>This card doesn't have a title or subtitle in the header.</p>
            </Card>
          </div>
        </div>
      </main>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Test Modal"
        footer={
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setIsModalOpen(false)}>
              Confirm
            </Button>
          </div>
        }
      >
        <p>This is a test modal showcasing the Modal component with backdrop, focus trap, and animations.</p>
        <p>You can close it by clicking the X button, pressing Escape, or clicking the backdrop.</p>
        
        <Input
          label="Test input in modal"
          placeholder="This tests focus management..."
        />
      </Modal>
    </div>
  );
}

export default App;
