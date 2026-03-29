import styled from 'styled-components';

export const AdminDashboardContainer = styled.div`
  display: flex;
`;

export const StudentDashboardContainer = styled.div`
  display: flex;
`;

export const TeacherDashboardContainer = styled.div`
  display: flex;
`;

export const Content = styled.div`
  flex: 1;
  padding: 30px;
  transition: all 0.3s ease;
  min-height: 100vh;
  background: var(--content-bg);
  color: var(--content-text);
  box-sizing: border-box;
`;

export const TopContent = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-bottom: 20px;
`;

export const BottomContent = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
`;

export const Section = styled.section`
  flex: 1;
  margin-right: 20px;
  min-width: 300px;
`;

export const SectionTitle = styled.h2`
  font-size: 22px;
  margin-bottom: 16px;
  color: var(--content-text);
`;

export const CardContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
`;

export const Card = styled.div`
  background: var(--card-bg);
  padding: 24px;
  border-radius: 18px;
  box-shadow: var(--card-shadow);
  flex: 1;
  min-width: 180px;
`;

export const CardTitle = styled.h3`
  font-size: 18px;
  margin-bottom: 12px;
  color: var(--accent-primary);
`;

export const CardContent = styled.p`
  font-size: 28px;
  font-weight: 700;
  color: var(--content-text);
`;
