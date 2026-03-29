import styled from 'styled-components';

export const AssignmentsContainer = styled.div`
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

export const AssignmentsContent = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  background-color: var(--card-bg);
  padding: 30px;
  border-radius: 24px;
  box-shadow: var(--card-shadow);
  color: var(--content-text);
`;

export const AssignmentsHeader = styled.h2`
  font-size: 26px;
  margin-bottom: 24px;
  color: var(--content-text);
  font-weight: 700;
  text-align: center;
`;

export const AssignmentList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

export const AssignmentItem = styled.li`
  background-color: var(--content-bg);
  border: 1px solid var(--color-border-hr);
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 20px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.02);

  &:hover {
    transform: translateY(-5px);
    box-shadow: var(--card-shadow);
  }
`;

export const AssignmentTitle = styled.h3`
  margin: 0 0 10px 0;
  color: var(--content-text);
  font-size: 20px;
  font-weight: 700;
`;

export const AddAssignmentForm = styled.form`
  display: grid;
  gap: 16px;
  margin-bottom: 30px;
  padding-bottom: 30px;
  border-bottom: 1px solid var(--color-border-hr);
`;

export const AddAssignmentInput = styled.input`
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

export const AddAssignmentTextArea = styled.textarea`
  padding: 14px 18px;
  width: 100%;
  border: 1px solid var(--color-border-hr);
  border-radius: 12px;
  background: var(--card-bg);
  color: var(--content-text);
  resize: vertical;
  min-height: 100px;
  box-sizing: border-box;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: var(--accent-primary);
    box-shadow: 0 0 0 4px rgba(85, 132, 172, 0.15);
  }
`;

export const AddAssignmentButton = styled.button`
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
    box-shadow: 0 4px 12px rgba(34, 87, 126, 0.2);
  }
`;

// Backward-compatible exports
export const SidebarContainer = styled.div`
  flex-shrink: 0;
`;
export const AssignmentButton = AddAssignmentButton;
export const AssignmentCard = AssignmentItem;
export const AssignmentDescription = styled.p`
  margin: 10px 0;
  color: var(--content-text);
  opacity: 0.8;
  line-height: 1.6;
`;
export const AssignmentDoneMessage = styled.p`
  margin-top: 15px;
  color: #22c55e;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 8px;
`;