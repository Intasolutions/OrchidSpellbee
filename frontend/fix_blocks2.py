with open('src/app/rounds-and-prizes/page.tsx', 'r', encoding='utf-8') as f:
    text = f.read()
import re

def fix_block(block_text):
    block_text = re.sub(r'</h3>[\s<>/a-zA-Z]*?<div\s*style=\{\{\s*background:', r'</h3>\n              </div>\n              <div\n                style={{\n                  background:', block_text)
    
    # Just grab everything up to the end of the map.
    match = re.search(r'(.*\}\)\}\s*</div>)', block_text, re.DOTALL)
    if match:
        block_text = match.group(1) + '\n            </div>\n'
    return block_text

grid_start_idx = text.find('<div\n            className="prize-tables-grid"')
grid_end_idx = text.find('          {/* All participants note */}')

grid_text = text[grid_start_idx:grid_end_idx]

blocks = re.split(r'(?=\{/\* (?:School|District|State|National) Prizes \*/\})', grid_text)

new_grid_text = blocks[0]
for i in range(1, len(blocks)):
    block_content = blocks[i]
    fixed_block = fix_block(block_content)
    new_grid_text += fixed_block

new_grid_text = new_grid_text.rstrip()
new_grid_text += '\n          </div>\n\n'

new_text = text[:grid_start_idx] + new_grid_text + text[grid_end_idx:]

with open('src/app/rounds-and-prizes/page.tsx', 'w', encoding='utf-8') as f:
    f.write(new_text)
