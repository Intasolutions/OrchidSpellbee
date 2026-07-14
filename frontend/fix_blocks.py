with open('src/app/rounds-and-prizes/page.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

import re

# 1. Remove extra </div> between header and body in all blocks.
text = re.sub(r'</h3>\s*</div>\s*</div>\s*<div\s*style=\{\{\s*background:', r'</h3>\n              </div>\n              <div\n                style={{\n                  background:', text)

# 2. Let's find exactly what is between blocks.
blocks = ['School Prizes', 'District Prizes', 'State Prizes', 'National Prizes', 'All participants note']
for i in range(len(blocks) - 1):
    start_str = blocks[i]
    end_str = blocks[i+1]
    
    idx1 = text.find(start_str)
    idx2 = text.find(end_str)
    
    block_text = text[idx1:idx2]
    # We want to see the end of this block
    match = re.search(r'\}\)\}\s*(</div>.*?)$', block_text, re.DOTALL)
    if match:
        print(f"End of {start_str}:", repr(match.group(1)))
