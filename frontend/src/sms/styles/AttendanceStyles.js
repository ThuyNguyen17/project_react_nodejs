import styled from 'styled-components';

export const AttendanceContainer = styled.div`
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

export const AttendanceContent = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  background-color: var(--card-bg);
  padding: 30px;
  border-radius: 24px;
  box-shadow: var(--card-shadow);
  color: var(--content-text);
`;

export const AttendanceHeader = styled.h2`
  font-size: 26px;
  margin-bottom: 24px;
  color: var(--content-text);
  font-weight: 700;
  text-align: center;
`;

export const AttendanceList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

export const AttendanceItem = styled.li`
  display: flex;
  align-items: center;
  margin-bottom: 12px;
  padding: 16px 20px;
  background-color: var(--content-bg);
  border: 1px solid var(--color-border-hr);
  border-radius: 14px;
  transition: all 0.2s ease;

  &:hover {
    border-color: var(--accent-primary);
    transform: translateX(5px);
  }
`;

export const StudentName = styled.span`
  flex: 1;
  font-weight: 500;
  color: var(--content-text);
`;

export const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  font-size: 14px;
`;

export const Divider = styled.hr`
  margin: 20px 0;
  border: 0;
  border-top: 1px solid var(--color-border-hr);
`;

export const SubmitButton = styled.button`
  width: 100%;
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
export const AttendanceDate = styled.span`
  color: var(--content-text);
  opacity: 0.7;
  font-size: 14px;
`;
export const AttendanceStatus = styled.span`
  display: inline-block;
  padding: 6px 14px;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 600;
  color: #fff;
  background-color: ${({ present }) => (present ? "#22c55e" : "#ef4444")};
`;