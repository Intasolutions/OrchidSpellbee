with open('src/app/rounds-and-prizes/page.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

import re
tags = re.findall(r'<[/a-zA-Z][^>]*>', text)
stack = []
for tag in tags:
    inner = tag.strip('<>')
    if inner.startswith('/'):
        tag_name = inner[1:].split()[0].strip('/')
        if stack and stack[-1] == tag_name:
            stack.pop()
        else:
            print(f'Mismatched closing tag: {tag}, expected {stack[-1] if stack else "Nothing"}')
            break
    elif not tag.endswith('/>'):
        tag_name = inner.split()[0].strip('/')
        if tag_name not in ['br', 'img', 'hr', 'input', 'circle', 'path', 'polygon', 'line']:
            stack.append(tag_name)
print('Remaining:', stack)
