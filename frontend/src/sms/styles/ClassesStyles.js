import styled from 'styled-components';

export const ClassesContainer = styled.div`
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

export const ClassesContent = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  background-color: var(--card-bg);
  padding: 30px;
  border-radius: 20px;
  box-shadow: var(--card-shadow);
  color: var(--content-text);
`;

export const ClassHeader = styled.h2`
  font-size: 26px;
  margin-bottom: 24px;
  color: var(--content-text);
  font-weight: 700;
  text-align: center;
`;

export const ClassList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 20px;
`;

export const ClassItem = styled.div`
  background-color: var(--content-bg);
  border: 1px solid var(--color-border-hr);
  border-radius: 14px;
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: var(--content-text);
  font-weight: 500;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-3px);
    box-shadow: var(--card-shadow);
  }
`;

export const AddClassForm = styled.form`
  display: grid;
  grid-template-columns: 1fr 1fr auto;
  gap: 16px;
  align-items: end;
  margin-bottom: 30px;
  padding-bottom: 30px;
  border-bottom: 1px solid var(--color-border-hr);

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const AddClassInput = styled.input`
  padding: 14px 18px;
  border: 1px solid var(--color-border-hr);
  border-radius: 12px;
  background: var(--card-bg);
  color: var(--content-text);
  transition: all 0.2s ease;
  width: 100%;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: var(--accent-primary);
    box-shadow: 0 0 0 4px rgba(85, 132, 172, 0.15);
  }
`;

export const AddClassButton = styled.button`
  padding: 14px 24px;
  background-color: var(--accent-primary);
  color: #fff;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s ease;

  &:hover {
    background-color: var(--sidebar-bg);
  }
`;

// Backward-compatibility
export const ClassContainer = ClassesContainer;
export const ClassListContainer = ClassList;