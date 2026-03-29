import styled from 'styled-components';

export const StudentsContainer = styled.div`
  display: flex;
`;

export const Content = styled.div`
  flex: 1;
  padding: 30px;
  min-height: 100vh;
  background: var(--content-bg);
  color: var(--content-text);
  transition: all 0.3s ease;
  box-sizing: border-box;
`;

export const StudentsContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 30px;
  background-color: var(--card-bg);
  border-radius: 24px;
  box-shadow: var(--card-shadow);
  color: var(--content-text);
`;

export const StudentsHeader = styled.h2`
  font-size: 30px;
  margin-bottom: 8px;
  color: var(--content-text);
  font-weight: 700;
`;

export const StudentsPageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 24px;
  flex-wrap: wrap;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid var(--color-border-hr);
`;

export const StudentsHeaderDescription = styled.p`
  margin: 0;
  color: var(--content-text);
  opacity: 0.8;
  line-height: 1.6;
`;

export const ActionRow = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  align-items: center;
`;

const buttonReset = `
  border: none;
  border-radius: 12px;
  padding: 12px 20px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
`;

export const PrimaryButton = styled.button`
  ${buttonReset}
  background: var(--accent-primary);
  color: #ffffff;
  box-shadow: 0 4px 10px rgba(85, 132, 172, 0.2);

  &:hover {
    background: var(--sidebar-bg);
    transform: translateY(-2px);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

export const SecondaryButton = styled.button`
  ${buttonReset}
  background: var(--card-bg);
  color: var(--content-text);
  border: 1px solid var(--color-border-hr);

  &:hover {
    background: var(--content-bg);
    border-color: var(--accent-primary);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

export const DangerButton = styled.button`
  ${buttonReset}
  background: #ef4444;
  color: #ffffff;

  &:hover {
    background: #dc2626;
    transform: translateY(-2px);
  }
`;

export const SectionCard = styled.div`
  background: var(--content-bg);
  border: 1px solid var(--color-border-hr);
  border-radius: 20px;
  padding: 24px;
  margin-bottom: 24px;
`;

export const AddStudentForm = styled.form`
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
`;

export const AddStudentInput = styled.input`
  width: 100%;
  padding: 14px 18px;
  border-radius: 12px;
  border: 1px solid var(--color-border-hr);
  background: var(--card-bg);
  color: var(--content-text);
  outline: none;
  transition: all 0.2s ease;

  &:focus {
    border-color: var(--accent-primary);
    box-shadow: 0 0 0 4px rgba(85, 132, 172, 0.15);
  }
`;

export const AddStudentButton = styled(PrimaryButton)`
  width: fit-content;
`;

export const StudentList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
`;

export const StudentItem = styled.div`
  background: var(--card-bg);
  border: 1px solid var(--color-border-hr);
  border-radius: 20px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 180px;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: var(--card-shadow);
  }
`;

export const StudentInfo = styled.div`
  display: grid;
  gap: 10px;
`;

export const StudentName = styled.div`
  font-size: 20px;
  font-weight: 700;
  color: var(--content-text);
`;

export const StudentCode = styled.div`
  color: var(--content-text);
  opacity: 0.6;
  font-size: 14px;
`;

export const StudentActions = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-top: 20px;
`;

export const FileLabel = styled.div`
  color: var(--content-text);
  opacity: 0.7;
  margin-bottom: 16px;
  font-size: 14px;
`;
