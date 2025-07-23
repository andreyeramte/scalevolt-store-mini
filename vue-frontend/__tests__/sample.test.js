import { render, screen } from '@testing-library/react';
test('renders sample text', () => {
  render(<div>Sample React Test</div>);
  expect(screen.getByText('Sample React Test')).toBeInTheDocument();
}); 