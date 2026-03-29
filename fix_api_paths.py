import os

def replace_in_file(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    new_content = content.replace('http://localhost:8080/api', '/api')
    
    if content != new_content:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Updated: {file_path}")

def main():
    root_dir = r"E:\project_react_nodejs\frontend\src\sms"
    for root, dirs, files in os.walk(root_dir):
        for file in files:
            if file.endswith('.jsx') or file.endswith('.js'):
                replace_in_file(os.path.join(root, file))

if __name__ == "__main__":
    main()
