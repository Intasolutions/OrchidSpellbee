import re

with open('src/app/rounds-and-prizes/page.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

# First, let's identify the start of the grid
grid_start_idx = text.find('<div\n            className="prize-tables-grid"')
if grid_start_idx == -1:
    grid_start_idx = text.find('className="prize-tables-grid"')

# We will just parse out the 4 blocks.
school_idx = text.find('            {/* School Prizes */}')
district_idx = text.find('            {/* District Prizes */}')
state_idx = text.find('            {/* State Prizes */}')
national_idx = text.find('            {/* National Prizes */}')
note_idx = text.find('          {/* All participants note */}')
cta_idx = text.find('      {/* Next Steps CTA */}')
if cta_idx == -1:
    cta_idx = text.find('      {/* CTA Section */}')

# The layout should be:
# prefix up to grid_start + grid open tag
# School
# District
# State
# National
# grid close tag
# Note block
# cta block and suffix

import sys
print(f"grid_start: {grid_start_idx}")
print(f"school: {school_idx}")
print(f"district: {district_idx}")
print(f"state: {state_idx}")
print(f"national: {national_idx}")
print(f"note: {note_idx}")
print(f"cta: {cta_idx}")
