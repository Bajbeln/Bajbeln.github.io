#!/bin/bash

# Generate OG (Open Graph) images for spex pages
# Usage: bash scripts/generate-og-images.sh [--force]
#
# This script creates WebP OG images (1200x630) for:
# 1. The default/main page (og-image.webp) with neutral background rgb(210,231,250)
# 2. Each spex with a custom color defined in its JSON file
#
# Images are saved in: assets/images/og/
# The default og-image.webp is also copied to: assets/images/og-image.webp
#
# WebP quality: 85 (good balance between size and quality, ~90% smaller than 16-bit PNG)
#
# By default, this script only regenerates images when:
#   - The image doesn't exist yet
#   - The source JSON file is newer than the image
#   - The logo file is newer than the image
#
# Use --force to regenerate all images regardless of timestamps
#
# Dependencies: ImageMagick (magick), jq, xargs, stat

set -e

OG_DIR="assets/images/og"
SPEX_DIR="src/spex"
LOGO="assets/images/logga.webp"

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

# Number of parallel jobs - use number of CPU cores, or fall back to 4
PARALLEL_JOBS=$(nproc 2>/dev/null || sysctl -n hw.ncpu 2>/dev/null || echo 4)

# Check for --force flag
FORCE_REGENERATE=false
for arg in "$@"; do
    if [ "$arg" = "--force" ]; then
        FORCE_REGENERATE=true
    fi
done

echo "=========================================="
if [ "$FORCE_REGENERATE" = true ]; then
    echo "Generating OG images - FORCE MODE (all images will be regenerated)"
else
    echo "Generating OG images - INCREMENTAL MODE (only new/changed)"
fi
echo "=========================================="
echo "Canvas: ${CANVAS_WIDTH}x${CANVAS_HEIGHT}"
echo "Logo: ${LOGO_WIDTH}x${LOGO_HEIGHT} at position (${LOGO_X},${LOGO_Y})"
echo "Margins: ${MARGIN}px top and bottom"
echo "Parallel jobs: ${PARALLEL_JOBS}"
echo ""

# Create OG directory if it doesn't exist
mkdir -p "$OG_DIR"

# Function to check if an image needs regeneration
# Returns 0 (true) if regeneration is needed, 1 (false) otherwise
needs_regenerate() {
    local output="$1"
    local source_file="$2"
    
    # If output doesn't exist, we need to generate it
    if [ ! -f "$output" ]; then
        return 0
    fi
    
    # If in force mode, always regenerate
    if [ "$FORCE_REGENERATE" = true ]; then
        return 0
    fi
    
    # Check if logo is newer than output
    if [ -f "$LOGO" ]; then
        local logo_mtime
        logo_mtime=$(stat -c %Y "$LOGO" 2>/dev/null || stat -f %m "$LOGO" 2>/dev/null)
        local output_mtime
        output_mtime=$(stat -c %Y "$output" 2>/dev/null || stat -f %m "$output" 2>/dev/null)
        
        if [ "$logo_mtime" -gt "$output_mtime" ]; then
            return 0
        fi
    fi
    
    # Check if source file is newer than output
    if [ -f "$source_file" ]; then
        local source_mtime
        source_mtime=$(stat -c %Y "$source_file" 2>/dev/null || stat -f %m "$source_file" 2>/dev/null)
        local output_mtime
        output_mtime=$(stat -c %Y "$output" 2>/dev/null || stat -f %m "$output" 2>/dev/null)
        
        if [ "$source_mtime" -gt "$output_mtime" ]; then
            return 0
        fi
    fi
    
    # No need to regenerate
    return 1
}

# Function to generate OG image for a spex
generate_og() {
    local spex_name="$1"
    local bg_color="$2"
    local source_file="$3"  # The JSON file that defines the color
    local output="${OG_DIR}/og-${spex_name}.webp"
    
    # Check if we need to regenerate
    if needs_regenerate "$output" "$source_file"; then
        echo "  → ${spex_name}: ${bg_color} (regenerating)"
        
        magick -size ${CANVAS_WIDTH}x${CANVAS_HEIGHT} xc:"$bg_color" \
            \( "$LOGO" -resize ${LOGO_WIDTH}x${LOGO_HEIGHT} \) \
            -geometry +${LOGO_X}+${LOGO_Y} \
            -composite \
            -quality 85 \
            "$output" 2>/dev/null
    else
        echo "  → ${spex_name}: ${bg_color} (up-to-date, skipping)"
    fi
}

# Export function so it's available to subshells
export -f generate_og
export -f needs_regenerate

# Export variables needed by the functions
export OG_DIR CANVAS_WIDTH CANVAS_HEIGHT LOGO LOGO_WIDTH LOGO_HEIGHT LOGO_X LOGO_Y FORCE_REGENERATE

# Generate default og-image.webp (neutral/main page version)
# Background: rgb(210,231,250) - same as original og-image.png
DEFAULT_OUTPUT="${OG_DIR}/og-image.webp"

echo "Checking default OG image..."
if needs_regenerate "$DEFAULT_OUTPUT" "$LOGO"; then
    echo "  → Default OG image: regenerating"
    magick -size ${CANVAS_WIDTH}x${CANVAS_HEIGHT} xc:"rgb(210,231,250)" \
        \( "$LOGO" -resize ${LOGO_WIDTH}x${LOGO_HEIGHT} \) \
        -geometry +${LOGO_X}+${LOGO_Y} \
        -composite \
        -quality 85 \
        "$DEFAULT_OUTPUT" 2>/dev/null
    # Also copy to assets/images/ as the main og-image.webp
    cp "$DEFAULT_OUTPUT" assets/images/og-image.webp
else
    echo "  → Default OG image: up-to-date, skipping"
fi

# Count generated images
count=1  # og-image.png
regenerated_count=0
if needs_regenerate "$DEFAULT_OUTPUT" "$LOGO"; then
    regenerated_count=1
fi

# Process all spex with custom colors
echo ""
echo "Checking spex-specific OG images..."

# Collect all spex generation tasks into a temporary file
TASK_FILE=$(mktemp)
trap "rm -f '$TASK_FILE'" EXIT

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
            # Write task to temp file: spex_name, color, and json_file separated by pipe
            # Using null delimiter for xargs -0 compatibility
            printf '%s|%s|%s\0' "$spex_name" "$color" "$json_file" >> "$TASK_FILE"
            count=$((count + 1))
        fi
    fi
done

# If we have tasks, run them in parallel using xargs
if [ -s "$TASK_FILE" ]; then
    # Use -0 for null-delimited input, -P for parallelism
    # Each record is "spex_name|color|json_file" - split on pipe
    cat "$TASK_FILE" | xargs -0 -P "$PARALLEL_JOBS" -I {} bash -c '
        record="$1"
        spex_name="${record%%|*}"
        rest="${record#*|}"
        color="${rest%%|*}"
        json_file="${rest#*|}"
        generate_og "$spex_name" "$color" "$json_file"
    ' -- {}
fi

echo ""
echo "=========================================="
echo "Checked ${count} OG images (${regenerated_count} regenerated)"
echo "=========================================="
