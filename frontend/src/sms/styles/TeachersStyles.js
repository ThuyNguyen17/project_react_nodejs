import styled from 'styled-components';

export const TeachersContainer = styled.div`
  display: flex;
`;

export const Content = styled.div`
  flex: 1;
  padding: 30px;
  min-height: 100vh;
  background: var(--content-bg);
  color: var(--content-text);
  transition: all 0.3s ease;
`;

export const TeachersContent = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  background-color: var(--card-bg);
  padding: 30px;
  border-radius: 24px;
  box-shadow: var(--card-shadow);
  color: var(--content-text);
`;

export const TeachersHeader = styled.h2`
  font-size: 26px;
  margin-bottom: 24px;
  color: var(--content-text);
  font-weight: 700;
  text-align: center;
`;

export const TeacherList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
`;

export const TeacherItem = styled.div`
  background-color: var(--content-bg);
  border: 1px solid var(--color-border-hr);
  border-radius: 16px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: var(--card-shadow);
  }
`;

export const AddTeacherForm = styled.form`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 30px;
  padding-bottom: 30px;
  border-bottom: 1px solid var(--color-border-hr);

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const AddTeacherInput = styled.input`
  padding: 14px 18px;
  width: 100%;
  border: 1px solid var(--color-border-hr);
  border-radius: 12px;
  background: var(--card-bg);
  color: var(--content-text);
  box-sizing: border-box;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: var(--accent-primary);
    box-shadow: 0 0 0 4px rgba(85, 132, 172, 0.15);
  }
`;

export const AddTeacherButton = styled.button`
  grid-column: span 2;
  padding: 14px 24px;
  background-color: var(--accent-primary);
  color: #fff;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 600;
  transition: background 0.2s ease;

  &:hover {
    background-color: var(--sidebar-bg);
  }

  @media (max-width: 768px) {
    grid-column: span 1;
  }
`;