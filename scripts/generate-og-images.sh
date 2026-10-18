#!/bin/bash

# Generate OG (Open Graph) images for spex pages
# Usage: bash scripts/generate-og-images.sh
#
# This script creates PNG OG images (1200x630) for:
# 1. The default/main page (og-image.png) with neutral background rgb(210,231,250)
# 2. Each spex with a custom color defined in its JSON file
#
# Images are saved in: assets/images/og/
# The default og-image.png is also copied to: assets/images/og-image.png
#
# Dependencies: ImageMagick (magick), jq

set -e

OG_DIR="assets/images/og"
SPEX_DIR="src/spex"
LOGO="assets/images/logga.png"

# Target dimensions
CANVAS_WIDTH=1200
CANVAS_HEIGHT=630

# Logo sizing for equal top/bottom margins
# Margins: 41px top and bottom
MARGIN=41
LOGO_HEIGHT=$(( CANVAS_HEIGHT - 2 * MARGIN ))
# Calculate width maintaining aspect ratio from logga.png (431x480)
LOGO_WIDTH=$(( 431 * LOGO_HEIGHT / 480 ))

# Position: centered horizontally
LOGO_X=$(( (CANVAS_WIDTH - LOGO_WIDTH) / 2 ))
LOGO_Y=$MARGIN

echo "=========================================="
echo "Generating OG images"
echo "=========================================="
echo "Canvas: ${CANVAS_WIDTH}x${CANVAS_HEIGHT}"
echo "Logo: ${LOGO_WIDTH}x${LOGO_HEIGHT} at position (${LOGO_X},${LOGO_Y})"
echo "Margins: ${MARGIN}px top and bottom"
echo ""

# Create OG directory if it doesn't exist
mkdir -p "$OG_DIR"

# Function to generate OG image for a spex
generate_og() {
    local spex_name="$1"
    local bg_color="$2"
    local output="${OG_DIR}/og-${spex_name}.png"
    
    echo "  → ${spex_name}: ${bg_color}"
    
    magick -size ${CANVAS_WIDTH}x${CANVAS_HEIGHT} xc:"$bg_color" \
        \( "$LOGO" -resize ${LOGO_WIDTH}x${LOGO_HEIGHT} \) \
        -geometry +${LOGO_X}+${LOGO_Y} \
        -composite \
        "$output" 2>/dev/null
}

# Generate default og-image.png (neutral/main page version)
# Background: rgb(210,231,250) - same as original og-image.png
echo "Generating default OG image..."
generate_og "image" "rgb(210,231,250)"

# Also copy to assets/images/ as the main og-image.png
cp "${OG_DIR}/og-image.png" assets/images/og-image.png

# Count generated images
count=1  # og-image.png

# Process all spex with custom colors
echo ""
echo "Generating spex-specific OG images..."

for spex_dir in "$SPEX_DIR"/*/; do
    # Skip template directories
    if [[ "$spex_dir" == *"_template_"* ]]; then
        continue
    fi
    
    dir_name=$(basename "$spex_dir")
    json_file="${spex_dir}${dir_name}.json"
    index_file="${spex_dir}index.md"
    
    if [ -f "$json_file" ]; then
        color=$(jq -r '.color // empty' "$json_file" 2>/dev/null)
        
        if [ -n "$color" ]; then
            # Use spex field from index.md if it exists, otherwise use directory name
            spex_name="$dir_name"
            if [ -f "$index_file" ]; then
                spex_field=$(grep "^spex:" "$index_file" | awk '{print $2}')
                if [ -n "$spex_field" ]; then
                    spex_name="$spex_field"
                fi
            fi
            generate_og "$spex_name" "$color"
            count=$((count + 1))
        fi
    fi
done

echo ""
echo "=========================================="
echo "Generated ${count} OG images"
echo "=========================================="
