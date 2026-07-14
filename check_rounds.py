with open('old_page.tsx', 'r', encoding='utf-16') as f:
    text = f.read()
import re
print(re.findall(r'name:\s*[\"\'\`](.*?)[\"\'\`]', text))
