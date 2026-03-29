from pathlib import Path
path = Path(r'e:\Downloads\MERN-School-Management-System_2\MERN-School-Management-System_2\MERN-School-Management-System\frontend\src\styles\StudentsStyles.js')
text = path.read_text()
# Remove duplicated old block after first StudentItem definition.
dup = "export const AddStudentForm = styled.form`\n  margin-bottom: 20px;\n`;\n\nexport const AddStudentInput = styled.input`\n  padding: 8px;\n  margin-bottom: 10px;\n  width: 100%;\n  border: 1px solid #ccc;\n  border-radius: 4px;\n`;\n\nexport const AddStudentButton = styled.button`\n  padding: 8px 16px;\n  background-color: #4b83b5; /* Dark Blue */\n  color: #fff;\n  border: none;\n  border-radius: 4px;\n  cursor: pointer;\n\n  &:hover {\n    background-color: #7da1cb; /* Medium Blue hover */\n  }\n`;\n"
idx = text.find(dup)
if idx != -1:
    text = text[:idx] + text[idx + len(dup):]

if 'export const StudentInfo' not in text:
    text += "\nexport const StudentInfo = styled.div`\n  display: grid;\n  gap: 8px;\n`;\n\nexport const StudentName = styled.div`\n  font-size: 18px;\n  font-weight: 700;\n  color: #111827;\n`;\n\nexport const StudentCode = styled.div`\n  color: #475569;\n  font-size: 14px;\n`;\n\nexport const StudentActions = styled.div`\n  display: flex;\n  gap: 10px;\n  flex-wrap: wrap;\n`;\n\nexport const FileLabel = styled.div`\n  color: #4b5563;\n  margin-bottom: 16px;\n  font-size: 14px;\n`;\n"

path.write_text(text)
print('done')