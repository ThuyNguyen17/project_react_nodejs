import styled from 'styled-components';

export const ProfileContainer = styled.div`
  display: flex;
`;

export const Content = styled.div`
  flex: 1;
  padding: 30px 24px;
  margin-left: ${({ isOpen }) => (isOpen ? '250px' : '80px')};
  transition: margin-left 0.3s ease;
  min-height: 100vh;
  background: #f4f7fb;
`;

export const ProfileContent = styled.div`
  max-width: 900px;
  margin: 0 auto;
  background-color: #ffffff;
  padding: 32px;
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(15, 23, 42, 0.08);
`;

export const ProfileHeader = styled.h2`
  font-size: 24px;
  margin-bottom: 20px;
  color: #333;
  text-align: center;
`;

export const ProfileCard = styled.div`
  background-color: #f8fafc;
  border-radius: 24px;
  padding: 30px;
  box-shadow: 0 15px 30px rgba(15, 23, 42, 0.08);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
`;

export const ProfileAvatar = styled.div`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background-color: #4b83b5; /* Dark Blue */
  color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 36px;
  margin: 0 auto 20px;
`;

export const ProfileDetails = styled.div`
  width: 100%;
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const ProfileDetailRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #e5e7eb;
  width: 100%;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

export const Label = styled.span`
  font-weight: bold;
  color: #555;
`;

export const Value = styled.span`
  color: #333;
`;

export const ButtonContainer = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  justify-content: center;
`;

export const EditButton = styled.button`
  padding: 10px 20px;
  background-color: #4b83b5; /* Dark Blue */
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #7da1cb; /* Medium Blue hover */
  }
`;