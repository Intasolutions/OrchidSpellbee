import sys

with open('src/app/rounds-and-prizes/page.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

# Find indices
national_idx = text.find('            {/* National Prizes */}')
state_idx = text.find('            {/* State Prizes */}')
district_idx = text.find('            {/* District Prizes */}')
school_idx = text.find('            {/* School Prizes */}')

# Find the end of the grid
end_idx = text.find('          </div>\n        </div>\n      </div>\n\n      {/*', school_idx)
if end_idx == -1:
    end_idx = text.find('          </div>\n        </div>\n      </div>', school_idx)

if -1 in [national_idx, state_idx, district_idx, school_idx, end_idx]:
    print('Failed to find indices:')
    print('national', national_idx)
    print('state', state_idx)
    print('district', district_idx)
    print('school', school_idx)
    print('end', end_idx)
    sys.exit(1)
else:
    prefix = text[:national_idx]
    national_block = text[national_idx:state_idx]
    state_block = text[state_idx:district_idx]
    district_block = text[district_idx:school_idx]
    school_block = text[school_idx:end_idx]
    suffix = text[end_idx:]

    new_text = prefix + school_block + district_block + state_block + national_block + suffix

    with open('src/app/rounds-and-prizes/page.tsx', 'w', encoding='utf-8') as f:
        f.write(new_text)
    
    print('Successfully reordered blocks!')
