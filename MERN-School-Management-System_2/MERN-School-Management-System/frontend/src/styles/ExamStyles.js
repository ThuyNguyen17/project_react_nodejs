import styled from 'styled-components';

export const ExamContainer = styled.div`
  display: flex;
`;

export const Content = styled.div`
  flex: 1;
  padding: 20px;
  margin-left: ${({ isOpen }) => (isOpen ? '250px' : '80px')};
  transition: margin-left 0.3s ease;
`;

export const ExamContent = styled.div`
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  max-width: 900px;
  margin: 0 auto;
`;

export const ExamHeader = styled.h2`
  font-size: 24px;
  margin-bottom: 20px;
  color: #333;
`;

export const ExamForm = styled.form`
  max-width: 760px;
  display: grid;
  gap: 14px;
  margin-bottom: 24px;
`;

export const FormGroup = styled.div`
  margin-bottom: 20px;
`;

export const Label = styled.label`
  display: block;
  margin-bottom: 5px;
  color: #666;
`;

export const Input = styled.input`
  width: 100%;
  padding: 14px 16px;
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

export const Button = styled.button`
  padding: 12px 20px;
  background-color: #4b83b5; /* Dark Blue */
  color: #fff;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  width: fit-content;
  min-width: 140px;

  &:hover {
    background-color: #7da1cb; /* Medium Blue hover */
  }
`;

export const ExamResults = styled.div`
  margin-top: 20px;
`;

export const ExamResultItem = styled.div`
  background-color: #f9f9f9;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

export const ExamResultHeader = styled.h3`
  margin-bottom: 10px;
`;

// Backward-compatible exports used by Admin/Teacher/Student Exam pages
export const AddExamForm = ExamForm;
export const ExamInput = Input;
export const AddExamButton = Button;
export const ExamList = ExamResults;
export const ExamItem = ExamResultItem;
export const SidebarContainer = styled.div`
  flex-shrink: 0;
`;
export const ExamResultsContainer = ExamResults;
export const ExamSubject = styled.h4`
  margin: 0 0 6px 0;
  color: #222;
`;
export const ExamResult = styled.p`
  margin: 0;
  color: #444;
`;
export const ExamChartContainer = styled.div`
  margin-top: 20px;
  background: #fff;
  padding: 16px;
  border-radius: 8px;
`;