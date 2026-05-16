import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import StatusModal from './StatusModal';
import api from "../api/axios";
import { getUser, saveUser } from "../utils/auth";

jest.mock("../api/axios");
jest.mock("../utils/auth", () => ({
  getUser: jest.fn(),
  saveUser: jest.fn(),
}));

describe('StatusModal - Status Change Tests', () => {
  const mockOnClose = jest.fn();
  const mockOnSuccess = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    api.patch.mockResolvedValue({ status: 200 });
    getUser.mockReturnValue({ id: 'test-user-id', _id: 'test-user-id' });
    saveUser.mockImplementation(() => {});
  });

  // Test if modal renders with all status options
  test('should display all three status options', () => {
    render(<StatusModal onClose={mockOnClose} onSuccess={mockOnSuccess} />);
    
    expect(screen.getByText('On Campus')).toBeInTheDocument();
    expect(screen.getByText('Off Campus')).toBeInTheDocument();
    expect(screen.getByText('In Class')).toBeInTheDocument();
  });

  // Test if User can select "On Campus" status
  test('should highlight "On Campus" when clicked', () => {
    render(<StatusModal onClose={mockOnClose} onSuccess={mockOnSuccess} />);
    
    const onCampusButton = screen.getByText('On Campus').closest('button');
    fireEvent.click(onCampusButton);
    
    // Check if the button has the selected background color
    expect(onCampusButton).toHaveClass('bg-[#e2f5ea]');
    expect(onCampusButton).toHaveClass('text-[#1f9254]');
  });

  // Test if user can select "Off Campus" status
  test('should highlight "Off Campus" when clicked', () => {
    render(<StatusModal onClose={mockOnClose} onSuccess={mockOnSuccess} />);
    
    const offCampusButton = screen.getByText('Off Campus').closest('button');
    fireEvent.click(offCampusButton);
    
    expect(offCampusButton).toHaveClass('bg-[#fef3c7]');
    expect(offCampusButton).toHaveClass('text-[#d97706]');
  });

  // Test if User can select "In Class" status
  test('should highlight "In Class" when clicked', () => {
    render(<StatusModal onClose={mockOnClose} onSuccess={mockOnSuccess} />);
    
    const inClassButton = screen.getByText('In Class').closest('button');
    fireEvent.click(inClassButton);
    
    expect(inClassButton).toHaveClass('bg-[#e0e7ff]');
    expect(inClassButton).toHaveClass('text-[#4f46e5]');
  });

  // Test when user changes status, previous selection is removed
  test('should only have one status selected at a time', () => {
    render(<StatusModal onClose={mockOnClose} onSuccess={mockOnSuccess} />);
    
    const onCampusButton = screen.getByText('On Campus').closest('button');
    const offCampusButton = screen.getByText('Off Campus').closest('button');
    
    // Select "On Campus"
    fireEvent.click(onCampusButton);
    expect(onCampusButton).toHaveClass('bg-[#e2f5ea]');
    
    // Select "Off Campus" - should deselect "On Campus"
    fireEvent.click(offCampusButton);
    expect(onCampusButton).not.toHaveClass('bg-[#e2f5ea]');
    expect(offCampusButton).toHaveClass('bg-[#fef3c7]');
  });



  // Test if the close button works
  test('should call onClose when close button is clicked', () => {
    render(<StatusModal onClose={mockOnClose} onSuccess={mockOnSuccess} />);
    
    const closeButton = screen.getByRole('button', { name: '' });
    fireEvent.click(closeButton);
    
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  // Test if modal renders with correct title
  test('should display "Change Status" title', () => {
    render(<StatusModal onClose={mockOnClose} onSuccess={mockOnSuccess} />);
    
    const title = screen.getByText('Change Status');
    expect(title).toBeInTheDocument();
    expect(title.tagName).toBe('H3');
  });

  // Test if status changes after user clicks a status button
  test("should call API and update local user when status changes", async () => {
    getUser.mockReturnValue({
      _id: "123",
      firstName: "Jasper",
      status: "OFF",
    });

    api.patch.mockResolvedValue({
      status: 200,
      data: { status: "CLASS" },
    });

    render(<StatusModal onClose={mockOnClose} onSuccess={mockOnSuccess} />);

    const inClassButton = screen.getByText("In Class").closest("button");
    fireEvent.click(inClassButton);

    await waitFor(() => {
      expect(api.patch).toHaveBeenCalledWith("/users/updateUser/123", {
        status: "CLASS",
      });
    });

    expect(saveUser).toHaveBeenCalledWith({
      _id: "123",
      firstName: "Jasper",
      status: "CLASS",
    });

    expect(mockOnSuccess).toHaveBeenCalled();
  });
  
});
