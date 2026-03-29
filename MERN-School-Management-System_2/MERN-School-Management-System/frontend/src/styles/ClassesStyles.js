import styled from 'styled-components';

export const ClassesContainer = styled.div`
  display: flex;
`;

export const SidebarContainer = styled.div`
  /* Thêm vào để tránh lỗi thiếu export SidebarContainer */
  width: 250px;
`;

export const Content = styled.div`
  flex: 1;
  padding: 20px;
  margin-left: ${({ isOpen }) => (isOpen ? '250px' : '80px')};
  transition: margin-left 0.3s ease;
`;

export const ClassesContent = styled.div`
  max-width: 900px;
  margin: 0 auto;
  background-color: #fff;
  padding: 24px;
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.08);
`;

export const ClassHeader = styled.h2`
  font-size: 24px;
  margin-bottom: 20px;
  color: #333;
`;

export const ClassList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
`;

export const ClassItem = styled.div`
  background-color: #f9f9f9;
  border-radius: 8px;
  padding: 15px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

export const AddClassForm = styled.form`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
  align-items: end;
  margin-bottom: 24px;

  select,
  input {
    width: 100%;
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const AddClassInput = styled.input`
  padding: 12px 14px;
  border: 1px solid #d1d5db;
  border-radius: 12px;
  background: #fafbff;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;

  &:focus {
    outline: none;
    border-color: #4b83b5;
    box-shadow: 0 0 0 4px rgba(75, 131, 181, 0.12);
  }
`;

export const AddClassButton = styled.button`
  padding: 8px 16px;
  background-color: #4b83b5; /* Dark Blue */
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #7da1cb; /* Medium Blue hover */
  }
`;

// Backward-compatible export
export const ClassContainer = ClassesContainer;