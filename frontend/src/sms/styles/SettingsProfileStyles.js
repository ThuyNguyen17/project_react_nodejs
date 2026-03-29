import styled from 'styled-components';

export const ProfileContainer = styled.div`
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

export const ProfileContent = styled.div`
  max-width: 900px;
  margin: 0 auto;
  background-color: var(--card-bg);
  padding: 40px;
  border-radius: 24px;
  box-shadow: var(--card-shadow);
  color: var(--content-text);
`;

export const ProfileHeader = styled.h2`
  font-size: 28px;
  margin-bottom: 30px;
  color: var(--content-text);
  font-weight: 700;
  text-align: center;
`;

export const ProfileCard = styled.div`
  background-color: var(--content-bg);
  border: 1px solid var(--color-border-hr);
  border-radius: 24px;
  padding: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 30px;
  transition: all 0.3s ease;

  &:hover {
    box-shadow: var(--card-shadow);
  }
`;

export const ProfileAvatar = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background-color: var(--accent-primary);
  color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 48px;
  box-shadow: 0 8px 20px rgba(85, 132, 172, 0.3);
`;

export const ProfileDetails = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const ProfileDetailRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  background: var(--card-bg);
  border-radius: 12px;
  border: 1px solid var(--color-border-hr);
  width: 100%;
  box-sizing: border-box;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 5px;
  }
`;

export const Label = styled.span`
  font-weight: 700;
  color: var(--content-text);
  opacity: 0.6;
  font-size: 14px;
`;

export const Value = styled.span`
  color: var(--content-text);
  font-weight: 600;
  font-size: 16px;
`;

export const ButtonContainer = styled.div`
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  justify-content: center;
  width: 100%;
  margin-top: 10px;
`;

export const EditButton = styled.button`
  padding: 14px 28px;
  background-color: var(--accent-primary);
  color: #fff;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s ease;

  &:hover {
    background-color: var(--sidebar-bg);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(34, 87, 126, 0.2);
  }
`;