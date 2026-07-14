import re
import sys

with open('src/app/rounds-and-prizes/page.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

# Let's locate the blocks
national_idx = text.find('            {/* National Prizes */}')
state_idx = text.find('            {/* State Prizes */}')
district_idx = text.find('            {/* District Prizes */}')
school_idx = text.find('            {/* School Prizes */}')
note_idx = text.find('          {/* All participants note */}')
cta_idx = text.find('      {/* Call to Action */}')
if cta_idx == -1: cta_idx = text.find('      {/* Next Steps CTA */}')

if -1 in [national_idx, state_idx, district_idx, school_idx, note_idx, cta_idx]:
    print('Failed to find indices')
    sys.exit(1)

# prefix up to national
prefix = text[:national_idx]

# blocks
national_block = text[national_idx:state_idx]
state_block = text[state_idx:district_idx]
district_block = text[district_idx:school_idx]
school_block = text[school_idx:note_idx]

# note and suffix
# note ends when grid ends?
# Actually, let's see where the grid ends. The grid ends after school_block, and the note is outside?
# Wait! In the original, the note is:
#           </div> (this closes prize-tables-grid)
#           {/* All participants note */}
# Let's check exactly what's between school_idx and cta_idx
remainder = text[school_idx:cta_idx]
# We want to reorder the blocks inside the grid.
# The grid content is from national_idx to the end of school_block.
# But school_block might include the closing div of the grid!
# Let's find the closing div of the grid.
# It should be right before `          {/* All participants note */}`.

# Let's just slice school_block up to the closing div of the grid.
# We'll find the last `          </div>` before note_idx
grid_close_idx = text.rfind('          </div>', school_idx, note_idx)
if grid_close_idx == -1:
    print("Could not find grid close")
    sys.exit(1)

school_block = text[school_idx:grid_close_idx]
grid_close_and_rest = text[grid_close_idx:cta_idx]
suffix = text[cta_idx:]

new_text = prefix + school_block + district_block + state_block + national_block + grid_close_and_rest + suffix

with open('src/app/rounds-and-prizes/page.tsx', 'w', encoding='utf-8') as f:
    f.write(new_text)

print('Successfully reordered! School -> District -> State -> National')
